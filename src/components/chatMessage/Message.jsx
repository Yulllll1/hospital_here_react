import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import styled from 'styled-components';
import { fromatDate, isToday } from '../../utils/time';
import { Box, Modal } from '@mui/material';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../utils/atom';
import EditModal from './modal/EditModal';
import { useNavigate } from 'react-router';
import { Btn } from '../global/CustomComponents';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '50dvh',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function Message({ data, repeat, self }) {
  const [auth] = useRecoilState(userauthState);

  const [dptBtnHovered, setDtpBtnHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (auth.userId !== Number(data.user.id) || dptBtnHovered) return;
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  const messageTime = () => {
    let date = fromatDate(new Date(data.createdAt));

    // 오늘이면 시간만 추출
    if (isToday(new Date(data.createdAt))) {
      date = date.split(' ')[1];
    }

    return date;
  };

  const requestHospital = async e => {
    const isConfirmed = window.confirm('결과 페이지로 이동합니다');
    if (!isConfirmed) {
      return;
    }

    navigate('/hospitals/maps', {
      state: {
        departments: [e.target.innerText]
      }
    });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={style}>
          <h2 id='parent-modal-title'>메시지 옵션</h2>
          <p style={{ color: '#22a1d3', fontWeight: 'bold', fontStyle: 'italic' }}>
            {data.content.replace(/\\n/g, ' ').replace('dpt: ', '제공 진료과: ')}
          </p>
          <EditModal
            msgId={data.id}
            msg={data.content}
            setOpens={setOpen}
            isDpt={data.content.startsWith('dpt: ') ? true : undefined}
          />
        </Box>
      </Modal>
      <Container self={self}>
        {self || (
          <TopContainer repeat={repeat ? repeat : undefined} self={self}>
            {repeat || (
              <ProfileImage
                user={data.user}
                insert={false}
                self={self}
                size={'3rem'}
                doctorProfile={data.doctorProfile}
              />
            )}
            {repeat || <Author self={self}>{data.user.name}</Author>}
          </TopContainer>
        )}
        <BottomContainer self={self}>
          <Content self={self} onClick={handleOpen}>
            {data.content.startsWith('dpt: ') && data.user.role === 'DOCTOR' ? (
              <Suggestion>
                <p>진료과 추천 정보가 제공되었습니다</p>
                <Btn
                  onClick={requestHospital}
                  sx={{ width: '80%' }}
                  onMouseEnter={() => setDtpBtnHovered(true)}
                  onMouseLeave={() => setDtpBtnHovered(false)}
                >
                  {data.content.split(' ')[1]}
                </Btn>
              </Suggestion>
            ) : (
              data.content.split('\\n').map(e => (
                <span>
                  {e}
                  <br />
                </span>
              ))
            )}
          </Content>
          <Time self={self}>{messageTime()}</Time>
        </BottomContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: 'center';
  margin-bottom: 5px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
  max-width: 100%;
  margin-left: ${({ repeat }) => (repeat ? '3.6rem' : '0.5rem')};
  margin-bottom: 10px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  height: 100%;
  margin-right: ${({ self }) => (self ? '5px' : '3rem')};
  margin-left: ${({ self }) => (self ? '0px' : '3rem')};
  @media (min-width: 481px) {
    font-size: 2rem;
    line-height: 3dvh;
  }
`;

const Author = styled.p`
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '0px' : '10px')};
  margin-top: auto;
  margin-bottom: auto;
  order: ${({ self }) => (self ? 1 : 2)};
  @media (min-width: 481px) {
    font-size: 1.4rem;
  }
`;

const Content = styled.div`
  background-color: ${({ self }) => (self ? 'var(--main-soft)' : 'var(--paper-soft)')};
  padding: 10px;
  border-radius: 10px;
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  order: ${({ self }) => (self ? 2 : 1)};
  white-space: pre-line;
  max-width: 70%;
  height: auto;
  overflow: hidden;
  @media (min-width: 490px) {
    font-size: 1.2rem;
  }
`;

const Suggestion = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  @media (max-width: 500px) {
    font-size: 0.9rem;
  }
`;

const Time = styled.p`
  order: ${({ self }) => (self ? 1 : 2)};
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '0px' : '10px')};
  @media (min-width: 490px) {
    font-size: 1.2rem;
  }
`;

export default Message;
