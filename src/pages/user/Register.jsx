import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Snackbar, Avatar } from '@mui/material';
import InputMask from 'react-input-mask';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import PostCodeModal from '../../components/PostCodeModal';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { Btntwo, TextF } from '../../components/global/CustomComponents';

const Register = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    name: '',
    birthday: '',
    address: '',
    addressDetail: '',
    image: '',
    verificationCode: '',
  });

  const [SnackbarOpen, setSnackbarOpen] = useState(false);
  const [postcodeOpen, setPostcodeOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const EmailValidation = () => {
    let check = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return !check.test(formState.email);
  };

  const PhonenumberValidation = () => {
    let check = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return !check.test(formState.phoneNumber);
  };

  const PasswordsMatch = () => {
    return formState.password === formState.confirmPassword;
  };

  const sendVerificationEmail = async () => {
    try {
      const response = await axiosInstance.post('/register/email', { email: formState.email });
      setIsEmailSent(true);
      window.alert('인증 코드가 발송되었습니다.');
    } catch (exception) {
      console.log(exception);
      window.alert('인증 코드 발송에 실패하였습니다.');
    }
  };

  const verifyEmailCode = async () => {
    try {
      const response = await axiosInstance.post('/register/email/success', {
        email: formState.email,
        verified: formState.verificationCode,
      });

      if (response.data === '인증확인') {
        setIsEmailVerified(true);
        window.alert('이메일 인증이 완료되었습니다.');
      } else {
        window.alert('인증 코드가 잘못되었습니다.');
      }
    } catch (exception) {
      console.log(exception);
      window.alert('인증 코드가 잘못되었습니다.');
    }
  };

  const OnSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      window.alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (!PasswordsMatch()) {
      window.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

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
      (snapshot) => {},
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
      <Paper elevation={0} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <Typography variant='h5' align='center' gutterBottom sx={{ fontWeight: 'bold', margin: '0px 0px 30px 0px' }}>회원 가입</Typography>
        <form>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Avatar sx={{ width: 100, height: 100, cursor: 'pointer' }} src={formState.image}>
              {formState.name ? formState.name[0] : ''}
            </Avatar>
          </Box>
          <Box sx={{ margin: "20px 0", borderBottom: "1px solid grey" }}></Box>
          프로필 이미지 업로드(선택사항) -
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>이미지 업로드 중...</p>}
          <Box sx={{ margin: "20px 0", borderBottom: "1px solid grey" }}></Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
            <TextF
              label="이메일"
              name="email"
              type='email'
              size='small'
              error={EmailValidation()}
              sx={{ marginRight: '10px' }}
              fullWidth
              onChange={handleChange}
              helperText={EmailValidation() ? "이메일 형식이 잘못되었습니다." : ""}
              disabled={isEmailSent}
              InputLabelProps={{ shrink: true }}
            />
            <Btntwo
              variant="contained"
              onClick={sendVerificationEmail}
              disabled={isEmailSent || EmailValidation()}
              sx={{ height: '40px' }}
            >
              코드 발송
            </Btntwo>
          </Box>

          {isEmailSent && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
              <TextF
                label="인증 코드"
                name="verificationCode"
                size='small'
                sx={{ marginRight: '10px' }}
                fullWidth
                onChange={handleChange}
                disabled={isEmailVerified}
              />
              <Btntwo
                variant="contained"
                onClick={verifyEmailCode}
                disabled={isEmailVerified}
                sx={{ height: '40px' }}
              >
                인증 확인
              </Btntwo>
            </Box>
          )}

          <TextF
            label="비밀번호"
            name="password"
            type='password'
            size='small'
            sx={{ margin: '0px 0px 10px 0px' }}
            fullWidth
            onChange={handleChange}
            disabled={!isEmailVerified}
          />

          <TextF
            label="비밀번호 재입력"
            name="confirmPassword"
            type='password'
            size='small'
            sx={{ margin: '0px 0px 10px 0px' }}
            fullWidth
            onChange={handleChange}
            error={!PasswordsMatch() && formState.confirmPassword.length > 0}
            helperText={!PasswordsMatch() && formState.confirmPassword.length > 0 ? "비밀번호가 일치하지 않습니다." : ""}
            disabled={!isEmailVerified}
          />

          <InputMask
            mask="010-9999-9999"
            value={formState.phoneNumber}
            onChange={handleChange}
            disabled={!isEmailVerified}
          >
            {() => (
              <TextF
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

          <TextF
            label="닉네임"
            name="name"
            type='name'
            size='small'
            sx={{ margin: '0px 0px 10px 0px' }}
            fullWidth
            onChange={handleChange}
            disabled={!isEmailVerified}
          />

          <InputMask
            mask="9999-99-99"
            value={formState.birthday}
            onChange={handleChange}
            disabled={!isEmailVerified}
          >
            {() => (
              <TextF
                label="생년월일"
                name="birthday"
                size='small'
                sx={{ margin: '0px 0px 10px 0px' }}
                fullWidth
              />
            )}
          </InputMask>

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextF
              label="주소"
              name="address"
              size='small'
              sx={{ marginRight: '10px' }}
              fullWidth
              value={formState.address}
              disabled
            />
            <Btntwo variant="contained" onClick={() => setPostcodeOpen(true)} sx={{ height: '40px' }} disabled={!isEmailVerified}>
              검색
            </Btntwo>
          </Box>
          <TextF
            label="상세주소"
            name="addressDetail"
            size='small'
            fullWidth
            onChange={handleChange}
            disabled={!isEmailVerified}
          />

          <Btntwo
            type='submit'
            variant="contained"
            fullWidth
            sx={{ borderRadius: '30px', margin: '15px 0', width: '100%' }}
            onClick={OnSubmit}
            disabled={!isEmailVerified}
          >
            가입
          </Btntwo>


          <Typography variant="body2" align="center" sx={{ fontWeight:'bold', marginTop: '10px' }}>
            이미 아이디가 있다면? <Link to="/login">로그인</Link>
          </Typography>

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
