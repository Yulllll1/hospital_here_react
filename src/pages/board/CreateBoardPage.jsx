import React from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import BoardForm from '../../components/board/BoardForm';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress, Typography, Box, Alert } from '@mui/material';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `${token}`
  };
}

function CreateBoardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await axiosInstance.post('/boards', data, {
        headers: getAuthHeaders()
      });
      navigate('/boards');
    } catch (error) {
      setError('게시판 생성 중 오류가 발생했습니다.');
      console.error('게시판 생성 오류:', error);
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
          <CircularProgress />
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            <BoardForm onSubmit={handleSubmit} />

            {/* 주석 처리
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/boards')}
              >
                Back to prev
              </Button>
            </Box>
            */}
            
          </>
        )}
      </Box>
    </MainContainer>
  );
}

export default CreateBoardPage;
