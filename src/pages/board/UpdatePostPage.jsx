import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import UpdatePostForm from '../../components/board/UpdatePostForm';
import MainContainer from '../../components/global/MainContainer';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `${token}`
  };
}

function UpdatePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  useEffect(() => {
    axiosInstance.get(`/posts/${id}`, {
      headers: getAuthHeaders()
    })
      .then(response => setPost(response.data))
      .catch(error => setError('포스트를 가져오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdatePost = async (updatedPost) => {
    if (!isLoggedIn()) {
      alert('로그인 후 포스트를 수정할 수 있습니다.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/posts/${id}`, updatedPost, {
        headers: getAuthHeaders()
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      setError('포스트 수정에 실패했습니다.');
      console.error('Failed to update post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return <Typography variant="h6">Loading post...</Typography>;

  return (
    <MainContainer>
      <UpdatePostForm post={post} onUpdate={handleUpdatePost} />
    </MainContainer>
  );
}

export default UpdatePostPage;
