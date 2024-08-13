import React, { useEffect, useState, useCallback } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostList from '../../components/board/PostList';
import MainContainer from '../../components/global/MainContainer';
import Pagination from '../../components/board/Pagination';
import PostSearchBar from '../../components/board/PostSearchBar';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Box, Typography } from '@mui/material';

function BoardDetailPage() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const fetchPosts = useCallback((page, query) => {
        setLoading(true);
        axiosInstance.get(`/posts/board/${id}`, {
            params: {
                title: query || '',
                page: page,
                size: 6
            }
        })
        .then(response => {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch(() => setError('게시물을 가져오는 데 실패했습니다.'))
        .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        axiosInstance.get(`/boards/${id}`)
            .then(response => setBoard(response.data))
            .catch(() => setError('게시판 정보를 가져오는 데 실패했습니다.'));

        fetchPosts(currentPage, searchQuery);
    }, [id, currentPage, searchQuery, fetchPosts]);

    const handleDeleteBoard = async () => {
        try {
            await axiosInstance.delete(`/boards/${id}`);
            navigate('/boards');
        } catch {
            setError('게시판 삭제에 실패했습니다.');
        } finally {
            setOpenDialog(false);
        }
    };

    const handleSearch = (data) => {
        setPosts(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(0);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!board) return <p>게시판을 불러오는 중입니다...</p>;

    return (
        <MainContainer>
            <Box sx={{ marginTop: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                    <PostSearchBar onSearch={handleSearch} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{board.name}</Typography>
                    <Box>
                        <Button component={Link} to={`/boards/update/${id}`} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                            UPDATE
                        </Button>
                        <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
                            DELETE
                        </Button>
                    </Box>
                </Box>
                <PostList posts={posts} boardId={id} />
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>게시판 삭제</DialogTitle>
                <DialogContent>정말로 게시판을 삭제하시겠습니까?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">취소</Button>
                    <Button onClick={handleDeleteBoard} color="error">삭제</Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
}

export default BoardDetailPage;
