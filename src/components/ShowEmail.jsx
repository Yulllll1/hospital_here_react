import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import MainContainer from '../components/global/MainContainer';
import { Btn, Btntwo } from './global/CustomComponents';

const ShowEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  return (
    <MainContainer>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80dvh',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 5 }}>
            아이디 찾기 결과
          </Typography>
          {email ? (
            <Typography variant="h6" sx={{ margin: '20px 0' }}>
              아이디(이메일): {email}
            </Typography>
          ) : (
            <Typography color="error" sx={{ margin: '20px 0' }}>
              이메일 정보를 가져오지 못했습니다.
            </Typography>
          )}
          <Btntwo
            variant="contained"
            sx={{ width: '100%', marginTop: 2 }}
          >
            로그인 화면으로 돌아가기
          </Btntwo>
        </Box>
      </Container>
    </MainContainer>
  );
};

export default ShowEmail;
