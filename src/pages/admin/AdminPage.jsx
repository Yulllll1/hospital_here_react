import React from "react";
import MainContainer from '../../components/global/MainContainer';
import { Paper, Button, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router";
import { Btntwo } from "../../components/global/CustomComponents";


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
      <Paper elevation={0} sx={{ margin: '10px', padding: 3, borderRadius: '10px', backgroundColor: 'var(--paper-soft)', minHeight: '-webkit-fill-available', height: 'fit-content'}}>
      <ThemeProvider theme={theme}>
      <Typography variant='h5' sx={{ display: 'inline', color: 'var(--main-common)' }}>
          관리자 페이지
        </Typography>
        <Box sx={{ margin: '20px 0', borderBottom: '1px solid var(--main-common)' }}></Box>
        <Box>
          <Btntwo variant="contained" sx={{width: '100%', height: '50px', fontSize: '16px', borderRadius: '10px'}}
            onClick={(e) => {OnClickUserList(chatListLink)}}>채팅 관리</Btntwo>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid var(--main-common)' }}></Box>
          <Btntwo variant="contained" sx={{width: '100%', height: '50px', fontSize: '16px', borderRadius: '10px'}}
            onClick={(e) => {OnClickUserList(userListLink)}}>회원 목록
          </Btntwo>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid var(--main-common)' }}></Box>
        </Box>
        </ThemeProvider>               
      </Paper>
    </MainContainer>
  );
}

export default AdminPage;