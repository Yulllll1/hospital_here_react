import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const NaverLoginButton = () => {
  const navigate = useNavigate();

  const handleNaverLogin = async () => {
    try {
      console.log("네이버 로그인 시작");
      window.location.href = "/oauth2/authorization/naver";
    } catch (error) {
      console.error('네이버 로그인 실패', error);
    }
  };

  return (
    <Box sx={{ cursor: 'pointer' }} onClick={handleNaverLogin}>
      <img
        src='/images/naverlogin.png'
        alt="네이버 로그인"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '175px',
          maxHeight: '45px',
          objectFit: 'contain',
          margin: 0,
          padding: 0,
          '@media (max-width: 600px)': {
            maxWidth: '120px',
            maxHeight: '31px',
          },
          '@media (min-width: 601px) and (max-width: 960px)': {
            maxWidth: '150px',
            maxHeight: '39px',
          },
          '@media (min-width: 961px)': {
            maxWidth: '175px',
            maxHeight: '45px',
          },
        }}
      />
    </Box>
  );
};

export default NaverLoginButton;