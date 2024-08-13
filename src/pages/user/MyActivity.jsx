import React from 'react';
import {Button,List,ListItem,ListItemText,Divider,Box,Typography,Paper} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainContainer from "../../components/global/MainContainer";
import { useNavigate } from 'react-router-dom';



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

const MyActivity = () => {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  }
  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <ThemeProvider theme={theme}>
          <Typography variant='h5' sx={{ display: 'inline', color: '#6E6E6E' }}>
            활동 내역
          </Typography>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
        <List component="nav" aria-label="activity history">
        {[
          { label: '내 채팅 내역', path: '/chatlist' },
          { label: '예약 내역', path: '/reservations' },
          { label: '내가 쓴 글', path: '/' },
          { label: '나의 리뷰', path: '/my-reviews' },
          { label: '즐겨찾기', path: '/bookmarks' },
        ].map((item) => (
          <React.Fragment key={item.label}>
            <ListItem
              button
              onClick={() => handleClick(item.path) }
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ListItemText primary={item.label} />
              <Button variant="contained" color="black">
                바로가기
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
        </ThemeProvider>
      </Paper>
    </ MainContainer>
  );
};

export default MyActivity;