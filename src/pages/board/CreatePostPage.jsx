import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import CreatePostForm from '../../components/board/CreatePostForm';
import MainContainer from '../../components/global/MainContainer';
import { CircularProgress, Box, Alert, Typography, Button } from '@mui/material';

// Auth 헤더를 반환하는 함수
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `${token}`
  };
}

function CreatePostPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  const handleSubmit = async (data) => {
    if (!isLoggedIn()) {
      alert('로그인 후 포스트를 작성할 수 있습니다.');
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await axiosInstance.post(`/posts`, { ...data, boardId }, {
        headers: getAuthHeaders()
      });
      navigate(`/boards/${boardId}`);
    } catch (error) {
      setError('포스트 작성에 실패했습니다.');
      console.error('Failed to create post:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>

        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            <CreatePostForm onSubmit={handleSubmit} />
            {/* <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/boards/${boardId}`)}
              >
                Back to prev
              </Button>
            </Box> */}
          </>
        )}
      </Box>
    </MainContainer>
  );
}

export default CreatePostPage;
