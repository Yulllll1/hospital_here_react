import React from 'react';
import { useNavigate } from 'react-router';
import MainContainer from '../../components/global/MainContainer'
import { Typography, Button } from '@mui/material';

function ReservationSuccess() {
  const navigate = useNavigate();

  const handleReservationHistoryPage = () => {
    navigate('/');
  };
  return (
    <MainContainer>
      <Typography>예약이 성공했습니다.</Typography>
      <Button onClick={handleReservationHistoryPage}>예약 내역 확인</Button>
    </MainContainer>
  );
}

export default ReservationSuccess;