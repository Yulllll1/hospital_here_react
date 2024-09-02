import React, { useState } from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import MainContainer from "../../components/global/MainContainer";
import { TextF, Btntwo } from '../../components/global/CustomComponents';

const RequestEmailVerification = () => {
  const [state, setState] = useState({
    email: '',
    verificationCode: '',
    message: '',
    codeSent: false,
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!state.codeSent) {
        await axiosInstance.post('/email-verified', { email: state.email });
        setState((prevState) => ({
          ...prevState,
          message: '인증 코드가 이메일로 전송되었습니다.',
          codeSent: true,
        }));
      } else {
        await axiosInstance.post('/password-reset', { verified: state.verificationCode });
        window.alert('비밀번호 재설정이 완료되었습니다. 이메일을 확인하세요.');
        navigate('/login');
      }
    } catch (error) {
      let errorMessage = '인증번호가 틀렸습니다.';
      if (error.message === 'Request failed with status code 400') {
        errorMessage = '찾을 수 없는 이메일입니다.';
      }
      setState((prevState) => ({
        ...prevState,
        message: errorMessage,
      }));
    }
  };

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
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 5 }}>
            이메일 인증 및 비밀번호 재설정
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextF
              label="이메일"
              name="email"
              type="email"
              value={state.email}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              disabled={state.codeSent}
              sx={{
                '& .MuiInputBase-root': {
                  width: '100%',
                }
              }}
            />
            {state.codeSent && (
              <TextF
                label="인증 코드"
                name="verificationCode"
                type="text"
                value={state.verificationCode}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"

              />
            )}
            <Btntwo type="submit" sx={{ width: '100%', marginTop: 2 }}>
              {state.codeSent ? '비밀번호 재설정' : '인증 코드 요청'}
            </Btntwo>
          </form>
          {state.message && (
            <Typography
              color={state.codeSent ? 'success' : 'error'}
              align="center"
              sx={{ marginTop: '10px' }}
            >
              {state.message}
            </Typography>
          )}
          <Button
            onClick={() => navigate('/login')}
            fullWidth
            sx={{ marginTop: '15px', color: 'green',
              '&:hover': {
                color: '#66bb6a',
              },
            }}
          >
            로그인 화면으로 돌아가기
          </Button>
        </Box>
      </Container>
    </MainContainer>
  );
};

export default RequestEmailVerification;
