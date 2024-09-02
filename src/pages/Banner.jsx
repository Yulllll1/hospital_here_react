import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axios';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Slick Slider 설정
const settings = {
  centerMode: true,
  centerPadding: '20px',
  infinite: true,
  speed: 1000, // 슬라이드 전환 속도
  slidesToShow: 3, // 보일 슬라이드 수
  slidesToScroll: 1,
  autoplay: true, // 자동 재생
  autoplaySpeed: 3000, // 자동 재생 간격
  cssEase: 'ease-in-out',
  pauseOnHover: false,
};

// 스타일드 컴포넌트
const StyledSlider = styled(Slider)`
  .slick-slide {
    padding: 0 10px; /* 슬라이드 간의 간격 추가 */
  }

  .slick-slide > div {
    width: 100%; /* 슬라이드의 너비를 100%로 설정 */
    display: flex;
    justify-content: center;
  }

  .slick-track {
    display: flex;
  }
`;

const SlideBox = styled(Box)`
  background-color: #FCFCFC;
  border-radius: 10px;
  border: 1px solid #E9E9EA;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px; /* 슬라이드 내 여백 */
`;

const Banner = () => {
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/webscraping/latest')
      .then(response => {
        setDiseases(response.data);
      })
      .catch(error => {
        console.error("데이터 에러", error);
      });
  }, []);

  const StyledLink = styled('a')({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
});



return (
  <Box sx={{ width: '100%', marginTop: 3 }}>
    <StyledSlider {...settings}>
      {diseases.length > 0 ? (
        diseases.map((disease) => {
          // rank에 따른 URL 설정
          let url = '';
          switch (disease.rank) {
            case 1:
              url = '/posts/22';
              break;
            case 2:
              url = '/posts/24';
              break;
            case 3:
              url = '/posts/25';
              break;
            case 4:
              url = '/posts/26';
              break;
            case 5:
              url = '/posts/27';
              break;
            default:
              url = '#'; // rank가 1에서 5 사이가 아닐 경우
          }

          return (
            <StyledLink 
              href={url} 
              key={disease.id} 
              rel="noopener noreferrer"
            >
              <SlideBox>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <img
                    src='/images/Trophy.png'
                    alt="Top"
                    style={{ width: '30px', height: '30px' }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    TOP {disease.rank}
                  </Typography>
                  <Typography variant="h8" sx={{ color: 'black' }}>
                    {disease.diseaseName}
                  </Typography>
                </Box>
              </SlideBox>
            </StyledLink>
          );
        })
      ) : (
        <SlideBox>
          <Typography variant="h6" color="text.primary">
            로딩중...
          </Typography>
        </SlideBox>
      )}
    </StyledSlider>
  </Box>
);


};

export default Banner;
