import React, { useEffect, useRef, useState } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import styled from 'styled-components';
import ChatRoomDetail from '../../components/chatRoom/ChatRoomDetail';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useNavigate } from 'react-router';

function ChatListPage() {
  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([
    '상담 진행 목록',
    ...(auth.role !== 'USER' ? ['상담 수락 대기 목록'] : []),
    ...(auth.role === 'ADMIN' ? ['전체 상담 목록'] : [])
  ]);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(chatRoom.selectedIndex);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setChatRoom(m => ({ ...m, selectedIndex: index }));
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const fetchData = async () => {
    setError(false);
    setData([]);
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${selectedIndex === 2 ? '/admin' : ''}/chatrooms${selectedIndex === 1 ? '/wait' : ''}`,
        {
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
        alert('잘못된 접근입니다. 다시 시도해주세요');
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedIndex]);

  return (
    <MainContainer>
      <Wrapper>
        <ButtonGroup
          sx={{ width: '28%' }}
          variant='contained'
          ref={anchorRef}
          aria-label='Button group with a nested menu'
        >
          <Button
            onClick={() => navigate('/chat/new')}
            sx={{
              width: '100%',
              fontSize: '1.2rem',
              '@media (max-width: 600px)': {
                fontSize: '0.8rem'
              }
            }}
          >
            새로운 상담
          </Button>
        </ButtonGroup>
        <ButtonGroup
          sx={{ width: '70%' }}
          variant='contained'
          ref={anchorRef}
          aria-label='Button group with a nested menu'
        >
          <Button
            sx={{
              width: '100%',
              fontSize: '1.2rem',
              '@media (max-width: 600px)': {
                fontSize: '0.8rem'
              }
            }}
          >
            {options[selectedIndex]}
          </Button>
          <Button
            sx={{ width: '5%' }}
            size='large'
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label='select merge strategy'
            aria-haspopup='menu'
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>

        <Popper
          sx={{
            zIndex: 1
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id='split-button-menu' autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Wrapper>
      <div style={{ height: '78dvh', overflowY: 'scroll' }}>
        {error && <Notice>{error}</Notice>}
        {isLoading && <Notice>로딩 중 입니다..</Notice>}
        {data &&
          data.map(e => <ChatRoomDetail key={e.id} data={e} selectedIndex={selectedIndex} />)}
      </div>
    </MainContainer>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 95%;
  margin: 10px auto 0;
`;

const Notice = styled.div`
  text-align: center;
  font-size: 2rem;
  height: 50dvh;
  line-height: 50dvh;
`;

export default ChatListPage;
