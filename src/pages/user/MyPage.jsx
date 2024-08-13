import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Avatar, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { axiosInstance } from '../../utils/axios';
import MainContainer from "../../components/global/MainContainer";
import { deleteCookie } from '../../utils/cookies';
import { userauthState } from '../../utils/atom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PostCodeModal from '../../components/PostCodeModal';
import ProfileImageUpload from './ProfileImageUpload';

const theme = createTheme({
  palette: {
    black: {
      main: '#2E2F2F',
      light: '#6E6E6E',
      drak: '#151515',
      contrastText: '#E7E7E6',
    },
  },
});

const MyPage = () => {
  const [state, setState] = useState({
    userInfo: null,
    editField: null,
    formData: {},
    dialogOpen: false,
    postcodeOpen: false,
    addressData: { address: '', addressDetail: '' },
    imageUploadOpen: false,
  });
  const handleAvatarClick = () => {
    setState((prevState) => ({
      ...prevState,
      imageUploadOpen: true,
    }));
  };

  const handleImageUploadClose = () => {
    setState((prevState) => ({
      ...prevState,
      imageUploadOpen: false,
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setState((prevState) => ({
      ...prevState,
      userInfo: {
        ...prevState.userInfo,
        img: imageUrl,
      },
      imageUploadOpen: false,
    }));
  };



  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);
  const auth = useRecoilValue(userauthState);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/login');
    }
  }, [auth, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/users/my-page', {
          headers: {
            Authorization: `${token}`
          }
        });
        setState((prevState) => ({
          ...prevState,
          userInfo: response.data,
          formData: response.data,
        }));
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEditClick = (field) => {
    setState((prevState) => ({
      ...prevState,
      editField: field,
      dialogOpen: true,
      addressData: field === 'address' ? { address: prevState.formData.address, addressDetail: prevState.formData.addressDetail } : prevState.addressData,
    }));
  };

  const handleSaveClick = async (field) => {
    try {
      let dataToSend = { [field]: state.formData[field] };
      let endpoint = `/users/my-page/${field}`;

      if (field === 'address') {
        dataToSend = state.addressData;
        endpoint = '/users/my-page/address';
      } else if (field === 'phoneNumber') {
        endpoint = '/users/my-page/phoneNumber';
      } else if (field === 'password') {
        dataToSend = {
          verifyPassword: state.formData.verifyPassword,
          alterPassword: state.formData.alterPassword,
        };
        endpoint = '/users/my-page/password';
      }

      await axiosInstance.put(endpoint, dataToSend);
      setState((prevState) => ({
        ...prevState,
        userInfo: {
          ...prevState.userInfo,
          ...dataToSend
        },
        editField: null,
        dialogOpen: false,
      }));
      window.location.reload();  // 새로고침
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('기존 비밀번호가 올바르지 않습니다.');
      } else {
        console.error(error);
      }
    }
  };

  const handleCancelClick = () => {
    setState((prevState) => ({
      ...prevState,
      formData: { ...prevState.userInfo },
      editField: null,
      dialogOpen: false,
      postcodeOpen: false,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      addressData: {
        ...prevState.addressData,
        [name]: value,
      },
    }));
  };

  const handleAddressComplete = (fullAddress) => {
    setState((prevState) => ({
      ...prevState,
      addressData: {
        ...prevState.addressData,
        address: fullAddress
      },
    }));
  };

  const handleLogoutClick = () => {
    setAuthState({ isLoggedIn: false });
    localStorage.removeItem('token');
    deleteCookie('refreshToken');
    navigate('/');
  };

  const handleMyActivity = () => {
    navigate('/my-activity');
  }

  const OnClickAdminPage = () => {
    navigate('/admin-page');
  }

  const { userInfo, editField, formData, dialogOpen, postcodeOpen, addressData, imageUploadOpen } = state;


  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <ThemeProvider theme={theme}>
          <Typography variant='h5' sx={{ display: 'inline', color: '#6E6E6E' }}>
            마이페이지
          </Typography>
          <Button variant="contained" color="black" sx={{ float: 'right' }} onClick={handleMyActivity}>
            나의 활동내역
          </Button>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar
              sx={{ width: '40px', height: '40px', marginRight: '10px', cursor: 'pointer' }}
              onClick={handleAvatarClick}
              src={userInfo?.image}
            >
              {userInfo && !userInfo.img ? userInfo.name[0] : ''}
            </Avatar>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {userInfo ? userInfo.role : '일반 회원'}
            </Typography>
          </Box>
          <form>
            {['name', 'birthday', 'email'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label={getFieldLabel(field)}
                  name={field}
                  type='text'
                  value={formData[field] || ''}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            ))}
            {['address', 'phoneNumber'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label={getFieldLabel(field)}
                  name={field}
                  type='text'
                  value={field === 'address' ? `${formData.address || ''} ${formData.addressDetail || ''}` : formData[field] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: editField !== field,
                  }}
                />
                {editField === field ? (
                  <>
                    <IconButton onClick={() => handleSaveClick(field)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick}>
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick(field)}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {!userInfo?.provider && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: editField !== 'password',
                  }}
                />
                {editField === 'password' ? (
                  <>
                    <IconButton onClick={() => handleEditClick('password')}>
                      <EditIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick('password')}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginBottom: '10px' }}>
            <Button variant="contained" color="black" onClick={handleLogoutClick}>
              로그아웃
            </Button>
            <Button variant="contained" color="error">
              회원 탈퇴
            </Button>
          </Box>
          <Button variant="contained" color="black" onClick={OnClickAdminPage}>관리자 페이지</Button>
        </ThemeProvider>
      </Paper>
      <Dialog open={imageUploadOpen} onClose={handleImageUploadClose}>
        <DialogTitle>프로필 이미지 업로드</DialogTitle>
        <DialogContent>
          <ProfileImageUpload userId={userInfo?.id} onImageUpload={handleImageUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageUploadClose} color="primary">
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={handleCancelClick}>
        <DialogTitle>{getFieldLabel(editField)}</DialogTitle>
        <DialogContent>
          {editField === 'address' ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label="주소"
                  name="address"
                  value={addressData.address}
                  onChange={handleDialogInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button variant="contained" onClick={() => setState((prevState) => ({ ...prevState, postcodeOpen: true }))} sx={{ height: '40px', marginLeft: '10px' }}>
                  주소 검색
                </Button>
              </Box>
              <TextField
                label="상세주소"
                name="addressDetail"
                value={addressData.addressDetail}
                onChange={handleDialogInputChange}
                fullWidth
                margin="normal"
              />
            </>
          ) : editField === 'password' ? (
            <>
              <TextField
                label="기존 비밀번호"
                name="verifyPassword"
                type="password"
                value={formData.verifyPassword || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="변경할 비밀번호"
                name="alterPassword"
                type="password"
                value={formData.alterPassword || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </>
          ) : (
            <TextField
              label={getFieldLabel(editField)}
              name={editField}
              type='text'
              value={formData[editField] || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="primary">
            취소
          </Button>
          <Button onClick={() => handleSaveClick(editField)} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <PostCodeModal open={postcodeOpen} onClose={() => setState((prevState) => ({ ...prevState, postcodeOpen: false }))} onComplete={handleAddressComplete} />
    </MainContainer>
  );
};

const getFieldLabel = (field) => {
  switch (field) {
    case 'name':
      return '이름';
    case 'email':
      return '이메일 주소';
    case 'password':
      return '비밀번호';
    case 'birthday':
      return '생년월일';
    case 'address':
      return '주소';
    case 'addressDetail':
      return '상세주소';
    case 'phoneNumber':
      return '전화번호';
    default:
      return '';
  }
};

export default MyPage;
