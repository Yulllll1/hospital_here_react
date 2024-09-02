import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton, Button, ListItemIcon
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import { axiosInstance } from '../../utils/axios';
import { deleteCookie } from '../../utils/cookies';
import MainContainer from "../../components/global/MainContainer";
import ProfileImageUpload from './ProfileImageUpload';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';
import { Btn, Btntwo } from '../../components/global/CustomComponents';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NoteIcon from '@mui/icons-material/Note';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

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

const MyPage = () => {
  const [state, setState] = useState({
    userInfo: null,
    imageUploadOpen: false,
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
        }));
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

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

  const handleLogoutClick = () => {
    setAuthState({ isLoggedIn: false });
    localStorage.removeItem('token');
    deleteCookie('refreshToken');
    setChatRoom((c) => ({ rooms: {}, selectedIndex: 0 }));
    navigate('/');
  };

  const handleClick = (path) => {
    navigate(path);
  };

  const handleChatClick = () => {
    navigate('/chat/new');
  };

  const handleBoardClick = () => {
    navigate('/boards/4');
  };
  const OnClickAdminPage = () => {
    navigate('/admin-page');
  }

  const { userInfo, imageUploadOpen } = state;
  const userRole = localStorage.getItem('userRole');

  return (
    <MainContainer>

      <Paper elevation={0} sx={{ margin: '10px', padding: 3, borderRadius: '10px', minHeight: '-webkit-fill-available', height: 'fit-content'}}>

          <Typography variant='h5' sx={{fontWeight: 'bold', display: 'inline', color: 'var(--main-common)' }}>
            마이페이지
          </Typography>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid black' }}></Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              marginLeft: '30px',
              marginRight: '30px',
              position: 'relative',
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--main-common)' }}>
                {userInfo?.name} 님
              </Typography>
              <Typography variant="body1">
                {userRole === 'USER' ? '일반 회원' : userRole === 'DOCTOR' ? '의사 회원' : '관리자 회원'}
              </Typography>
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{ width: 100, height: 100, cursor: 'pointer', bgcolor: 'white', border: '2px solid #e2e2e2' }}
                onClick={handleAvatarClick}
                src={userInfo?.image}
              >
                {userInfo && !userInfo.img ? userInfo.name[0] : ''}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'var(--main-common)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--main-deep)',
                  },
                }}
                onClick={handleAvatarClick}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider flexItem />


          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0', gap: 2 }}>
            <Box sx={{ textAlign: 'center', marginLeft: 4 }}>
              <IconButton
                sx={{
                  backgroundColor: 'var(--paper-soft)',
                  color: 'black',
                  width: 80,
                  height: 80,
                }}
                onClick={handleChatClick}
              >
                <ChatIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'block', marginTop: 1 }}>
                새로운 상담
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'center', marginRight: 4 }}>
              <IconButton
                sx={{
                  backgroundColor: 'var(--paper-soft)',
                  color: 'black',
                  width: 80,
                  height: 80,
                }}
                onClick={handleBoardClick}
              >
                <ArticleIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'block', color: 'black', marginTop: 1 }}>
                공지사항
              </Typography>
            </Box>
          </Box>
          <Divider flexItem />

          <List component="nav" aria-label="activity history">
            {[
              { label: '내 정보 수정', path: '/user-info', icon: <AccountCircleIcon /> },
              { label: '내 채팅 내역', path: '/chatlist', icon: <ChatBubbleIcon /> },
              { label: '예약 내역', path: '/reservations', icon: <ScheduleIcon /> },
              { label: '내가 쓴 글', path: '/my-posts', icon: <NoteIcon /> },
              { label: '나의 리뷰', path: '/my-reviews', icon: <ThumbUpIcon /> },
              { label: '즐겨찾기', path: '/bookmarks', icon: <StarIcon /> },
            ].map((item) => (
              <React.Fragment key={item.label}>
                <ListItem
                  button
                  onClick={() => handleClick(item.path)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0px',
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  <ChevronRightIcon sx={{ color: 'black' }} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>


        {userRole === 'ADMIN' && (
          <Btn onClick={OnClickAdminPage} sx = {{marginTop: 13, marginLeft: 'auto'}}>
            관리자 페이지
          </Btn>
        )}
      </Paper>
      <Dialog open={imageUploadOpen} onClose={handleImageUploadClose}>
        <DialogTitle>프로필 이미지 업로드</DialogTitle>
        <DialogContent>
          <ProfileImageUpload userId={userInfo?.id} onImageUpload={handleImageUpload} />
        </DialogContent>
        <DialogActions>
          <Btn onClick={handleImageUploadClose} color="primary">
            취소
          </Btn>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default MyPage;
