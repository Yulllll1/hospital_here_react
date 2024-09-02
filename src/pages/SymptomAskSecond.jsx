import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import MainContainer from '../components/global/MainContainer';
import { Box, Grid, Container, Typography, Button, Stepper, StepLabel, Step } from '@mui/material';
import { Btn, TextF } from '../components/global/CustomComponents';

function SymptomAskSecond() {
  const location = useLocation();
  const { state } = location; 
  const message = state?.message || '정보가 없습니다.';
  const departments = state?.departments || [];
  const navigate = useNavigate();

  // "##"와 "**"를 제거
  const cleanMessage = (msg) => {
    return msg.replace(/##/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
  };

  const cleanedMessage = cleanMessage(message);

  const handleResultPage = () => {
    navigate('/hospitals/maps', { state: { departments } });
  };

  const steps = ['증상 입력', 'AI 진단', '가까운 병원 추천'];

  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop: '30%' }}>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h3' sx={{ color: '#4A885D', fontWeight: 'bold' }}>2</Typography>
              <Typography variant='h5' sx={{ fontWeight: 'bold'}}>진단 결과</Typography>
              <Box sx = {{ bgcolor: '#F3F4F0', padding: 2, borderRadius: '30px', marginTop: 3}}>
                <Typography variant='body1'>
                  {cleanedMessage} 
                </Typography>
              </Box>    
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Box sx = {{ bgcolor: '#F3F4F0', padding: 2, borderRadius: '30px'}}>
                <Typography variant='body1' sx = {{fontWeight: 'bold'}}>
                  {departments.join(', ')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Btn 
                onClick={handleResultPage} 
                sx={{ marginTop: 2 }}
              >
                주변 병원 바로 보기
              </Btn>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
}

export default SymptomAskSecond;
