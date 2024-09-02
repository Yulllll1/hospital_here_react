import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, IconButton, Box, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { axiosInstance } from '../../utils/axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PostCodeModal from '../../components/PostCodeModal';
import { deleteCookie } from '../../utils/cookies';
import MainContainer from '../../components/global/MainContainer';
import {
  TextF,
  Btntwo,
  Btn,
  SmallBtn
} from '../../components/global/CustomComponents';

const theme = createTheme({
  palette: {
    black: {
      main: 'var(--main-common)',
      light: 'var(--paper-common)',
      drak: 'var(--main-deep)',
      contrastText: '#E7E7E6',
    },
  },
});

const UserInfoPage = () => {
  const [state, setState] = useState({
    userInfo: null,
    editField: null,
    formData: {},
    dialogOpen: false,
    addressData: { address: '', addressDetail: '' },
    postcodeOpen: false,
    deleteConfirmOpen: false,
    deleteInput: '',
    deleteError: ''
  });

  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);
  const auth = useRecoilValue(userauthState);
  const setChatRoom = useSetRecoilState(chatRoomState);

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
            Authorization: `${token}`,
          },
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
          ...dataToSend,
        },
        editField: null,
        dialogOpen: false,
      }));
      window.location.reload();
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
      postcodeOpen: false
    }));
  };

  const handleDeleteAccount = async () => {
    if (state.deleteInput !== '메디콤탈퇴') {
      setState((prevState) => ({
        ...prevState,
        deleteError: '탈퇴 확인을 위해 "메디콤탈퇴"를 정확히 입력해 주세요.',
      }));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete('/users/my-page/delete', {
        headers: {
          Authorization: `${token}`,
        },
      });

      setAuthState({ isLoggedIn: false });
      localStorage.removeItem('token');
      deleteCookie('refreshToken');
      setChatRoom((c) => ({ rooms: {}, selectedIndex: 0 }));
      window.alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const { userInfo, editField, formData, dialogOpen, addressData, postcodeOpen, deleteConfirmOpen, deleteInput, deleteError } = state;

  return (
    <MainContainer>
      <Paper elevation={0} sx={{ margin: '10px', padding: 3, borderRadius: '10px', minHeight: '-webkit-fill-available', height: 'fit-content' }}>

          <Typography variant='h5' sx={{fontWeight: 'bold', display: 'inline', color: 'var(--main-common)' }}>
            내 정보 수정
          </Typography>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid var(--main-common)' }}></Box>
          <form>
            {['name', 'birthday', 'email'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextF
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
                <TextF
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
                      <SaveIcon sx={{ color: 'var(--main-common)' }} />
                    </IconButton>
                    <IconButton onClick={handleCancelClick}>
                      <CancelIcon sx={{ color: 'var(--main-common)' }} />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick(field)}>
                    <EditIcon sx={{ color: 'var(--main-common)' }} />
                  </IconButton>
                )}
              </Box>
            ))}
            {!userInfo?.provider && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextF
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
                      <EditIcon sx={{ color: 'var(--main-common)' }} />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick('password')}>
                    <EditIcon sx={{ color: 'var(--main-common)' }} />
                  </IconButton>
                )}
              </Box>
            )}
          </form>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              height: '100%',
              marginTop: '50px'
            }}
          >
            <Btn
              onClick={() => setState((prevState) => ({ ...prevState, deleteConfirmOpen: true }))}
              sx={{
                backgroundColor: 'red',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
                marginBottom: '10px',
              }}
            >
              회원 탈퇴
            </Btn>
          </Box>


        <Dialog open={dialogOpen} onClose={handleCancelClick}>
          <DialogTitle>{getFieldLabel(editField)}</DialogTitle>
          <DialogContent>
            {editField === 'address' ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <TextF
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
                  <Btntwo variant="contained" onClick={() => setState((prevState) => ({ ...prevState, postcodeOpen: true }))} sx={{ height: '40px', marginLeft: '10px' }}>
                    검색
                  </Btntwo>
                </Box>
                <TextF
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
                <TextF
                  label="기존 비밀번호"
                  name="verifyPassword"
                  type="password"
                  value={formData.verifyPassword || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextF
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
              <TextF
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
            <SmallBtn onClick={handleCancelClick} color="primary">
              취소
            </SmallBtn>
            <SmallBtn onClick={() => handleSaveClick(editField)} color="primary" sx = {{color: 'white', backgroundColor: 'green'}}>
              저장
            </SmallBtn>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteConfirmOpen} onClose={() => setState((prevState) => ({ ...prevState, deleteConfirmOpen: false }))}>
          <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
          <DialogContent>
            <Typography>
              계정을 탈퇴하시려면 아래 입력란에 <strong>메디콤탈퇴</strong>를 입력해 주세요.
            </Typography>
            <TextF
              label="메디콤탈퇴 입력"
              fullWidth
              value={deleteInput}
              onChange={(e) => setState((prevState) => ({ ...prevState, deleteInput: e.target.value, deleteError: '' }))}
              margin="normal"
            />
            {deleteError && (
              <Typography color="error" variant="body2">
                {deleteError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setState((prevState) => ({ ...prevState, deleteConfirmOpen: false }))} color="primary">
              취소
            </Button>
            <Button onClick={handleDeleteAccount} color="error">
              탈퇴
            </Button>
          </DialogActions>
        </Dialog>

        <PostCodeModal open={postcodeOpen} onClose={() => setState((prevState) => ({ ...prevState, postcodeOpen: false }))} onComplete={handleAddressComplete} />
      </Paper>
    </MainContainer>
  );
};

const getFieldLabel = (field) => {
  switch (field) {
    case 'name':
      return '이름(닉네임)';
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

export default UserInfoPage;
