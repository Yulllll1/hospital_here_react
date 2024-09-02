import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../utils/axios';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import MainContainer from '../components/global/MainContainer';
import { useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';
import NaverLoginButton from '../components/NaverLogin';
import { Btntwo, TextF } from '../components/global/CustomComponents';

const CustomButton = ({ text, onClick }) => {
  return (
    <Button
      type="button"
      sx={{
        flex: '1 1 auto',
        color: 'black',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&:focus': {
          backgroundColor: 'transparent',
        },
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

const Login = () => {
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
    rememberMe: false,
    message: ''
  });
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);


  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setLoginState((prevState) => ({
        ...prevState,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRememberMeChange = (event) => {
    setLoginState((prevState) => ({
      ...prevState,
      rememberMe: event.target.checked
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { userId, role } = await userLogin(loginState.email, loginState.password);

      if (loginState.rememberMe) {
        localStorage.setItem('rememberedEmail', loginState.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setLoginState((prevState) => ({
        ...prevState,
        message: '로그인 성공'
      }));
      setAuthState({ isLoggedIn: true, userId, role });
      localStorage.setItem('userRole', role);
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
      window.location.href = '/oauth2/authorization/google';
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  return (
    <MainContainer>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80dvh',
          py: 4
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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextF
              label="이메일"
              name="email"
              type="email"
              value={loginState.email}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextF
              label="비밀번호"
              name="password"
              type="password"
              value={loginState.password}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={loginState.rememberMe}
                  onChange={handleRememberMeChange}
                  color="primary"
                />
              }
              label="이메일 기억하기"
              sx={{ alignSelf: 'flex-start', marginTop: 1 }}
            />
            <Btntwo type="submit" sx={{ width: '100%', marginTop: 2 }}>
              Login
            </Btntwo>
          </form>
          {loginState.message && <Typography color="error" align="center">{loginState.message}</Typography>}
          <Grid container alignItems="center" justifyContent="center" sx={{ marginTop: 2 }}>
            <Grid item>
              <CustomButton text="아이디 찾기" onClick={handelFindEmail} />
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ marginX: 1 }} />
            <Grid item>
              <CustomButton text="비밀번호 찾기" onClick={navigateVerified} />
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ marginX: 1 }} />
            <Grid item>
              <CustomButton text="회원 가입" onClick={navigateRegister} />
            </Grid>
          </Grid>
          <Divider sx={{ width: '100%', marginY: 3 }}>
            <Typography variant="body2" color="textSecondary">
              or
            </Typography>
          </Divider>
          <Grid sx={{ display: 'flex', marginTop: 2, gap : 3 }}>
            <Box sx={{ cursor: 'pointer' }} onClick={handleGoogleLogin}>
              <img
                src='/images/googlelogin.png'
                alt="구글 로그인"
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
            <NaverLoginButton />
          </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
};

export default Login;
