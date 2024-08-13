import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import MainContainer from '../components/global/MainContainer';

const ShowEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ padding: 3, borderRadius: '10px', maxWidth: '500px', margin: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          아이디 찾기 결과
        </Typography>
        {email ? (
          <Typography variant="h6" align="center" sx={{ margin: '20px 0' }}>
            아이디(이메일): {email}
          </Typography>
        ) : (
          <Typography color="error" align="center" sx={{ margin: '20px 0' }}>
            이메일 정보를 가져오지 못했습니다.
          </Typography>
        )}
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/login')} sx={{ borderRadius: '10px', padding: '10px 0' }}>
          로그인 화면으로 돌아가기
        </Button>
      </Paper>
    </MainContainer>
  );
};

export default ShowEmail;
