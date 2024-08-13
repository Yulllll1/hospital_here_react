import React from "react";
import MainContainer from '../../components/global/MainContainer';
import { Paper, Button, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router";


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

const AdminPage = () => {

  const navigate = useNavigate();
  const userListLink = '/admin-page/user-list';
  const chatListLink = '/chatlist';

  const OnClickUserList = (link) => {
    navigate(link);
  };

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}> 
      <ThemeProvider theme={theme}>
        <Typography variant='h5' sx={{display: 'inline', color: '#6E6E6E'}}>
          관리자 페이지
        </Typography>
        <Box sx={{margin: '40px 0 auto', border: '1px solid grey' }}></Box>
        <Box>
          <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '16px'}}
            onClick={(e) => {OnClickUserList(chatListLink)}}>채팅 관리</Button>
          <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
          <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '16px'}} 
            onClick={(e) => {OnClickUserList(userListLink)}}>회원 목록
          </Button>
          <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
        </Box>
        </ThemeProvider>               
      </Paper>
    </MainContainer>
  );
}

export default AdminPage;