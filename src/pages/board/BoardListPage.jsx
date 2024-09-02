import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';
import BoardList from '../../components/board/BoardList';
import Pagination from '../../components/board/Pagination';
import BoardSearchBar from '../../components/board/BoardSearchBar';
import { CircularProgress, Alert, Container, Grid, Typography, Box } from '@mui/material';
import { Btn, TextF } from '../../components/global/CustomComponents';

function BoardListPage() {
    const [boards, setBoards] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBoards = useCallback((page, query) => {
        setLoading(true);
        axiosInstance.get('/boards/search', {
            params: {
                name: query || '',
                page: page,
                size: 6
            }
        })
        .then(response => {
            setBoards(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch(() => setError('게시판 목록을 가져오는 데 실패했습니다.'))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchBoards(currentPage, searchQuery);
    }, [currentPage, searchQuery, fetchBoards]);

    const handleSearch = (data) => {
        setBoards(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(0);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <MainContainer>
            <Container>
                <Box sx={{ flexGrow: 1, marginTop: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx = {{ display: 'flex', justifyContent: 'center'}}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                    게시판
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <BoardSearchBar onSearch={handleSearch} />
                        </Grid>
                        <Grid item xs={12}>
                            <BoardList boards={boards}></BoardList>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </MainContainer>
    );
}

export default BoardListPage;
