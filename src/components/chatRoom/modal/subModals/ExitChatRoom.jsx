import { Button } from '@mui/material';
import React from 'react';
import { axiosInstance } from '../../../../utils/axios';
import { useNavigate, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { chatRoomState, stompState, userauthState } from '../../../../utils/atom';

function ExitChatRoom() {
  const params = useParams();

  const [auth] = useRecoilState(userauthState);
  const [stomp] = useRecoilState(stompState);
  const [chatRoom] = useRecoilState(chatRoomState);

  const navigate = useNavigate();

  const exit = async () => {
    try {
      await axiosInstance.delete(`/chatrooms/${params.chatRoomId}/users/${auth.userId}`);
      if (chatRoom.rooms[`ch_${params.chatRoomId}`].status.status === '진행') {
        stomp.sendMessage(params.chatRoomId, null, false, true);
      }
      navigate('/chatlist');
    } catch (err) {
      try {
        alert(err.response.data.message);
      } catch (err) {
        alert('잘못된 접근입니다. 다시 시도해주세요');
      }
    }
  };

  const handleClick = () => {
    const isConfirmed = window.confirm('해당 채팅방에서 나가시겠습니까?');
    if (!isConfirmed) return;

    exit();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          color: 'var(--main-deep)',
          fontWeight: 'bold'
        }}
      >
        채팅방 나가기
      </Button>
    </>
  );
}

export default ExitChatRoom;
