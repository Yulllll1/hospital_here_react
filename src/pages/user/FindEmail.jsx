import React, { useState } from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';
import { TextF, Btntwo } from '../../components/global/CustomComponents';
import InputMask from 'react-input-mask';

const FindEmail = () => {
  const [state, setState] = useState({
    userName: '',
    phoneNumber: '',
    message: ''
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
      const response = await axiosInstance.post('/email-search', { userName: state.userName, phoneNumber: state.phoneNumber });
      navigate('/show-email', { state: { email: response.data } });
    } catch (error) {
      let errorMessage = '아이디 찾기에 실패했습니다.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      window.alert('정보가 일치하지 않습니다. 다시 확인해주세요.');
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
            아이디(이메일) 찾기
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextF
              label="이름(닉네임)"
              name="userName"
              type="text"
              value={state.userName}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <InputMask
              mask="010-9999-9999"
              value={state.phoneNumber}
              onChange={handleInputChange}
            >
              {() => (
                <TextF
                  label="전화번호"
                  name="phoneNumber"
                  type="text"
                  fullWidth
                  required
                  margin="normal"
                />
              )}
            </InputMask>
            <Btntwo type="submit" sx={{ width: '100%', marginTop: 2 }}>
              아이디 찾기
            </Btntwo>
          </form>
          {state.message && <Typography color="error" align="center">{state.message}</Typography>}
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

export default FindEmail;
