import React, { useState } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { useNavigate, useLocation } from 'react-router';
import {
  Avatar,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  ThemeProvider,
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  DialogContent,
  DialogActions
} from '@mui/material';
import { GetUserRoleString } from '../../utils/stringUtil';
import { theme } from '../../utils/theme';
import { axiosInstance } from '../../utils/axios';
import { Btntwo } from "../../components/global/CustomComponents";

const DeleteDialog = props => {
  const { open, OnClose, userDetail } = props;
  const navigate = useNavigate();

  const OnCloseHandler = () => {
    OnClose(false);
  };

  const OnClickUserDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${userDetail.id}`);
      navigate('/admin-page/user-list');
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <Dialog open={open} onClose={OnCloseHandler}>
      <DialogTitle fontSize='large'>정말 회원을 삭제하시겠습니까?</DialogTitle>
      <DialogContent>한번 삭제하면 다시 되돌릴 수 없습니다. 그래도 삭제하시겠습니까?</DialogContent>
      <DialogActions>
        <Button color='error' onClick={OnClickUserDelete}>
          삭제
        </Button>
        <Button onClick={OnCloseHandler}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

const RoleDialog = props => {
  const { open, OnClose, userDetail } = props;
  const navigate = useNavigate();

  const OnCloseHandler = () => {
    OnClose(false);
  };

  const OnClickRole = async role => {
    try {
      const response = await axiosInstance.put(`/admin/users/${userDetail.id}`, null, {
        params: { updateRole: role }
      });
      userDetail.role = role;
      OnCloseHandler();
    } catch (exception) {
      console.log(exception);
    }
  };

  const OnClickDoctorRole = () => {
    navigate('/admin-page/user-list/user-detail/doctor-profile', {
      state: { userDetail: userDetail }
    });
  };

  return (
    <Dialog open={open} onClose={OnCloseHandler}>
      <DialogTitle fontSize='large'>변경하려는 권한을 선택하세요.</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItemButton onClick={e => OnClickRole('USER')}>일반 회원</ListItemButton>
        <ListItemButton onClick={e => OnClickRole('ADMIN')}>관리자</ListItemButton>
        <ListItemButton onClick={OnClickDoctorRole}>의사</ListItemButton>
      </List>
    </Dialog>
  );
};

const AdminUserListDetail = () => {
  const location = useLocation();
  const userDetail = location.state.userDetail[0];
  console.log('user', userDetail);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const OpenDeleteDialog = isOpen => {
    setDeleteDialogOpen(isOpen);
  };

  const OpenRoleDialog = isOpen => {
    setRoleDialogOpen(isOpen);
  };

  return (
    <MainContainer>
      <Paper elevation={0} sx={{ margin: '10px', padding: 3, borderRadius: '10px', backgroundColor: 'var(--paper-soft)', minHeight: '-webkit-fill-available', height: 'fit-content'}}>
        <Avatar sx={{ float: 'left' }}></Avatar>
        <Typography variant='body1' sx={{ display: 'inline-block', margin: '0px 0px 0px 15px' }}>
          {userDetail.name}
          <br />
          {GetUserRoleString(userDetail.role)}
        </Typography>
        <Box sx={{ margin: '20px 0px 15px 0px', border: '1px solid grey' }}></Box>
        <TextField
          disabled
          fullWidth
          label='이메일'
          defaultValue={userDetail.email}
          sx={{ margin: '5px 0 auto' }}
        ></TextField>
        <TextField
          disabled
          fullWidth
          label='연락처'
          defaultValue={userDetail.phoneNumber}
          sx={{ margin: '15px 0 auto' }}
        ></TextField>
        <TextField
          disabled
          fullWidth
          label='주소'
          defaultValue={userDetail.address}
          sx={{ margin: '15px 0 auto' }}
        ></TextField>
        <TextField
          disabled
          fullWidth
          label='상세 주소'
          defaultValue={userDetail.addressDetail}
          sx={{ margin: '15px 0 auto' }}
        ></TextField>
        <ThemeProvider theme={theme}>
          <Btntwo
            sx={{width: '100px', height: '40px', margin: '10px 0 auto', float: 'left' }}
            onClick={e => OpenRoleDialog(true)}
          >
            권한 변경
          </Btntwo>
          <Btntwo
            variant='contained'
            color='error'
            sx={{width: '100px', height: '40px', margin: '10px 0 auto', float: 'right', backgroundColor: 'red' }}
            onClick={e => {
              OpenDeleteDialog(true);
            }}
          >
            회원 삭제
          </Btntwo>
        </ThemeProvider>
        <RoleDialog open={roleDialogOpen} OnClose={OpenRoleDialog} userDetail={userDetail} />
        <DeleteDialog open={deleteDialogOpen} OnClose={OpenDeleteDialog} userDetail={userDetail} />
      </Paper>
    </MainContainer>
  );
};

export default AdminUserListDetail;
