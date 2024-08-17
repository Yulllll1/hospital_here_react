import React, { useEffect, useState, useContext } from 'react';
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
import RemoveIcon from '@mui/icons-material/Remove';
import { Loading } from "../../components/Loading";
import { useLocation } from 'react-router-dom';
import Pagination from '../../components/board/Pagination';
import { Btn, Btntwo, SmallBtn, TextF } from '../../components/global/CustomComponents';

const HospitalResult = (hospital) => {
  const location = useLocation();
  const departmentsFromState = location.state?.departments || [];
  const { latitude, longitude } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState(departmentsFromState);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();
  const [showReviews, setShowReviews] = useState(false);
  const [searchParams, setSearchParams] = useState({
    departmentNames: departmentsFromState,
    page: 0,
    size: 5,
  });

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setSearchParams(prev => ({
      ...prev,
      page,
      departmentNames: prev.departmentNames.length > 0 ? prev.departmentNames : departments,
    }));
  };

  //검색이 실행되었는지 확인
  const [hasSearched, setHasSearched] = useState(false); 


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
    console.log('Received departments from navigate:', departmentsFromState); // 콘솔에 departments 값 출력
  }, [departmentsFromState]);



  useEffect(() => {
    if (departments.length > 0) {
      const departmentNames = departments.join(', ');
      console.log('Initialized departmentNames:', departmentNames); // 콘솔 출력
      setDepartmentInput(departmentNames);
    }
  }, [departments]); // departments가 변경될 때만 실행


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
        const departmentNamesString = searchParams.departmentNames.join(', ');
        const response = await axiosInstance.get('/api/search', {
          params: {
            ...searchParams,
            latitude,
            longitude,
            departmentNames: departmentNamesString,
          },
        });
  
        console.log('API 응답 데이터:', response.data);
  
        // 서버에서 가져온 데이터
        let hospitalsData = response.data.content;
  
        // 거리 기준으로 오름차순 정렬
        hospitalsData.sort((a, b) => a.distance - b.distance);
  
        // 병원 정보에 평균 평점과 리뷰 수를 추가
        const hospitalsWithAvgRating = await Promise.all(
          hospitalsData.map(async (hospital) => {
            const avgRatingAndReviewCount = await fetchAvgRatingAndReviewCount(hospital.id);
            return {
              ...hospital,
              avgRating: avgRatingAndReviewCount ? avgRatingAndReviewCount.avgRating : 0.0,
              reviewCount: avgRatingAndReviewCount ? avgRatingAndReviewCount.reviewCount : 0,
            };
          })
        );
  
        // 평점과 리뷰 수를 추가한 병원 정보를 다시 거리 기준으로 오름차순 정렬
        hospitalsWithAvgRating.sort((a, b) => a.distance - b.distance);
  
        // 상태 업데이트
        setHospitals(hospitalsWithAvgRating);
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
          <Btn
            onClick={() => handleLoadMoreReviews(hospitalId)}
            disabled={loading}
          >
            {loading ? '로딩 중...' : '리뷰 더보기'}
          </Btn>
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
            <Btn
              onClick={() => handleLoadMoreReviews(hospitalId)}
              disabled={loading}
              sx={commonButtonStyles(loading, 'primary')}
            >
              {loading ? '로딩 중...' : '리뷰 더보기'}
            </Btn>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Btn
            onClick={() => handleCloseReviews(hospitalId)}
          >
            리뷰 닫기
          </Btn>
        </Box>
      </>
    );
  };

  const handleSearch = () => {
    const departmentNames = departmentInput.split(',').map(name => name.trim()).filter(name => name);
    setSearchParams(prev => ({
      ...prev,
      departmentNames,
      page: 0,
      size: pageSize,
    }));
  };

  const handleDepartmentInputChange = (e) => {
    setDepartmentInput(e.target.value);
  };

  const handleFilter = (departmentName) => {
    setSelectedDepartment(departmentName);
  };

  const handleMapClick = (hospital) => {
    // 선택된 병원이 현재 선택된 병원과 같은지 비교하여 상태를 업데이트
    const newSelectedHospital = hospital.id === selectedHospital?.id ? null : hospital;
    setSelectedHospital(newSelectedHospital);
    setShowReviews(true); // 지도를 보여주고 리뷰도 보이게 설정
  };

  // 현재 선택된 병원과 동일한 병원인지 체크하여 아이콘 결정
  const isHospitalSelected = selectedHospital?.id === hospital.id;


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
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
        >
          {i + 1}
        </Button>
      );
    }
    return pageNumbers;
  };



  //예약 관련 코드
  const handleReservation = (hospital) => {
    if (hospital) {
      console.log(hospital.id);
      navigate(`/hospitals/maps/${hospital.id}/reservation`, {
      state: { hospital }
      })} else {
      setError('예약할 병원을 선택해주세요.');
    }
  };

  

  const fetchAvgRatingAndReviewCount = async (hospitalId) => {
    try {
      const response = await axiosInstance.get(`/review/avg/${hospitalId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (!hasSearched) {
      console.log('Triggering handleSearch');
      handleSearch();
      setHasSearched(true);
    }
  }, [hasSearched]);

  if (loading) return <Loading open={true} />;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <MainContainer>
      <Box className="container" sx={{ padding: '20px', marginLeft: 2, marginRight: 2 }}>
        <Typography variant="h5" sx={ {fontWeight:'bold'}}>병원 리스트</Typography>

        <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Box sx={{ bgcolor: '#F3F4F0', padding: 2, borderRadius: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ marginLeft: 2 }}>
                <Typography variant='body1'>
                  현재 위치 기준 가까운&nbsp;&nbsp;<span style={{ fontWeight: 'bold' }}>{departments.join(', ')}</span>
                </Typography>
                </Box>
              </Box>
            </Grid>

          <Grid item xs={12} sm={2} md={2}>
            <Button fullWidth variant="contained" color="primary" onClick={handleSearch} sx={{ height: '100%', display: 'none' }}>검색</Button>
          </Grid>


        <List sx={{ border: '1px solid #ddd', borderRadius: '20px', padding: '0', marginTop: '20px' }}>
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
                      sx={{color: '#4a885d', marginLeft:'-7px' }}
                    >
                      {isBookmarked(hospital.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <Typography variant="h6" component="strong">
                      {hospital.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <LocationOnIcon sx={{ marginRight: '8px', color: '#4a885d' }} />
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
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <StarIcon sx={{ color: 'gold', marginRight: '6px', marginLeft:'1px' }} />
                    <Typography variant="body2">
                      평균 평점: {hospital.avgRating !== undefined ? hospital.avgRating.toFixed(1) : "평점 없음"} ({hospital.reviewCount || 0} 리뷰)
                    </Typography>
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
                  <Typography variant="body2">
                    전화번호 :
                    <a href={`tel:${hospital.telephoneNumber}`} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '8px' }}>
                      {hospital.telephoneNumber}
                    </a>
                  </Typography>
                  <Typography variant="body2">
                      {hospital.openStatusMessage}
                  </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SmallBtn
                        onClick={() => handleReservation(hospital)}
                      >
                        예약
                      </SmallBtn>
                      <IconButton
                        onClick={() => handleMapClick(hospital)}
                        sx={{ color: '#4a885d' }}
                      >
                        {selectedHospital && selectedHospital.id === hospital.id ? <RemoveIcon /> : <AddIcon />}
                      </IconButton>

                    </Box>
                  </Box>
                </Box>
                {selectedHospital?.id === hospital.id && (
                  <Box sx={{ width: '100%' }}>
                    {renderMap()}
                    <Box sx={{ bgcolor: '#F3F4F0', padding: 2, borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', mt:2 }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          whiteSpace: 'pre-line',
                          textAlign: 'center',
                        }}
                        >
                        {hospital.formattedOpenHours}
                      </Typography>
                    </Box>
                    {renderReviews(hospital.id)}
                  </Box>
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ padding: '10px' }}>병원이 없습니다</Typography>
          )}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageClick} />
        </Box>
      
      </Box>
    </MainContainer>

  );
};

export default HospitalResult;
