import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Snackbar, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import InputMask from 'react-input-mask';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import PostCodeModal from '../../components/PostCodeModal';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const Register = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    name: '',
    birthday: '',
    address: '',
    addressDetail: '',
    image: '',
  });

  const [SnackbarOpen, setSnackbarOpen] = useState(false);
  const [postcodeOpen, setPostcodeOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const EmailValidation = () => {
    let check = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return !check.test(formState.email);
  };

  const PhonenumberValidation = () => {
    let check = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return !check.test(formState.phoneNumber);
  };

  const OnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/users', {
        email: formState.email,
        password: formState.password,
        phoneNumber: formState.phoneNumber,
        name: formState.name,
        birthday: formState.birthday,
        address: formState.address,
        addressDetail: formState.addressDetail,
        image: formState.image,
      });

      console.log(response.data);
      setSnackbarOpen(true);
      navigate('/');
      window.alert('회원가입이 완료되었습니다!');
    } catch (exception) {
      console.log(exception);
    }
  };

  const SnackCloseHandle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
    navigate('/login');
  };

  const handleAddressComplete = (fullAddress) => {
    setFormState((prevState) => ({
      ...prevState,
      address: fullAddress,
    }));
    setPostcodeOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profileImages/${formState.email}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
      },
      (error) => {
        console.error('업로드 에러:', error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormState((prevState) => ({
            ...prevState,
            image: downloadURL,
          }));
          setUploading(false);
        });
      }
    );
  };

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <Typography variant='h5' align='center' gutterBottom sx={{ margin: '0px 0px 30px 0px' }}>회원 가입</Typography>
        <form>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Avatar
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
              src={formState.image}
            >
              {formState.name ? formState.name[0] : ''}
            </Avatar>
          </Box>
          <Box sx={{ margin: "20px 0", borderBottom: "1px solid grey" }}></Box>
          프로필 이미지 업로드(선택사항) -
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>이미지 업로드 중...</p>}
          <Box sx={{ margin: "20px 0", borderBottom: "1px solid grey" }}></Box>

          <TextField
            label="이메일"
            name="email"
            type='email'
            size='small'
            error={EmailValidation()}
            sx={{ margin: '0px 0px 10px 0px' }}
            fullWidth
            onChange={handleChange}
            helperText={EmailValidation() ? "이메일 형식이 잘못되었습니다." : ""}
          />

          <TextField
            label="비밀번호"
            name="password"
            type='password'
            size='small'
            sx={{ margin: '0px 0px 10px 0px' }}
            fullWidth
            onChange={handleChange}
          />

          <InputMask
            mask="999-9999-9999"
            value={formState.phoneNumber}
            onChange={handleChange}
          >
            {() => (
              <TextField
                label="휴대폰 번호"
                name="phoneNumber"
                size='small'
                error={PhonenumberValidation()}
                sx={{ margin: '0px 0px 10px 0px' }}
                fullWidth
                helperText={PhonenumberValidation() ? "휴대폰 번호의 형식이 잘못되었습니다." : ""}
              />
            )}
          </InputMask>

          <TextField
            label="닉네임"
            name="name"
            type='name'
            size='small'
            sx={{ margin: '0px 0px 10px 0px' }}
            fullWidth
            onChange={handleChange}
          />

          <InputMask
            mask="9999-99-99"
            value={formState.birthday}
            onChange={handleChange}
          >
            {() => (
              <TextField
                label="생년월일"
                name="birthday"
                size='small'
                sx={{ margin: '0px 0px 10px 0px' }}
                fullWidth
              />
            )}
          </InputMask>

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              label="주소"
              name="address"
              size='small'
              sx={{ marginRight: '10px' }}
              fullWidth
              value={formState.address}
              disabled
            />
            <Button variant="contained" onClick={() => setPostcodeOpen(true)} sx={{ height: '40px' }}>
              검색
            </Button>
          </Box>
          <TextField
            label="상세주소"
            name="addressDetail"
            size='small'
            fullWidth
            onChange={handleChange}
          />

          <Button
            type='submit'
            variant="contained"
            fullWidth
            sx={{ borderRadius: '5px', margin: '15px 0' }}
            onClick={OnSubmit}
          >
            가입
          </Button>
          <Snackbar
            open={SnackbarOpen}
            autoHideDuration={3000}
            onClose={SnackCloseHandle}
            message="회원가입이 완료되었습니다."
          />
        </form>
      </Paper>

      <PostCodeModal open={postcodeOpen} onClose={() => setPostcodeOpen(false)} onComplete={handleAddressComplete} />
    </MainContainer>
  );
};

export default Register;
