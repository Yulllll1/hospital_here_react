import React from 'react';
import { useNavigate } from 'react-router';
import MainContainer from '../../components/global/MainContainer'
import { Box, Typography, Button, Container } from '@mui/material';
import { Btn } from '../../components/global/CustomComponents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ReservationSuccess() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const handleReservationHistoryPage = () => {
    navigate('/reservations');
  };
  return (
    <MainContainer>
      <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80dvh',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2, 
              }}
            >
              <CheckCircleIcon sx ={{ fontSize: '30px', color: 'var(--main-common)', marginBottom: 2 }}/>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                예약이 성공하였습니다.
              </Typography>
              <Btn onClick={handleReservationHistoryPage}>
                예약 내역 확인
              </Btn>
            </Box>
          </Container>
    </MainContainer>
  );
}

export default ReservationSuccess;