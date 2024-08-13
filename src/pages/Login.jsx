import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, axiosInstance } from '../utils/axios';
import { TextField, Button, Typography, Paper, Container, Box } from '@mui/material';
import MainContainer from '../components/global/MainContainer';
import { useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';
import NaverLoginButton from '../components/NaverLogin';

const Login = () => {
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
    message: ''
  });
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { userId, role } = await userLogin(loginState.email, loginState.password);
      setLoginState((prevState) => ({
        ...prevState,
        message: '로그인 성공'
      }));
      setAuthState({ isLoggedIn: true, userId, role });
      navigate('/');
    } catch (error) {
      let errorMessage = '비밀번호가 일치하지 않습니다';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setLoginState((prevState) => ({
        ...prevState,
        message: errorMessage
      }));
    }
  };

  const navigateRegister = () => {
    navigate('/register');
  };
  const navigateVerified = () => {
    navigate('/email-verified');
  };
  const handelFindEmail = () => {
    navigate('/find-email');
  }
  const handleGoogleLogin = async () => {
    try {
      console.log('구글 로그인 시작');
      window.location.href = 'https://kdt-cloud-3-team05-final.elicecoding.com/oauth2/authorization/google';
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ padding: 3, borderRadius: '10px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          로그인
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="이메일"
            name="email"
            type="email"
            value={loginState.email}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="비밀번호"
            name="password"
            type="password"
            value={loginState.password}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: '10px', padding: '10px 0' }}>
            로그인
          </Button>
        </form>
        {loginState.message && <Typography color="error" align="center">{loginState.message}</Typography>}
      </Paper>

      <Container fixed fullWidth sx={{ margin: '15px 0', display: 'flex', flexDirection: 'row' }}>
        <Button type="button" sx={{ flex: '1 1 auto' }} onClick={handelFindEmail}>
          아이디 찾기
        </Button>
        <Button type="button" sx={{ flex: '1 1 auto' }} onClick={navigateVerified}>
          비밀번호 찾기
        </Button>
        <Button type="button" sx={{ flex: '1 1 auto' }} onClick={navigateRegister}>
          회원 가입
        </Button>
      </Container>
      <Button onClick={handleGoogleLogin}>구글 로그인</Button>
      <NaverLoginButton />
    </MainContainer>
  );
};

export default Login;
