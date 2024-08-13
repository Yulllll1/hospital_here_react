import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import MainContainer from '../components/global/MainContainer';
import { Box, Grid, Container, Typography, Button, Stepper, StepLabel, Step } from '@mui/material';

function SymptomAskSecond() {
  const location = useLocation();
  const { state } = location; 
  const message = state?.message || '정보가 없습니다.';
  const departments = state?.departments || [];
  const navigate = useNavigate();

  // "!!"와 "**"를 제거
  const cleanMessage = (msg) => {
    return msg.replace(/!!/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
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
              <Stepper activeStep={1} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                  ))}
              </Stepper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h1' sx={{ textAlign: 'center' }}>02</Typography>
              <Typography variant='h4'>진단 결과</Typography>
              <Typography variant='body1' sx={{ marginTop: 2 }}>
                {cleanedMessage} 
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Typography variant='h6'>추천 진료 과목:</Typography>
              <Typography variant='body1'>
                {departments.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleResultPage} 
                sx={{ marginTop: 2 }}
              >
                주변 병원 바로 보기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
}

export default SymptomAskSecond;
