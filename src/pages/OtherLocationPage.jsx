import React, { useState, useContext } from 'react';
import { axiosInstance } from '../utils/axios';
import { useNavigate } from 'react-router';
import { Box, Grid, Typography, Container, Pagination } from '@mui/material';
import { LocationContext } from '../LocationContext';
import MainContainer from '../components/global/MainContainer';
import { Btntwo, Btn, TextF } from '../components/global/CustomComponents';;

function OtherLocationPage() {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 관리
  const [totalCount, setTotalCount] = useState(0); // 전체 결과 수를 관리
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { setLatitude, setLongitude, setAddress: setContextAddress } = useContext(LocationContext);
  const navigate = useNavigate();

  // 주소 유효성 검사
  const validateAddress = (input) => {
    if (input.length > 0) {
      const specialCharPattern = /[%=><]/;
      if (specialCharPattern.test(input)) {
        alert("특수문자를 입력할 수 없습니다.");
        return false;
      }

      const sqlKeywords = [
        "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
        "UNION", "FETCH", "DECLARE", "TRUNCATE"
      ];

      for (let keyword of sqlKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        if (regex.test(input)) {
          alert(`"${keyword}"와 같은 특정문자는 검색할 수 없습니다.`);
          return false;
        }
      }
    }
    return true;
  };

  // 페이지 변경 함수
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    handleSearch(page);
  };

  const handleSearch = async (page = 1) => {
    if (!validateAddress(address)) {
      return;
    }
    setSearchPerformed(true);
    try {
      const response = await axiosInstance.get(`/api/geocode/search-address?address=${address}&currentPage=${page}`);
      const data = response.data;

      if (data.results && data.results.juso) {
        setResults(data.results.juso);
        setTotalCount(parseInt(data.results.common.totalCount, 10));

      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('주소 데이터를 가져오는 중 오류가 발생했습니다:', error);
      setResults([]);
      setTotalCount(0);
    }
  };

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };



  const handleSubmit = async () => {
    if (selectedAddress) {
      try {
        const encodedAddress = encodeURIComponent(selectedAddress.jibunAddr);
        const response = await axiosInstance.get(`/api/geocode/address-to-coords?address=${encodedAddress}`);
        const data = response.data;

        console.log('Geocode API response:', data);

        if (data && data.addresses && data.addresses.length > 0) {
          const { x, y } = data.addresses[0];

          setLatitude(y);
          setLongitude(x);
          setContextAddress(selectedAddress.roadAddr);

          navigate('/location');
        } else {
          console.error('Invalid geocode data: ', data);
        }
      } catch (error) {
        console.error('Error handling selected address:', error);
      }
    }
  };

  const totalPages = Math.ceil(totalCount / 10); // 10개씩 페이지네이션

  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx = {{marginTop: 3}}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>주소를 검색해주세요.</Typography>
              <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
                - 도로명 + 건물 번호{'\n'}- 건물명 + 번지{'\n'}- 건물명 혹은 아파트명
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextF
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(1);
                          }
                      }}
                      fullWidth
                      sx={{ marginRight: 2 }}
                  />
                  <Btntwo
                      onClick={() => handleSearch(1)}
                  >
                      Search
                  </Btntwo>
              </Box>
            </Grid>
            <Grid item xs={12}>
            <Box sx={{ marginTop: 2 }}>
                {searchPerformed ? ( // 검색이 수행된 후에만 결과를 표시
                  results.length > 0 ? (
                    results.map((result, index) => (
                      <Box
                        key={index}
                        onClick={() => handleSelect(result)}
                        sx={{
                          padding: 1,
                          cursor: 'pointer',
                          border: '1px solid #ccc',
                          borderRadius: '40px',
                          marginBottom: 1,
                          backgroundColor: selectedAddress === result ? '#E9E9E9' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#E9E9E9',
                          },
                        }}
                      >
                        <Typography>{result.roadAddr}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx = {{ padding: 1, border: '1px solid #ccc', borderRadius: '40px', cursor: 'pointer'}}>
                      <Typography>검색 결과가 없습니다.</Typography>
                    </Box>
                  )
                ) : (
                  <Typography></Typography>
                )}
              </Box>
              
            </Grid>
            <Grid item xs={12}>
            {(results.length > 0 && searchPerformed) && (
              <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                size="small"
                onChange={handlePageChange}
              />
              
              <Btn onClick={handleSubmit} sx={{ marginTop: 2 }}>
              이 위치로 이동
              </Btn>
            </Box>
            )}
            </Grid>
        </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
}

export default OtherLocationPage;
