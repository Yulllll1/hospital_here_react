import React, { useEffect, useRef, useState } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import styled from 'styled-components';
import ChatRoomDetail from '../../components/chatRoom/ChatRoomDetail';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router';
import { Loading } from '../../components/Loading';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function ChatListPage() {
  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options] = useState([
    '상담 진행 목록',
    ...(auth.role !== 'USER' ? ['상담 수락 대기 목록'] : []),
    ...(auth.role === 'ADMIN' ? ['전체 상담 목록'] : [])
  ]);

  const [selectedIndex, setSelectedIndex] = useState(chatRoom.selectedIndex);

  const handleSelectChange = event => {
    const index = options.indexOf(event.target.value);
    setSelectedIndex(index);
    setChatRoom(m => ({ ...m, selectedIndex: index }));
  };

  const fetchData = async () => {
    setError(false);
    setData([]);
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.get(
        `${selectedIndex === 2 ? '/admin' : ''}/chatrooms${selectedIndex === 1 ? '/wait' : ''}`,
        {
          headers: {
            Authorization: `${token}`
          },
          params: {
            userId: auth.userId || 0
          }
        }
      );
      const chatRooms = {};
      response.data.forEach(e => {
        const room = {
          ...e,
          lastMessage: e.lastMessage
            ? {
                ...e.lastMessage,
                content: e.lastMessage.content.replace(/\\n/g, ' ')
              }
            : null
        };
        chatRooms[`ch_${e.id}`] = room;
      });
      setChatRoom(m => ({ ...m, rooms: chatRooms }));
      setData(
        Object.values(chatRooms).sort((a, b) => {
          if (a.status.status === '진행') return -1;
          return 1;
        })
      );
    } catch (err) {
      try {
        setError(err.response.data.message);
      } catch (err) {
        alert('잘못된 접근입니다');
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);
    const stomp = Stomp.over(socket);

    stomp.connect({}, frame => {
      setIsLoading(false);

      stomp.subscribe(`/queue/list/${auth.userId}`, msg => {
        const data = JSON.parse(msg.body);

        setChatRoom(m => ({ ...m, rooms: { ...m.rooms, [`ch_${data.id}`]: data } }));
        setData(e => e.map(m => (m.id === data.id ? data : m)));
      });

      stomp.subscribe(`/queue/list/${auth.role}`, msg => {
        const data = JSON.parse(msg.body);

        setChatRoom(m => ({ ...m, rooms: { ...m.rooms, [`ch_${data.id}`]: data } }));
        setData(e => e.map(m => (m.id === data.id ? data : m)));
      });
    });

    stomp.activate();

    return () => stomp.deactivate();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedIndex]);

  return (
    <MainContainer>
      <Loading open={isLoading} tmp={chatRoom} />
      <HeaderWrapper>
        <Select
          value={options[selectedIndex]}
          onChange={handleSelectChange}
          sx={{
            minWidth: 200,
            fontSize: '1rem',
            marginRight: '10px'
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          sx={{
            backgroundColor: 'var(--main-common)',
            '&:hover': {
              backgroundColor: 'var(--main-deep)'
            },
            marginRight: '30px'
          }}
          onClick={() => navigate('/chat/new')}
        >
          <AddIcon sx={{ color: '#fff' }} />
        </IconButton>
      </HeaderWrapper>
      <div style={{ height: '78dvh' }}>
        {error && <Notice>{error}</Notice>}
        {data &&
          data.map(e => <ChatRoomDetail key={e.id} data={e} selectedIndex={selectedIndex} />)}
      </div>
    </MainContainer>
  );
}

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 95%;
  margin: 10px auto;
`;

const Notice = styled.div`
  text-align: center;
  font-size: 2rem;
  height: 50dvh;
  line-height: 50dvh;
`;

export default ChatListPage;
