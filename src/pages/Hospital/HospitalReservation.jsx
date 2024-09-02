import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainContainer from '../../components/global/MainContainer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { Box, Grid, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format } from 'date-fns';
import { Btn } from '../../components/global/CustomComponents';
import { axiosInstance } from '../../utils/axios';

// 스타일링된 컴포넌트
const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));

const generateTimeSlots = (startHour, endHour, interval) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      slots.push(format(time, 'HH:mm'));
    }
  }
  return slots;
};

function HospitalReservation() {
  const { hospitalid } = useParams(); // URL에서 병원 id 가져오기
  const location = useLocation();
  const { hospital } = location.state || {};
  const { selectedHospital } = location.state || {}
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedDate, setSelectedDate] = useState(null); // 날짜 선택
  const [selectedTime, setSelectedTime] = useState(null); // 예약 시간 선택
  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
  }); // accordion 열림 상태 초기에 false로 설정
  const [isAvailable, setIsAvailable] = useState(true); // 예약 가능 여부
  //각 다른 페이지에서 넘어온 병원 이름
  const validHospital = selectedHospital || hospital;
  const navigate = useNavigate();

  useEffect(() => {
    const checkAvailability = async () => {
      if (selectedDate && selectedTime) {
        try {
          const utcDate = format(selectedDate, 'yyyy-MM-dd');
          const response = await axiosInstance.get('/api/reservations/check-availability', {
            params: {
              date: utcDate,
              timeSlot: selectedTime
            }
          });
          setIsAvailable(response.data);
        } catch (error) {
          console.error('Error checking availability:', error);
        }
      }
    };

    checkAvailability();
  }, [selectedDate, selectedTime]);



  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    if (date) {
      const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      setSelectedDate(utcDate);
    } else {
      setSelectedDate(null);
    }
  };

  const today = new Date();

  // Accordion 클릭 시 열림
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prevState) => ({
      ...prevState,
      [panel]: isExpanded,
    }));
  };

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots(8, 18, 30); // 8:00 ~ 18:00, 30분 간격

  // 시간 슬롯 버튼 스타일
  const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
    border: '1px solid #e9e9e9',
    borderRadius: '10px',
    padding: '8px 16px',
    textAlign: 'center',
    width: '100%',
    backgroundColor: selected ? '#4A885D' : 'transparent',
    color: selected ? '#ffffff' : 'inherit',
    '&:hover': {
      backgroundColor: selected ? '#4A885D' : '#f0f0f0',
    },
  }));


  // 예약 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('모든 필드를 선택해 주세요.');
      return;
    }

    // 사용자 정보 가져오기
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    try {
      const utcDate = format(selectedDate, 'yyyy-MM-dd');

      const response = await axiosInstance.post('/api/reservations', {
        hospitalid: hospitalid,
        date: utcDate,
        timeSlot: selectedTime,
        userId, // 사용자 ID 포함
        userRole // 사용자 역할 포함
      });

      navigate('success'); // 성공 시 성공 페이지로 이동
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('예약을 처리하는 동안 오류가 발생했습니다.');
      }
    }
  };




  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop : 4 }}>
              <Box sx = {{ display: 'flex', justifyContent: 'center'}}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                      예약하기
                  </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx = {{ bgcolor: '#F3F4F0', padding: 2, borderRadius: '30px' }}>
                <Typography variant="h6" sx = {{ fontWeight: 'bold' }}>
                    {validHospital.name}
                </Typography>
                <Typography variant="caption" sx = {{ color: 'grey'}}>
                  * 예약하실 병원이 맞나요?
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {/* 예약 날짜 선택 */}
              <Accordion expanded={expanded.panel1} onChange={handleAccordionChange('panel1')} sx = {{ border:'none', boxShadow: 'none'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h5" sx = {{ fontWeight: 'bold' }}>날짜</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="날짜 선택"
                        value={selectedDate}
                        minDate={today} //오늘 날짜 이전 선택 불가
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* 예약 시간 선택 */}
              <Accordion expanded={expanded.panel2} onChange={handleAccordionChange('panel2')} sx = {{ border:'none', boxShadow: 'none'}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography variant="h5" sx = {{ fontWeight: 'bold' }}>시간</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                  <Grid container spacing={2}>
                    {timeSlots.map((slot) => (
                      <Grid item xs={3} key={slot}> {/* 한 줄에 네 개씩 배치 */}
                        <TimeSlotButton
                          selected={selectedTime === slot}
                          onClick={() => setSelectedTime(selectedTime === slot ? null : slot)}
                        >
                          {slot}
                        </TimeSlotButton>
                      </Grid>
                    ))}
                  </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} sx = {{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3}}>
              {/* 예약 제출 버튼 */}
              {selectedDate && selectedTime && isAvailable && (
                <Btn onClick={handleSubmit}>
                  완료
                </Btn>
              )}
              </Grid>
            </Grid>
          </Box>
    </Container>
    </MainContainer>
  );
}

export default HospitalReservation;
