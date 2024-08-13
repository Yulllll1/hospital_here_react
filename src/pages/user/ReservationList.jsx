import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, Box, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';
import dayjs from 'dayjs';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [hospitalDialogOpen, setHospitalDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get('/api/reservations/user');
        setReservations(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const fetchHospitalInfo = async (hospitalid) => {
    try {
      const response = await axiosInstance.get(`/api/hospitals/${hospitalid}`);
      setHospitalInfo(response.data);
      setHospitalDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelReservation = async (reservationId) => {
    const confirmCancel = window.confirm("정말 예약을 취소하시겠습니까?");
    if (!confirmCancel) return;

    try {
      await axiosInstance.delete(`/api/reservations/${reservationId}`);
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== reservationId)
      );
      alert("예약이 취소되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setHospitalDialogOpen(false);
  };

  const openReviewDialog = (reservation) => {
    setSelectedReservation(reservation);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    try {
      const reviewData = {
        userId: localStorage.getItem("userId"),
        hospitalid: selectedReservation.hospitalid,
        content: reviewContent,
        rating: reviewRating,
      };
      await axiosInstance.post(`/review/${selectedReservation.hospitalid}`, reviewData);
      alert('리뷰가 성공적으로 작성되었습니다.');
      setReviewDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
    setReviewContent('');
    setReviewRating(0);
  };

  const handleRatingChange = (newRating) => {
    setReviewRating(newRating);
  };

  const canWriteReview = (reservationDate, reservationTimeSlot) => {
    const reservationDateTime = dayjs(`${reservationDate}T${reservationTimeSlot}`);
    return dayjs().isAfter(reservationDateTime);
  };

  const renderStars = (rating, editable = false) => {
    const maxRating = 5;
    const filledStars = Array.from({ length: rating }, (_, index) => (
      <IconButton
        key={index}
        onClick={() => editable && handleRatingChange(index + 1)}
        disabled={!editable}
      >
        <Star style={{ color: "#FFD700" }} />
      </IconButton>
    ));
    const emptyStars = Array.from(
      { length: maxRating - rating },
      (_, index) => (
        <IconButton
          key={index + rating}
          onClick={() => editable && handleRatingChange(rating + index + 1)}
          disabled={!editable}
        >
          <StarBorder style={{ color: "#FFD700" }} />
        </IconButton>
      )
    );

    return [...filledStars, ...emptyStars];
  };

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <Typography variant='h5' sx={{ display: 'inline', color: '#6E6E6E' }}>
          예약 내역
        </Typography>
        <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <List component="nav">
            {reservations.length === 0 ? (
              <Typography variant="body1">예약 내역이 없습니다.</Typography>
            ) : (
              reservations.map((reservation) => (
                <ListItem key={reservation.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText
                    primary={<>{reservation.department} 진료 <br /> 예약일시 : {reservation.date} {reservation.timeSlot}</>}
                    secondary={`예약자 성함: ${reservation.userName}`}
                  />
                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => fetchHospitalInfo(reservation.hospitalid)}
                      sx={{ marginRight: 2 }}
                    >
                      정보
                    </Button>
                    {canWriteReview(reservation.date, reservation.timeSlot) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openReviewDialog(reservation)}
                        sx={{ marginRight: 2 }}
                      >
                        리뷰 작성
                      </Button>
                    )}
                    {!canWriteReview(reservation.date, reservation.timeSlot) && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => cancelReservation(reservation.id)}
                      >
                        취소
                      </Button>
                    )}
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        )}
      </Paper>

      <Dialog open={hospitalDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>병원 정보</DialogTitle>
        <DialogContent>
          {hospitalInfo ? (
            <Box>
              <Typography variant="h6">{hospitalInfo.name}</Typography>
              <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
              <Typography variant="body1">주소: {hospitalInfo.address}</Typography>
              <Typography variant="body1">전화번호: {hospitalInfo.telephoneNumber && hospitalInfo.telephoneNumber.length > 2 ? hospitalInfo.telephoneNumber : "제공되지 않음"}</Typography>
            </Box>
          ) : (
            <Typography>병원 정보를 불러오는 중입니다...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reviewDialogOpen} onClose={handleReviewDialogClose}>
        <DialogTitle>리뷰 작성</DialogTitle>
        <DialogContent>
          <Box>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              {renderStars(reviewRating, true)}
            </div>
            <TextField
              label="리뷰 내용"
              multiline
              rows={4}
              fullWidth
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewDialogClose} color="primary">
            취소
          </Button>
          <Button onClick={handleReviewSubmit} color="primary" variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default ReservationList;
