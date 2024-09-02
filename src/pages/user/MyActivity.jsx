import React from 'react';
import {Button,List,ListItem,ListItemText,Divider,Box,Typography,Paper} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainContainer from "../../components/global/MainContainer";
import { useNavigate } from 'react-router-dom';



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

const MyActivity = () => {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  }

  return (
    <MainContainer>
      <Paper elevation={0} sx={{ margin: '10px', padding: 3, borderRadius: '10px', backgroundColor: 'var(--paper-soft)', height: '-webkit-fill-available' }}>
        <ThemeProvider theme={theme}>
          <Typography variant='h5' sx={{ display: 'inline', color: 'var(--main-common)' }}>
            활동 내역
          </Typography>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid var(--main-common)' }}></Box>
          <List component="nav" aria-label="activity history">
            {[
              { label: '내 채팅 내역', path: '/chatlist' },
              { label: '예약 내역', path: '/reservations' },
              { label: '내가 쓴 글', path: '/my-posts' },
              { label: '나의 리뷰', path: '/my-reviews' },
              { label: '즐겨찾기', path: '/bookmarks' },
            ].map((item) => (
              <React.Fragment key={item.label}>
                <ListItem
                  button
                  onClick={() => handleClick(item.path)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText primary={item.label} />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'var(--main-deep)',
                      color: 'white',
                      borderRadius: '20px',
                      '&:hover': {
                        backgroundColor: 'var(--main-common)',
                      },
                    }}
                  >
                    바로가기
                  </Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </ThemeProvider>
      </Paper>
    </MainContainer>
  );
};

export default MyActivity;