import React, { useRef, useEffect, useState, useContext } from 'react';
import MainContainer from '../components/global/MainContainer';
import { Box, Typography, IconButton, Button } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation'; // Add Material UI icon
import { LocationContext } from '../LocationContext'; 
import { useNavigate } from 'react-router';
import { axiosInstance } from '../utils/axios';
import { Btn, TextF } from '../components/global/CustomComponents';

function LocationPage() {
  const mapRef = useRef(null);
  const [center, setCenter] = useState(null);
  const [address, setAddress] = useState('');
  const [infoWindowContent, setInfoWindowContent] = useState('현재 위치');
  const [map, setMap] = useState(null);
  const { latitude, longitude, address: contextAddress, setLatitude, setLongitude, setAddress: setContextAddress } = useContext(LocationContext); 
  const navigate = useNavigate();

  const handleHomepage = () => {
    navigate('/');
  };

  const handleOtherPage = () => {
    navigate('other');
  };
  
  //현재 위치 로드
  const fetchCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setAddress('현재 위치 로딩 중...');
          setInfoWindowContent('현재 위치');
  
          // axiosInstance를 사용하여 위치 정보 API 호출
          axiosInstance.get(`/api/geocode/coords-to-address?lat=${latitude}&lng=${longitude}`)
            .then(response => {
              const data = response.data;
              if (data && data.results && data.results.length > 0) {
                const result = data.results[0].region;
                const addressParts = [
                  result.area1?.name || '',
                  result.area2?.name || '',
                  result.area3?.name || '',
                  result.area4?.name || ''
                ];
                const address = addressParts.join(' ');
                setAddress(address.trim());
                
                // LocationContext에 현재 위치 저장
                setLatitude(latitude);
                setLongitude(longitude);
                setContextAddress(address.trim());
              } else {
                setAddress('주소를 찾을 수 없습니다.');
              }
            })
            .catch(error => {
              console.error('Geocoding API error:', error);
              setAddress('주소를 가져오지 못했습니다.');
            });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setCenter({ lat: 37.3595704, lng: 127.105399 });
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCenter({ lat: 37.3595704, lng: 127.105399 });
    }
  };
  
  //사용자 클릭 위치 로드
  const handleMapClick = (e) => {
    const lat = e.coord.lat();
    const lng = e.coord.lng();
    setCenter({ lat, lng });
    fetchAddressFromCoordinates(lat, lng);
  };
  
  const fetchAddressFromCoordinates = (lat, lng) => {
    setAddress('현재 위치 로딩 중...');
    axiosInstance.get(`/api/geocode/coords-to-address?lat=${lat}&lng=${lng}`)
      .then(response => {
        const data = response.data;
        if (data && data.results && data.results.length > 0) {
          const result = data.results[0].region;
          const addressParts = [
            result.area1?.name || '',
            result.area2?.name || '',
            result.area3?.name || '',
            result.area4?.name || ''
          ];
          const address = addressParts.join(' ');
          setAddress(address.trim());

          // LocationContext에 현재 위치 저장
          setLatitude(lat);
          setLongitude(lng);
          setContextAddress(address.trim());
        } else {
          setAddress('주소를 찾을 수 없습니다.');
        }
      })
      .catch(error => {
        console.error('Geocoding API error:', error);
        setAddress('주소를 가져오지 못했습니다.');
      });
  };


  //현위치 표시
  useEffect(() => {
    if (latitude && longitude) {
      setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
      setAddress(contextAddress || '현재 위치');
      setInfoWindowContent(contextAddress ? '검색된 위치' : '현재 위치');
    } else {
      fetchCurrentPosition();
    }
  }, [latitude, longitude, contextAddress]);


  //지도 표시
  useEffect(() => {
    if (window.naver && mapRef.current && center) {
      const newMap = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 30, //지도 확대
      });
  
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(center.lat, center.lng),
        map: newMap,
      });
  
      const infowindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="
            font-size: 14px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          ">
            <strong style="font-size: 16px; color: #333;">${infoWindowContent}</strong>
            <div style="margin-top: 5px; color: #666;">${address.trim() || '주소를 찾을 수 없습니다.'}</div>
          </div>`,
      });
  
      infowindow.open(newMap, marker);
      setMap(newMap);  //맵 객체 저장
  
      window.naver.maps.Event.addListener(newMap, 'click', handleMapClick);
  
    }
  }, [center, address, infoWindowContent]);



  return (
    <MainContainer>
        <Box sx={{ position: 'relative', width: '100%', height: '100%'}}>
        <Box
            ref={mapRef}
            sx={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            }}
        />
        <Box
            sx={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            }}
        >
            <Btn onClick={handleHomepage}>이 위치로 설정</Btn>
            <Btn onClick={handleOtherPage}>다른 위치 찾기</Btn>
            <IconButton
            onClick={fetchCurrentPosition}
            sx={{
            width: 35,
            height: 35,
            display: 'flex',
            bgcolor: '#fff',
            borderRadius: '50%',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            }}
        >
            <MyLocationIcon sx={{ color: '#4A885D' }} />
        </IconButton>
        </Box>
        
        </Box>
    </MainContainer>
  );
}

export default LocationPage;
