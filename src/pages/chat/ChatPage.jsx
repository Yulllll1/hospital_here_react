import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MainContainer from '../../components/global/MainContainer';
import Message from '../../components/chatMessage/Message';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ChatInput from '../../components/chatMessage/ChatInput';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import { Button } from '@mui/material';

const fetchData = async (id, setChatRoom, setError) => {
  try {
    const response = await axiosInstance.get(`/chatmessages`, {
      params: {
        chatRoomId: id
      }
    });
    setChatRoom(m => ({ ...m, messages: response.data }));
  } catch (err) {
    setError(err.response.message);
    alert('잘못된 접근입니다');
  }
};

function ChatPage() {
  const params = useParams();

  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  const navigate = useNavigate();

  const tmp = useRef(null);

  const acceptChatRoom = async () => {
    const confirmed = window.confirm('채팅을 수락하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await axiosInstance.post(
        `/chatrooms/${Number(params.chatRoomId)}/users/${auth.userId}`
      );
      setChatRoom(m => ({
        ...m,
        rooms: { ...m.rooms, [`ch_${response.data.id}`]: response.data }
      }));
      navigate(`/chat/${params.chatRoomId}/messages`, {
        replace: true
      });
    } catch (err) {
      alert(err);
    }
  };

  const sendMessage = input => {
    const body = JSON.stringify({
      userId: Number(auth.userId),
      chatRoomId: Number(params.chatRoomId),
      content: input.replace(/\n/g, '\\n')
    });
    stompClient.publish({ destination: `/app/chat/${Number(params.chatRoomId)}`, body });
  };

  useEffect(() => {
    try {
      fetchData(params.chatRoomId, setChatRoom, setError);
    } catch (err) {
      alert('잘못된 접근입니다');
    }

    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);

    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      stomp.subscribe(`/queue/${Number(params.chatRoomId)}`, msg => {
        const data = JSON.parse(msg.body);
        data.content = data.content.replace(/\\n/g, '\n');
        setChatRoom(m => ({ ...m, messages: [...m.messages, data] }));
      });
    });

    stomp.activate();
    setStompClient(stomp);

    return () => stomp.deactivate();
  }, []);

  useEffect(() => {
    if (tmp != null) tmp.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatRoom.messages]);

  return (
    <MainContainer isChat={true} sendMessage={sendMessage}>
      <div style={{ height: '3dvh' }} />
      {error && <div>{error}</div>}
      {chatRoom.messages &&
        chatRoom.messages.map((e, idx) => {
          return e.user.id === Number(auth.userId) ? (
            <Message
              key={e.id}
              self={true}
              data={e}
              repeat={
                e.user.id ===
                (chatRoom.messages[idx - 1] ? chatRoom.messages[idx - 1].user.id : '0')
              }
            />
          ) : (
            <Message
              key={e.id}
              self={false}
              data={e}
              repeat={
                e.user.id ===
                (chatRoom.messages[idx - 1] ? chatRoom.messages[idx - 1].user.id : '0')
              }
            />
          );
        })}
      {chatRoom.rooms[`ch_${params.chatRoomId}`].status.status === '수락 대기' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '20dvh',
            margin: 'auto'
          }}
        >
          <div
            style={{
              height: '40%',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              lineHeight: '10dvh',
              textAlign: 'center'
            }}
          >
            매칭을 기다리고 있습니다
          </div>
          {auth.role !== 'USER' && (
            <Button
              type='SERVICE'
              variant='contained'
              style={{ width: '50%', marginBottom: '4px' }}
              onClick={acceptChatRoom}
            >
              채팅 수락
            </Button>
          )}
        </div>
      )}
      <div ref={tmp} />
      <ChatInput
        sendMessage={sendMessage}
        enable={
          (chatRoom.rooms[`ch_${params.chatRoomId}`].user1.id === auth.userId ||
            chatRoom.rooms[`ch_${params.chatRoomId}`]?.user2?.id === auth.userId) &&
          chatRoom.rooms[`ch_${params.chatRoomId}`].status.status !== '비활성화'
        }
      />
    </MainContainer>
  );
}

export default ChatPage;
