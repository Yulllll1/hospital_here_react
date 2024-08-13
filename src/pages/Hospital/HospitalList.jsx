import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MainContainer from '../../components/global/MainContainer';
import HospitalReviewCard from '../../components/HospitalReviewCard';
import { axiosInstance } from '../../utils/axios';
import { Box, Typography, Button, TextField, Select, MenuItem, List, ListItem, FormControl, InputLabel, Grid, IconButton } from '@mui/material';
import { LocationContext } from '../../LocationContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { Loading } from "../../components/Loading";

const HospitalList = () => {
  const { latitude, longitude } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();
  const [showReviews, setShowReviews] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: '',
    departmentName: '',
    address: '',
    page: 0,
    size: 5,
  });

  // 리뷰 관련 상태 추가
  const [hospitalReviews, setHospitalReviews] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState({});
  const [reviewsPage, setReviewsPage] = useState({});
  const [reviewsLoaded, setReviewsLoaded] = useState({});
  const [hasMoreReviews, setHasMoreReviews] = useState({});

  // 북마크 상태
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  const pageSize = 5;
  const reviewPageSize = 4;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/api/departments');
        setDepartments(response.data || []);
      } catch (error) {
        console.error('fetching departments 에러:', error);
      }
    };

    fetchDepartments();
  }, []);

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

  useEffect(() => {
    if (mapLoaded && selectedHospital) {
      const { latitude, longitude } = selectedHospital;
      const mapDiv = document.getElementById(`map-${selectedHospital.id}`);
      if (mapDiv && window.naver && window.naver.maps) {
        const map = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(latitude, longitude),
          zoom: 15,
        });

        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(latitude, longitude),
          map: map,
          title: selectedHospital.name,
        });
      }
    }
  }, [mapLoaded, selectedHospital]);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!latitude || !longitude) return;
  
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/search', {
          params: {
            ...searchParams,
            latitude,
            longitude,
          },
        });
  
        console.log('API 응답 데이터:', response.data);
  
        // 서버에서 가져온 데이터
        let hospitalsData = response.data.content;
  
        // 거리 기준으로 오름차순 정렬
        hospitalsData.sort((a, b) => a.distance - b.distance);
  
        setHospitals(hospitalsData);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        setError(error);
        console.error('fetching hospitals 에러:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHospitals();
  }, [searchParams, currentPage, latitude, longitude]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setBookmarksLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/bookmark', {
          headers: {
            Authorization: `${token}`
          }
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchBookmarks(); // 컴포넌트가 마운트될 때 북마크 데이터를 로드함
  }, []);

  const fetchReviews = async (hospitalId, page = 0) => {
    setReviewsLoading(prev => ({ ...prev, [hospitalId]: true }));
    try {
      const response = await axiosInstance.get(`/review/${hospitalId}/Page`, {
        params: { page, size: reviewPageSize },
      });

      const totalPages = response.data.totalPages;
      const currentPage = response.data.number;

      const reviewsWithUsernames = await Promise.all(
        response.data.content.map(async review => {
          try {
            const userResponse = await axiosInstance.get(`/review/findUser/${review.userId}`);
            return {
              ...review,
              userName: userResponse.data,
            };
          } catch (error) {
            console.error(error);
            return {
              ...review,
              userName: '탈퇴한 유저'
            };
          }
        })
      );

      setHospitalReviews(prev => ({
        ...prev,
        [hospitalId]: (prev[hospitalId] || []).concat(reviewsWithUsernames),
      }));
      setReviewsPage(prev => ({ ...prev, [hospitalId]: page }));
      setReviewsLoaded((prev) => ({ ...prev, [hospitalId]: true }));
      setHasMoreReviews((prev) => ({
        ...prev,
        [hospitalId]: currentPage < totalPages - 1,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setReviewsLoading(prev => ({ ...prev, [hospitalId]: false }));
    }
  };

  const handleLoadMoreReviews = (hospitalId) => {
    const nextPage = reviewsPage[hospitalId] !== undefined ? reviewsPage[hospitalId] + 1 : 0;
    fetchReviews(hospitalId, nextPage);
  };

  const handleCloseReviews = (hospitalId) => {
    setHospitalReviews(prev => ({
      ...prev,
      [hospitalId]: [],
    }));
    setReviewsPage(prev => ({
      ...prev,
      [hospitalId]: -1,
    }));
    setReviewsLoaded(prev => ({
      ...prev,
      [hospitalId]: false,
    }));
  };

  const handleAddBookmark = async (hospitalId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const bookmarkDTO = {
        userId: userId,
        hospitalId: hospitalId,
      };
      await axiosInstance.post('/bookmark', bookmarkDTO, {
        headers: {
          Authorization: `${token}`
        }
      });
      setBookmarks([...bookmarks, { hospitalId }]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveBookmark = async (hospitalId) => {
    try {
      const token = localStorage.getItem('token');

      await axiosInstance.delete(`/bookmark/${hospitalId}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setBookmarks(bookmarks.filter(bookmark => bookmark.hospitalId !== hospitalId));
    } catch (error) {
      console.error(error);
    }
  };

  const isBookmarked = (hospitalId) => {
    return bookmarks.some(bookmark => bookmark.hospitalId === hospitalId);
  };

  const commonButtonStyles = (loading, color) => ({
    borderColor: loading ? 'grey.500' : `${color}.main`,
    color: loading ? 'grey.500' : `${color}.main`,
    '&:hover': {
      borderColor: loading ? 'grey.500' : `${color}.dark`,
      color: loading ? 'grey.500' : 'black',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
    padding: '6px 14px',
    fontSize: '14px',
    borderRadius: '6px',
    margin: '3px',
    transition: 'all 0.3s ease', // 부드러운 전환
  });
  
  const renderReviews = (hospitalId) => {
    const reviews = hospitalReviews[hospitalId] || [];
    const loading = reviewsLoading[hospitalId];
    const loaded = reviewsLoaded[hospitalId]; // 리뷰 로드 여부
    const moreReviews = hasMoreReviews[hospitalId];
  
    if (!loaded) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Button
            onClick={() => handleLoadMoreReviews(hospitalId)}
            disabled={loading}
            variant="outlined"
            color="primary"
            sx={commonButtonStyles(loading, 'primary')}
          >
            {loading ? '로딩 중...' : '리뷰 더보기'}
          </Button>
        </Box>
      );
    }
  
    return (
      <>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <HospitalReviewCard review={review} />
              </li>
            ))}
          </ul>
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
        {moreReviews && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Button
              onClick={() => handleLoadMoreReviews(hospitalId)}
              disabled={loading}
              variant="outlined"
              color="primary"
              sx={commonButtonStyles(loading, 'primary')}
            >
              {loading ? '로딩 중...' : '리뷰 더보기'}
            </Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Button
            onClick={() => handleCloseReviews(hospitalId)}
            variant="outlined"
            color="primary"
            sx={commonButtonStyles(loading, 'primary')}
          >
            리뷰 닫기
          </Button>
        </Box>
      </>
    );
  };
  
  

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleSearch = () => {
    const [name, address] = searchInput.split(',').map(part => part.trim());
    setSearchParams({
      name: name || '',
      departmentName: selectedDepartment,
      address: address || '',
      page: 0,
      size: pageSize,
    });
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartmentInput(e.target.value);
  };


  const handleFilter = (departmentName) => {
    setSelectedDepartment(departmentName);
  };

  const handleMapClick = (hospital) => {
    setSelectedHospital(hospital.id === selectedHospital?.id ? null : hospital);
    setShowReviews(true); // 지도를 보여주고 리뷰도 보이게 설정
  };

  const renderMap = () => {
    if (selectedHospital) {
      return (
        <div id={`map-${selectedHospital.id}`} style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
      );
    }
    return null;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };



  //예약 관련 코드
  const handleReservation = (hospital) => {
    if (hospital) {
      console.log(hospital.id);
      navigate(`/hospitals/maps/${hospital.id}/reservation`);
    } else {
      setError('예약할 병원을 선택해주세요.');
    }
  };


  if (loading) return <Loading open={true} />;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <MainContainer>
      <Box className="container" sx={{ padding: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <Typography variant="h5" component="h5">병원 검색하기</Typography>

        <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              fullWidth
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="병원 이름 또는 주소를 입력"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="department-select-label">모든 부서</InputLabel>
              <Select
                labelId="department-select-label"
                value={selectedDepartment}
                onChange={e => handleFilter(e.target.value)}
                label="모든 부서"
              >
                <MenuItem value="">
                  <em>모든 부서</em>
                </MenuItem>
                {departments.map(department => (
                  <MenuItem key={department.id} value={department.name}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2} md={2}>
            <Button fullWidth variant="contained" color="primary" onClick={handleSearch} sx={{ height: '100%' }}>검색</Button>
          </Grid>
        </Grid>

        <List sx={{ border: '1px solid #ddd', borderRadius: '4px', padding: '0', marginTop: '20px' }}>
          {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <ListItem
                key={hospital.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  borderBottom: index === hospitals.length - 1 ? 'none' : '1px solid #ddd',
                  padding: '20px'
                }}
              >
                <Box sx={{ width: '100%', marginBottom: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <IconButton
                      onClick={() => isBookmarked(hospital.id) ? handleRemoveBookmark(hospital.id) : handleAddBookmark(hospital.id)}
                      sx={{ marginRight: '7px', color: 'primary.main' }}
                    >
                      {isBookmarked(hospital.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <Typography variant="h6" component="strong">
                      {hospital.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <LocationOnIcon sx={{ marginRight: '8px', color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        {hospital.address}
                      </Typography>
                      <Typography variant="body2" sx={{ marginLeft: 'auto' }}>
                        {latitude && longitude && hospital.distance !== null
                          ? `${Math.abs(hospital.distance).toFixed(2)} km`
                          : '거리 정보를 가져올 수 없습니다.'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <Typography variant="body2">진료과목:</Typography>
                    {hospital.departments && hospital.departments.length > 0 ? (
                      hospital.departments.map(department => (
                        <Box key={department.id} sx={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px', whiteSpace: 'nowrap' }}>
                          <Typography variant="body2">{department.name}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">부서 정보가 없습니다.</Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Typography variant="body2">전화번호: {hospital.telephoneNumber}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginRight: '10px' }}
                        onClick={() => handleReservation(hospital)}
                      >
                        예약
                      </Button>
                      <IconButton
                        onClick={() => handleMapClick(hospital)}
                        sx={{ color: 'primary.main' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                {selectedHospital?.id === hospital.id && (
                  <Box sx={{ width: '100%' }}>
                    {renderMap()}
                    {renderReviews(hospital.id)}
                  </Box>
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ padding: '10px' }}>병원이 없습니다</Typography>
          )}
        </List>

        
      <Box
        sx={{
          display: 'flex', // 플렉스 박스를 사용하여 버튼을 배치
          justifyContent: 'center', // 버튼을 수평 중앙에 배치
          marginTop: '20px', // 상단 여백 추가
          marginBottom: '20px', // 하단 여백 추가
          padding: '10px', // 패딩 추가
        }}
      >
        {renderPageNumbers().map((button, index) => (
          <Box
            key={index}
            sx={{
              margin: '0 8px', // 각 버튼 사이의 좌우 여백을 설정 (간격 조정)
            }}
          >
            {React.cloneElement(button, {
              sx: {
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  backgroundColor: 'transparent',
                },
              },
            })}
          </Box>
        ))}
      </Box>
      </Box>
    </MainContainer>

  );
};

export default HospitalList;
