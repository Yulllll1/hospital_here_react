import React, { useState, useContext } from 'react';
import { axiosInstance } from '../utils/axios';
import { useNavigate } from 'react-router';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LocationContext } from '../LocationContext';
import MainContainer from '../components/global/MainContainer';
import { CustomScrollBox } from '../components/CustomScrollBox';

function OtherLocationPage() {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { setLatitude, setLongitude, setAddress: setContextAddress } = useContext(LocationContext);
  const navigate = useNavigate();

  // 도로명 주소 검색
  const handleSearch = async () => {
    try {
      const response = await fetch(`https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDI0MDgwODIwMDI0MTExNDk5ODk=&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(address)}&resultType=json`);
      const data = await response.json();
      if (data.results && data.results.juso) {
        setResults(data.results.juso);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
      setResults([]);
    }
  };

  // 검색된 주소 선택
  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  
  // 선택된 주소로 위도, 경도 조회 후 Context에 저장
  const handleSubmit = async () => {
    if (selectedAddress) {
      
      try {
        const encodedAddress = encodeURIComponent(selectedAddress.roadAddr);
        const response = await axiosInstance.get(`/api/geocode/address-to-coords?address=${encodedAddress}`);
        const data = response.data;
        
        console.log('Geocode API response:', data); // 응답 데이터 확인
  
        if (data && data.addresses && data.addresses.length > 0) {
          const { roadAddress, x, y } = data.addresses[0];
  
          setLatitude(y);
          setLongitude(x);
          setContextAddress(roadAddress);
  
          navigate('/location');
        } else {
          console.error('Invalid geocode data: ', data);
        }
      } catch (error) {
        console.error('Error handling selected address:', error);
      }
    }
  };
  

  return (
    <MainContainer>
      <CustomScrollBox>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>도로명 주소로 검색하세요.</Typography>
        <Typography variant="h7" gutterBottom>예시 : 위례성대로 2</Typography>
        <TextField
          variant="outlined"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={handleSearch} variant="contained" color="primary" sx={{ marginTop: 2 }}>
          검색
        </Button>
        <Box sx={{ marginTop: 2 }}>
          {results.map((result, index) => (
            <Box key={index} onClick={() => handleSelect(result)} sx={{ padding: 1, cursor: 'pointer', border: '1px solid #ccc', marginBottom: 1 }}>
              <Typography>{result.roadAddr}</Typography>
            </Box>
          ))}
        </Box>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginTop: 2 }}>
          이 위치로 이동
        </Button>
      </Box>
      </CustomScrollBox>
    </MainContainer>
  );
}

export default OtherLocationPage;
