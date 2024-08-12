import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import ProfileImage from './ProfileImage';
import { createChatRoom } from '../../utils/axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function InsertMessage() {
  const [auth] = useRecoilState(userauthState);
  const setChatRoom = useSetRecoilState(chatRoomState);

  const navigate = useNavigate();

  const handleButtonClick = e => {
    const isConfirmed = window.confirm(`'${e.target.innerText}'을(를) 선택하시겠습니까?`);
    if (!isConfirmed) {
      return;
    }

    createChatRoom(e.target.getAttribute('type'), navigate, setChatRoom);
  };

  useEffect(() => {
    if (!auth.isLoggedIn) {
      alert('잘못된 접근입니다');
      navigate('/');
    }
  }, []);

  return (
    <Container>
      <ProfileImage insert={true} self={true} size={'3rem'} />
      <ButtonWrapper>
        <p className='mb-2'>채팅을 선택해주세요!</p>
        {auth.role !== 'DOCTOR' && (
          <Button
            type='DOCTOR'
            variant='contained'
            style={{ marginBottom: '4px' }}
            onClick={handleButtonClick}
          >
            증상 간편 상담 (의사)
          </Button>
        )}
        {auth.role !== 'ADMIN' && (
          <Button
            type='SERVICE'
            variant='contained'
            style={{ marginBottom: '4px' }}
            onClick={handleButtonClick}
          >
            고객 센터
          </Button>
        )}
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  margin-top: 2px;
  padding: 2px;
  width: 60%;
  border-radius: 10px;
  order: 2;
`;

export default InsertMessage;
