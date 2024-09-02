import React, { useState, useCallback, useEffect } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from '../../components/board/CommentList';
import Pagination from '../../components/board/CommentPagination';
import MainContainer from '../../components/global/MainContainer';
import {
  CircularProgress, Grid, Alert, Container, Typography, Box, Dialog, DialogContent, IconButton
} from '@mui/material';
import { ThumbUp, ThumbDown, Visibility } from '@mui/icons-material';
import { Btn, TextF } from '../../components/global/CustomComponents';
import PersonIcon from '@mui/icons-material/Person';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const userRole = localStorage.getItem('userRole');
  const loggedInUserId = Number(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');

  const getAuthHeaders = () => ({
    'Authorization': `${token}`
  });

  const isLoggedIn = () => token !== null;

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`, { headers: getAuthHeaders() });
      setPost(response.data);
      setBoardId(response.data.boardId);
    } catch (error) {
      setError('게시물을 가져오는 데 실패했습니다.');
    }
  };

  const fetchComments = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/post/${id}?page=${page}&size=6`, { headers: getAuthHeaders() });
      const commentsData = response.data.content;

      const nestedComments = commentsData.reduce((acc, comment) => {
        if (comment.parentId === null) {
          acc.push({ ...comment, replies: [] });
        } else {
          const parentComment = acc.find(c => c.id === comment.parentId);
          if (parentComment) {
            parentComment.replies.push(comment);
          }
        }
        return acc;
      }, []);

      setComments(nestedComments);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      setError('댓글을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments(0);
  }, [fetchComments, id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 추가할 수 있습니다.');
      return;
    }
    if (commentText.trim() === '') {
      alert('댓글을 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('/comments', { postId: id, content: commentText }, { headers: getAuthHeaders() });
      setCommentText('');
      fetchComments(currentPage);
    } catch (error) {
      alert('댓글을 추가하는 데 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!isLoggedIn()) {
      alert('로그인 후 포스트를 삭제할 수 있습니다.');
      return;
    }
    try {
      await axiosInstance.delete(`/posts/${id}`, { headers: getAuthHeaders() });
      navigate(boardId ? `/boards/${boardId}` : '/boards');
    } catch (error) {
      alert('자신이 작성한 게시글만 삭제할 수 있습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 삭제할 수 있습니다.');
      return;
    }
    try {
      await axiosInstance.delete(`/comments/${commentId}`, { headers: getAuthHeaders() });
      fetchComments(currentPage);
    } catch (error) {
      alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 수정할 수 있습니다.');
      return;
    }
    try {
      await axiosInstance.put(`/comments/${commentId}`, { postId: id, content }, { headers: getAuthHeaders() });
      fetchComments(currentPage);
    } catch (error) {
      alert('자신이 작성한 댓글만 수정할 수 있습니다.');
    }
  };

  const handleReplyComment = async (parentId, content) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글에 답글을 추가할 수 있습니다.');
      return;
    }
    try {
      await axiosInstance.post('/comments', { postId: id, content, parentId }, { headers: getAuthHeaders() });
      fetchComments(currentPage);
    } catch (error) {
      alert('답글 추가에 실패했습니다.');
    }
  };

  const handlePageChange = (page) => {
    fetchComments(page);
  };

  const handleImageClick = (imgLink) => {
    setSelectedImage(imgLink);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
  };

  const handleUpdatePost = () => {
    if (!isLoggedIn()) {
      alert('로그인 후 포스트를 수정할 수 있습니다.');
      return;
    }
    if (loggedInUserId !== post.userId && userRole !== 'ADMIN') {
      alert('자신이 작성한 게시글만 수정할 수 있습니다.');
      return;
    }
    navigate(`/posts/update/${id}`);
  };

  const handleLikePost = async () => {
    if (!isLoggedIn()) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }
    try {
      await axiosInstance.post(`/posts/${id}/like`, null, { headers: getAuthHeaders() });
      fetchPost();
    } catch (error) {
      alert('이미 좋아요를 누른 게시물입니다.');
    }
  };

  const handleDislikePost = async () => {
    if (!isLoggedIn()) {
      alert('로그인 후 싫어요를 누를 수 있습니다.');
      return;
    }
    try {
      await axiosInstance.delete(`/posts/${id}/like`, { headers: getAuthHeaders() });
      fetchPost();
    } catch (error) {
      alert('이미 좋아요를 취소한 게시물입니다.');
    }
  };

  const handleIncrementViews = async () => {
    try {
      await axiosInstance.post(`/posts/${id}/view`, null, { headers: getAuthHeaders() });
      fetchPost();
    } catch (error) {
      console.error('조회수 증가에 실패했습니다.');
    }
  };

  useEffect(() => {
    handleIncrementViews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!post) {
    return <Typography>포스트를 불러오는 중입니다...</Typography>;
  }

  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {post.title}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
                {/* 이미지공간 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {post.userImg ? (
                    <img
                      src={post.userImg}
                      alt="Profile"
                      style={{
                        backgroundColor: '#E9E9E9',
                        width: '35px',
                        height: '35px',
                        padding: '5px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: '50%',
                      }}
                      onClick={() => handleImageClick(post.userImg)}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '35px',
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#E9E9E9',
                        borderRadius: '50%',
                      }}
                    >
                      <PersonIcon
                        sx={{
                          width: '24px',
                          height: '24px',
                          color: '#B0B0B0', // 아이콘 색상
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Typography variant="h8">
                  {post.userName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: 1 }}>
                  <Visibility/>
                  <Typography variant="caption">{post.viewCount}</Typography>
                </Box>
            </Grid>


            <Grid item xs={12}>
              {(loggedInUserId === post.userId || userRole === 'ADMIN') && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, pb: 2, borderBottom: '1px solid #ccc' }}>
                  <Btn
                    sx={{ mr: 1, width: '15px' }}
                    onClick={handleUpdatePost}
                  >
                    수정
                  </Btn>
                  <Btn onClick={handleDeletePost} sx = {{ width: '15px' }}>삭제</Btn>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {post.content.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
            </Grid>
              {post.imageUrls && post.imageUrls.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {post.imageUrls.map((img, index) => (
                    <img
                      key={index}
                      src={img.link}
                      alt={`image-${index}`}
                      style={{
                        width: '408px',
                        height: 'auto',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: '8px',
                      }}
                      onClick={() => handleImageClick(img.link)}
                    />
                  ))}
                </Box>
              )}
            <Grid item xs={12} sx = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <IconButton
              onClick={handleLikePost}
              sx={{
                color: 'var(--main-common)',
                '&:hover': {
                  color: 'var(--main-deep)'
                },
                '&:active': {
                  color: 'var(--main-deep)'
                }
              }}
            >
              <ThumbUp />
            </IconButton>
            <Typography variant="caption">{post.likeCount}</Typography>
            <IconButton
              onClick={handleDislikePost}
              sx={{
                color: '#E9E9E9',
                '&:hover': {
                  color: '#BDBDBD'
                },
                '&:active': {
                  color: '#9E9E9E'
                }
              }}
            >
              <ThumbDown />
            </IconButton>
              <Typography variant="caption">{post.dislikeCount}</Typography>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleCommentSubmit}>
                <TextF
                  label="Add Comment..."
                  rows={2}
                  variant="outlined"
                  fullWidth
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Btn type="submit" sx = {{ marginTop: 2, marginLeft: 'auto', width: '15px' }}>
                  작성
                </Btn>
              </form>
            </Grid>
            <Grid item xs={12}>
              <CommentList
                comments={comments}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
                onReply={handleReplyComment}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
              >
                <DialogContent>
                  <img
                    src={selectedImage}
                    alt="Expanded View"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </DialogContent>
              </Dialog>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
}

export default PostDetailPage;
