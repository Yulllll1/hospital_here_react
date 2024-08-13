import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '../../components/global/MainContainer';
import Message from '../../components/chatMessage/Message';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ChatInput from '../../components/chatMessage/ChatInput';
import { useRecoilState } from 'recoil';
import { chatRoomState, stompState, userauthState } from '../../utils/atom';
import { Button, ButtonGroup } from '@mui/material';
import { Loading } from '../../components/Loading';
import InsertMessage from '../../components/chatMessage/InsertMessage';

const fetchData = async (id, setMessages, setError) => {
  try {
    const response = await axiosInstance.get(`/chat-messages`, {
      params: {
        chatRoomId: id
      }
    });
    setMessages(response.data);

    if (response.data.length !== 0) {
      axiosInstance.post('/chat-messages/status', {
        id: Number(response.data[response.data.length - 1].id)
      });
    }
  } catch (err) {
    try {
      setError(err.response.data.message);
    } catch (err) {
      console.log(err);
      alert('잘못된 접근입니다. 다시 시도해주세요');
    }
  }
};

function ChatPage() {
  const params = useParams();

  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);
  const [stomp, setStomp] = useRecoilState(stompState);

  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const tmp = useRef(null);

  const acceptChatRoom = async () => {
    const confirmed = window.confirm('채팅을 수락하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await axiosInstance.post(
        `/chatrooms/${Number(params.chatRoomId)}/users/${auth.userId}`
      );
      stomp.sendMessage(Number(params.chatRoomId), null, true);
      setChatRoom(m => ({
        ...m,
        rooms: { ...m.rooms, [`ch_${response.data.id}`]: response.data }
      }));
      navigate(`/chat/${params.chatRoomId}/messages`, {
        replace: true
      });
    } catch (err) {
      try {
        alert(err.response.data.message);
      } catch (err) {
        console.log(err);
        alert('잘못된 접근입니다. 다시 시도해주세요');
        navigate('/');
      }
    }
  };

  const sendMessage = (id, input, isAccepted, isTerminated) => {
    const body = JSON.stringify({
      id: Number(id) || null,
      userId: Number(auth.userId),
      chatRoomId: Number(params.chatRoomId),
      content: input?.replace(/\n/g, '\\n') || null,
      isAccepted: isAccepted || false,
      isTerminated: isTerminated || false
    });
    stompClient.publish({ destination: `/app/chat/${Number(params.chatRoomId)}`, body });
  };

  useEffect(() => {
    try {
      fetchData(params.chatRoomId, setMessages, setError);
    } catch (err) {
      alert('잘못된 접근입니다');
    }

    if (chatRoom.rooms[`ch_${params.chatRoomId}`].status.status === '비활성화') {
      setLoading(false);
      return;
    }

    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);

    const stomp = Stomp.over(socket);

    stomp.connect({ Authorization: localStorage.getItem('token') }, frame => {
      setLoading(false);

      stomp.subscribe(`/queue/${Number(params.chatRoomId)}`, msg => {
        const data = JSON.parse(msg.body);

        // 채팅 수락 or 종료
        if (data.isAccepted || data.isTerminated) {
          setChatRoom(m => ({
            ...m,
            rooms: {
              ...m.rooms,
              [`ch_${data.id}`]: {
                ...m.rooms[`ch_${data.id}`],
                status: { status: data.isAccepted ? '진행' : '비활성화' }
              }
            }
          }));

          if (auth.userId !== data.userId) {
            if (data.isAccepted) {
              alert('상담 요청이 수락되어 채팅이 진행됩니다');
            }

            if (data.isTerminated) {
              alert('상대방이 퇴장하였습니다');
            }
          }
        } else {
          if (!data.content) {
            // 메시지 삭제
            setMessages(m => m.filter(e => e.id !== data.id));
          } else {
            data.content = data.content.replace(/\\n/g, '\n');

            // 메시지 추가 & 삭제
            setMessages(m => {
              let isModified = false;
              const newMessages = m.map(e => {
                if (e.id === data.id) {
                  e.content = data.content;
                  isModified = true;
                }
                return e;
              });

              if (!isModified) {
                newMessages.push(data);

                if (data.user.id !== auth.userId) {
                  axiosInstance.post('/chat-messages/status', { id: data.id });
                }
              }

              return newMessages;
            });
          }
        }
      });
    });

    stomp.activate();
    setStompClient(stomp);

    return () => stomp.deactivate();
  }, []);

  useEffect(() => {
    if (tmp != null) tmp.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (stompClient) {
      setStomp({ sendMessage: sendMessage });
    }
  }, [stompClient]);

  return (
    <MainContainer isChat={true} sendMessage={sendMessage}>
      <Loading open={loading} />
      <ButtonGroup
        sx={{ width: '100%', marginTop: '10px', boxShadow: 'none' }}
        variant='contained'
        aria-label='Button group with a nested menu'
      >
        <Button
          onClick={() => navigate('/chatlist')}
          sx={{ width: '95%', fontSize: '1.2rem', backgroundColor: '#4f90de', margin: 'auto' }}
        >
          목록으로 돌아가기
        </Button>
      </ButtonGroup>
      <div style={{ height: '1dvh' }} />
      <div style={{ overflowY: 'scroll', height: '72dvh' }}>
        {error && <div>{error}</div>}
        {chatRoom.rooms[`ch_${params.chatRoomId}`].status.status === '수락 대기' &&
          chatRoom.rooms[`ch_${params.chatRoomId}`].user1.id === auth.userId && <InsertMessage />}
        {messages &&
          messages.map((e, idx) => {
            return e.user.id === Number(auth.userId) ? (
              <Message
                key={e.id}
                self={true}
                data={e}
                repeat={e.user.id === (messages[idx - 1] ? messages[idx - 1].user.id : undefined)}
              />
            ) : (
              <Message
                key={e.id}
                self={false}
                data={e}
                repeat={e.user.id === (messages[idx - 1] ? messages[idx - 1].user.id : undefined)}
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
            {chatRoom.rooms[`ch_${params.chatRoomId}`].user1.id !== auth.userId && (
              <Button
                variant='contained'
                style={{ width: '50%', marginBottom: '4px' }}
                onClick={acceptChatRoom}
              >
                채팅 수락
              </Button>
            )}
          </div>
        )}
        <div ref={tmp} style={{ height: '5dvh' }} />
        <ChatInput
          sendMessage={sendMessage}
          enable={
            (chatRoom.rooms[`ch_${params.chatRoomId}`].user1.id === auth.userId ||
              chatRoom.rooms[`ch_${params.chatRoomId}`]?.user2?.id === auth.userId) &&
            chatRoom.rooms[`ch_${params.chatRoomId}`].status.status !== '비활성화'
          }
        />
      </div>
    </MainContainer>
  );
}

export default ChatPage;
