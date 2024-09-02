import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import ProfileImage from './ProfileImage';
import { createChatRoom } from '../../utils/axios';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../../components/global/CustomComponents';

function InsertMessage() {
  const params = useParams();

  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const room = chatRoom?.rooms[`ch_${params.chatRoomId}`];

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
      <Wrapper>
        <p style={{ textAlign: 'left', paddingLeft: '10px' }}>
          <InsertMessageInfo room={room} />
        </p>
        {auth.role !== 'DOCTOR' && !room?.status?.status && (
          <Btn
            type='DOCTOR'
            style={{ width: '100%', marginBottom: 10 }}
            onClick={handleButtonClick}
          >
            증상 간편 상담 (의사)
          </Btn>
        )}
        {auth.role !== 'ADMIN' && !room?.status?.status && (
          <Btn
            type='SERVICE'
            style={{ width: '100%', marginBottom: 10 }}
            onClick={handleButtonClick}
          >
            고객 센터
          </Btn>
        )}
      </Wrapper>
    </Container>
  );
}

const InsertMessageInfo = ({ room }) => {
  const type = room?.type?.type;

  if (!room) return <>상담 주제를 선택해주세요!</>;
  return (
    <InfoContainer>
      <span style={{ fontWeight: 'bold', color: '#40ae6c' }}>{type}</span> 요청이 접수되었습니다
      <br />
      <br />
      {type === '의사 상담'
        ? '의료 전문가가 곧 연락드릴 예정입니다'
        : '현재 관리자의 승인을 기다리고 있습니다'}
      <br />
      <br />
      상담을 위해 {type === '의사 상담' ? '증상이나 병력에 대해 ' : '필요한 정보를 '}
      미리 정리해주시면 <br />
      상담이 더 원활하게 진행될 수 있습니다
    </InfoContainer>
  );
};

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #E2E2E2;
  margin-top: 2px;
  padding: 10px;
  width: 70%;
  border-radius: 10px;
  order: 2;
`;

const InfoContainer = styled.div`
  font-size: 1rem;
  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`;

export default InsertMessage;
