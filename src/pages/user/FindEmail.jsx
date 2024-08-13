import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';

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
      <Paper elevation={6} sx={{ padding: 3, borderRadius: '10px', maxWidth: '500px', margin: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          아이디 찾기
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="이름"
            name="userName"
            type="text"
            value={state.userName}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="전화번호"
            name="phoneNumber"
            type="text"
            value={state.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: '10px', padding: '10px 0' }}>
            아이디 찾기
          </Button>
        </form>
        {state.message && <Typography color="error" align="center" sx={{ marginTop: '10px' }}>{state.message}</Typography>}
      </Paper>
    </MainContainer>
  );
};

export default FindEmail;
