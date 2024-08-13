import React, { useEffect, useState, useContext } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import { LocationContext } from '../../LocationContext';

const MapComponent = () => {
  const { latitude, longitude } = useContext(LocationContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { state } = routeLocation;
  const { departments = [] } = state || {};

  useEffect(() => {
    const fetchHospitalsData = async () => {
      try {
        const response = await axiosInstance.get('/api/hospitals/all');
        setHospitals(response.data);
        console.log('병원 데이터를 가져왔습니다:', response.data);
        handleDepartmentSearch();
      } catch (error) {
        setError(error.message);
        console.error('병원 데이터 가져오기 오류:', error);
      }
    };

    fetchHospitalsData();
  }, []);

  useEffect(() => {
    if (latitude && longitude && hospitals.length > 0) {
      const distance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const filtered = hospitals.filter(hospital => {
        const hospitalLat = hospital.latitude;
        const hospitalLng = hospital.longitude;
        return distance(latitude, longitude, hospitalLat, hospitalLng) <= 5;
      });

      setFilteredHospitals(filtered);
    }
  }, [latitude, longitude, hospitals]);

  useEffect(() => {
    if (mapLoaded && latitude && longitude) {
      const mapDiv = document.getElementById('map');
      if (window.naver && window.naver.maps && mapDiv) {
        const mapInstance = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(latitude, longitude),
          zoom: 16
        });

        setMap(mapInstance);
      }
    }
  }, [mapLoaded, latitude, longitude]);

  useEffect(() => {
    if (map && filteredHospitals.length > 0) {
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = filteredHospitals.map(item => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.latitude, item.longitude),
          map: map,
          title: item.name
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (selectedHospital && selectedHospital.id === item.id) {
            setSelectedHospital(null);
            setShowDetails(false);
          } else {
            setSelectedHospital(item);
            setShowDetails(true);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, filteredHospitals, selectedHospital]);

  useEffect(() => {
    const loadMapScript = () => {
      if (!window.naver || !window.naver.maps) {
        const script = document.createElement('script');
        script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=327ksyij3n';
        script.async = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    };

    loadMapScript();

    return () => {
      const script = document.querySelector('script[src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=327ksyij3n"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleDepartmentSearch = () => {
    if (departments.length === 0) {
      setError('부서명이 입력되지 않았습니다.');
      return;
    }

    const departmentsArray = departments.map(dep => dep.trim());

    const filteredByDepartment = filteredHospitals.filter(hospital =>
      hospital.departments.some(department => departmentsArray.includes(department.name))
    );

    setFilteredHospitals(filteredByDepartment);

    if (map) {
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = filteredByDepartment.map(item => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.latitude, item.longitude),
          map: map,
          title: item.name
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (selectedHospital && selectedHospital.id === item.id) {
            setSelectedHospital(null);
            setShowDetails(false);
          } else {
            setSelectedHospital(item);
            setShowDetails(true);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  };

  useEffect(() => {
    handleDepartmentSearch();
  }, [departments]);

  const handleReservation = () => {
    if (selectedHospital) {
      navigate(`${selectedHospital.id}/reservation`);
    } else {
      setError('예약할 병원을 선택해주세요.');
    }
  };

  const handleViewAll = () => {
    navigate('/hospitals/list');
  };

  return (
    <MainContainer>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        my={4}
      >
        <Box sx={{ mb: 2, textAlign: 'center', fontSize: '23px' }}>
          추천 진료과는 다음과 같습니다.
        </Box>
        <Box
          height="auto"
          width="86%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={4}
          p={2}
          sx={{ border: '1px solid grey', mb: 2, borderRadius: '5px' }}
        >
          <Box sx={{ margin: '5px', padding: 'px', width: '100%', textAlign: 'center' }}>
            {departments
              .slice()
              .sort()
              .join(', ')}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={2} p={1}>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontSize: '20px',
              mr: 2,
            }}
          >
            현재 위치에 따른 5km 이내 병원
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewAll}
          >
            병원 더보기
          </Button>
        </Box>

        <Box
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid grey',
            padding: '10px',
            paddingLeft: '20px',
            borderRadius: '5px',
            width: '85%',
            mx: 'auto',
          }}
        >
          <Box sx={{ fontSize: '16px' }}>
            검색 결과 : {filteredHospitals.length}건
          </Box>
          <Button
            onClick={handleDepartmentSearch}
            variant="contained"
            color="primary"
            sx={{ marginLeft: '10px' }}
          >
            병원 찾기
          </Button>
        </Box>
        <Box sx={{ textAlign: 'right', fontSize: '12px', color: 'gray', mt: 1, ml: 'auto', pr: 4 }}>
          *병원 찾기 버튼을 눌려주세요
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="90%"
          mx="auto"
          mt={3}
        >
          <Box
            id="map"
            sx={{
              width: '95%', // 지도 박스의 너비를 95%로 설정
              height: '400px',
              border: '1px solid gray',
              mb: 2,
            }}
          >
            {/* 지도 컴포넌트 */}
          </Box>

          {error && <Box sx={{ color: 'red', mb: 2 }}>{error}</Box>}

          {selectedHospital && (
            <Box
              sx={{
                position: 'absolute',
                top: '110%',
                width: '90%',
                backgroundColor: 'white',
                padding: '20px',
                zIndex: 1,
                textAlign: 'left',
                border: '1px solid gray',
                borderRadius: '5px',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {selectedHospital.name}
              </Typography>
              <Typography>
                <strong>주소:</strong> {selectedHospital.address}
              </Typography>
              <Typography>
                <strong>진료과목:</strong>
              </Typography>
              <ul
                style={{
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                {selectedHospital.departments.map((department) => (
                  <li
                    key={department.id}
                    style={{
                      marginRight: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    #{department.name}
                  </li>
                ))}
              </ul>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> {/* 버튼을 오른쪽으로 정렬 */}
                <Button onClick={handleReservation} variant="contained" color="primary" sx={{ marginTop: '10px' }}>
                  병원 예약
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </MainContainer>

  );
};

export default MapComponent;
