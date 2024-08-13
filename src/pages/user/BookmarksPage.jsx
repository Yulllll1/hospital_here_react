import React, { useEffect, useState } from 'react';
import { Button, List, ListItem, ListItemText, Divider, Typography, Paper, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MainContainer from "../../components/global/MainContainer";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    black: {
      main: '#2E2F2F',
      light: '#6E6E6E',
      dark: '#151515',
      contrastText: '#E7E7E6',
    },
  },
});

const BookmarksPage = () => {
  const [state, setState] = useState({
    bookmarks: [],
    dialogOpen: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      setState(prevState => ({ ...prevState }));
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/bookmark', {
          headers: {
            Authorization: `${token}`
          }
        });

        const bookmarkData = response.data;
        const hospitalDataPromises = bookmarkData.map(async (bookmark) => {
          const hospitalResponse = await axiosInstance.get(`/api/hospitals/${bookmark.hospitalId}`);
          return {
            ...bookmark,
            hospital: hospitalResponse.data,
          };
        });

        const bookmarksWithHospitalData = await Promise.all(hospitalDataPromises);
        setState(prevState => ({
          ...prevState,
          bookmarks: bookmarksWithHospitalData,
        }));
      } catch (error) {
        setState(prevState => ({
          ...prevState,
        }));
        console.error(error);
      }
    };

    fetchBookmarks();
  }, []);

  const handleHospitalClick = async (hospitalId) => {
    const hospitalResponse = await axiosInstance.get(`/api/hospitals/${hospitalId}`);
    setState(prevState => ({
      ...prevState,
      selectedHospital: hospitalResponse.data,
      dialogOpen: true,
    }));
  };
  const handleCloseDialog = () => {
    setState(prevState => ({
      ...prevState,
      selectedHospital: null,
      dialogOpen: false,
    }));
  };
  const handleReservationClick = (hospitalId) => {
    navigate(`/hospitals/maps/${hospitalId}/reservation`);
  };

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <ThemeProvider theme={theme}>
          <Typography variant='h5' sx={{ display: 'inline', color: '#6E6E6E' }}>
            나의 즐겨찾기
          </Typography>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
          <List component="nav" aria-label="bookmarked">
            {state.bookmarks.map((bookmark) => (
              <React.Fragment key={bookmark.id}>
                <ListItem
                  button
                  onClick={() => handleHospitalClick(bookmark.hospital.id)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText primary={bookmark.hospital.name} />
                  <Button variant="contained" color="black">
                    병원 정보 보기
                  </Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Dialog
            open={state.dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>병원 정보</DialogTitle>
            <DialogContent>
              {state.selectedHospital && (
                <>
                  <Typography variant="h6">{state.selectedHospital.name}</Typography>
                  <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
                  <Typography variant="body1">주소 : {state.selectedHospital.address}</Typography>
                  <Typography variant="body2">전화번호 : {state.selectedHospital.telephoneNumber.length > 4 ? state.selectedHospital.telephoneNumber : '제공되지 않음'}</Typography>
                </>
              )}

            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleReservationClick(state.selectedHospital.id)} color="primary">
                예약하기
              </Button>
              <Button onClick={handleCloseDialog} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
      </Paper>
    </MainContainer>
  );
};

export default BookmarksPage;
