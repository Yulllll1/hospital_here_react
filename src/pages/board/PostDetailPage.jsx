import React, { useState, useCallback, useEffect } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from '../../components/board/CommentList';
import Pagination from '../../components/board/CommentPagination';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress, Alert, TextField, Typography, Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { ThumbUp, ThumbDown, Visibility } from '@mui/icons-material';

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
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `${token}`
    };
  }

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`, { headers: getAuthHeaders() });
      setPost(response.data);
      setBoardId(response.data.boardId);
      setUserId(response.data.userId);
      setUserName(response.data.userName);
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
      const response = await axiosInstance.post('/comments', { postId: id, content: commentText, userName }, { headers: getAuthHeaders() });
      setComments([...comments, response.data]);
      setCommentText('');
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

    const comment = findCommentById(commentId, comments);
    if (!comment) {
      alert('댓글을 찾을 수 없습니다.');
      return;
    }

    try {
      await axiosInstance.delete(`/comments/${commentId}`, { headers: getAuthHeaders() });
      setComments(removeCommentById(commentId, comments));
    } catch (error) {
      alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 수정할 수 있습니다.');
      return;
    }

    const comment = findCommentById(commentId, comments);
    if (!comment) {
      alert('댓글을 찾을 수 없습니다.');
      return;
    }

    try {
      const response = await axiosInstance.put(`/comments/${commentId}`, { postId: id, content: content }, { headers: getAuthHeaders() });
      setComments(comments.map(comment => comment.id === commentId ? response.data : comment));
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
      const response = await axiosInstance.post('/comments', { postId: id, content: content, parentId: parentId, userName }, { headers: getAuthHeaders() });
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data]
          };
        }
        return comment;
      }));
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

    const loggedInUserId = localStorage.getItem('userId'); // Assume you store the logged-in user's ID in local storage

    if (loggedInUserId !== userId) {
      alert('자신이 작성한 게시글만 수정할 수 있습니다.');
      return;
    }

    navigate(`/posts/update/${id}`);
  };

  const findCommentById = (id, comments) => {
    for (const comment of comments) {
      if (comment.id === id) {
        return comment;
      }
      if (comment.replies) {
        const found = findCommentById(id, comment.replies);
        if (found) return found;
      }
    }
    return null;
  };

  const removeCommentById = (id, comments) => {
    return comments.reduce((result, comment) => {
      if (comment.id !== id) {
        result.push({
          ...comment,
          replies: removeCommentById(id, comment.replies || [])
        });
      }
      return result;
    }, []);
  };

  const handleLikePost = async () => {
    if (!isLoggedIn()) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }

    try {
      await axiosInstance.post(`/posts/${id}/like`, null, { headers: getAuthHeaders() });
      fetchPost(); // 좋아요가 업데이트되었으니 다시 포스트를 가져옵니다.
    } catch (error) {
      alert('좋아요 추가에 실패했습니다.');
    }
  };

  const handleDislikePost = async () => {
    if (!isLoggedIn()) {
      alert('로그인 후 싫어요를 누를 수 있습니다.');
      return;
    }

    try {
      await axiosInstance.delete(`/posts/${id}/like`, { headers: getAuthHeaders() });
      fetchPost(); // 싫어요가 업데이트되었으니 다시 포스트를 가져옵니다.
    } catch (error) {
      alert('싫어요 추가에 실패했습니다.');
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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return <Typography>포스트를 불러오는 중입니다...</Typography>;

  return (
    <MainContainer>
      <br />
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4">{post.title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" display="block">
          {post.userName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton onClick={handleLikePost} color="primary">
            <ThumbUp />
          </IconButton>
          <Typography variant="caption">{post.likeCount}</Typography>
          <IconButton onClick={handleDislikePost} color="error">
            <ThumbDown />
          </IconButton>
          <Typography variant="caption">{post.dislikeCount}</Typography>
          <Visibility sx={{ ml: 2 }} />
          <Typography variant="caption">{post.viewCount}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={handleUpdatePost}
        >
          UPDATE
        </Button>
        <Button variant="contained" color="error" onClick={handleDeletePost}>DELETE</Button>
      </Box>
      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {post.imageUrls.map((img, index) => (
            <img
              key={index}
              src={img.link}
              alt={`image-${index}`}
              style={{
                width: '425px',
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
      <br />
      <form onSubmit={handleCommentSubmit}>
        <TextField
          label="Add Comment..."
          multiline
          rows={2}
          variant="outlined"
          fullWidth
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Comment
        </Button>
      </form>
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
    </MainContainer>
  );
}

export default PostDetailPage;
