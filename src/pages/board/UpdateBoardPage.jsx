import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import BoardForm from '../../components/board/BoardForm';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress } from '@mui/material';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `${token}`
  };
}

function UpdateBoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/boards/${id}`, {
      headers: getAuthHeaders()
    })
      .then(response => setBoard(response.data))
      .catch(error => console.error('게시판 정보를 가져오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/boards/${id}`, data, {
        headers: getAuthHeaders()
      });
      navigate(`/boards/${id}`);
    } catch (error) {
      console.error('게시판 업데이트 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!board) return <p>게시판 정보를 불러오는 중입니다...</p>;

  return (
    <MainContainer>
      <BoardForm onSubmit={handleSubmit} initialValues={board} />
    </MainContainer>
  );
}

export default UpdateBoardPage;
