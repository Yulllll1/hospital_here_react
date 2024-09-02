import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MainContainer from '../components/global/MainContainer';
import { Box, Grid, Container, Typography, TextField, Button, Stepper, StepLabel, Step, Drawer, Divider, IconButton } from '@mui/material';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';
import { Loading } from '../components/Loading'; 
import { axiosInstance } from '../utils/axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMediaQuery } from '@mui/material';
import { Btn, TextF } from '../components/global/CustomComponents';

function SymptomAsk() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNext = async () => {
    if (textFieldValue.trim() === '') {
      setError(true);
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/gemini', {
          message: textFieldValue,
        });

        navigate('diagnosis', { state: { 
          message: response.data.message,
          departments: response.data.departments
        } });
      } catch (error) {
        console.error('Error submitting the symptom description:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBoxClick = async (label) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/gemini', {
        message: label,
      });

      navigate('diagnosis', { state: { 
        message: response.data.message,
        departments: response.data.departments
      } });
    } catch (error) {
      console.error('Error submitting the symptom description:', error);
    } finally {
      setLoading(false);
      setDrawerOpen(false);
    }
  };

  const steps = ['증상 입력', 'AI 진단', '가까운 병원 추천'];


  const items = [
    { src: '/images/face-mask.png', label: '감기' },
    { src: '/images/knee.png', label: '관절통' },
    { src: '/images/migraine-headache.png', label: '두통' },
    { src: '/images/rash-on-hand.png', label: '피부 발진' },
    { src: '/images/stomach-organ.png', label: '복통' },
    { src: '/images/tendon.png', label: '근육통' },
    { src: '/images/tired.png', label: '피로감' },
    { src: '/images/ear.png', label: '이명' }
  ];

  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop: '40%' }}>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h3' sx={{ color: '#4A885D', fontWeight: 'bold' }}>1</Typography>
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>증상에 대해 자유롭게 설명해주세요.</Typography>
              <Typography variant='h8' sx={{ color: 'grey' }}>예시: 배가 아프고 식은땀이 나</Typography>
              {/* <Box>
                <img src='/images/symptom.png'/>
              </Box> */}
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="standard-multiline-flexible"
                label="자세히 설명할수록 좋아요."
                multiline
                maxRows={4}
                variant="standard"
                sx={{ width: '100%' }}
                value={textFieldValue}
                onChange={(e) => setTextFieldValue(e.target.value)}
                error={error}
                helperText={error ? '텍스트를 입력해주세요' : ''}
              />
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Btn
                onClick={handleNext} 
                sx={{
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%',
                  padding: 0,
                  minWidth: 0,
                  minHeight: 0,
                  boxSizing: 'border-box'
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: '16px' }} />
              </Btn>
            </Grid>
            {/* 간단한 증상 */}
            <Grid item xs={12} sx = {{ marginTop: '20%',
               display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Btn onClick={toggleDrawer(true)} 
                sx={{
                  width: '200px',
                  fontSize: '16px'
                }}
              >
                간단하게 찾고 싶다면?
              </Btn>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Loading open={loading} />
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ '& .MuiDrawer-paper': { width: isMobile ? '100%' : '60dvh', margin: '0 auto' } }} 
      >
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  sx={{
                    height: '150px',
                    border: '2px solid lightgrey',
                    borderRadius: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBoxClick(item.label)}
                >
                  <img
                    src={item.src}
                    alt={`image-${index}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70%',
                      objectFit: 'cover'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      marginTop: 1,
                      textAlign: 'center',
                      color: 'grey',
                      fontSize:'15px',
                      fontWeight: 'bold'
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer>
    </MainContainer>
  );
}

export default SymptomAsk;
