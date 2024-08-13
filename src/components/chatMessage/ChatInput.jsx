import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AdvancedModal from '../chatRoom/modal/AdvancedModal';
import { useRecoilState } from 'recoil';
import { stompState } from '../../utils/atom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '50dvh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function ChatInput({ sendMessage, enable }) {
  const [stomp] = useRecoilState(stompState);

  const [input, setInput] = useState(enable ? '' : '입력할 수 없습니다');

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (enable) {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const button = useRef(null);

  const handleInput = e => {
    if (!enable) return;

    if (!e.nativeEvent.isComposing)
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        button.current.click();
      }
  };

  const handleClick = () => {
    if (!enable) return;

    if (/^\s*$/.test(input)) {
      alert('공백 메시지는 전송이 불가능합니다');
      setInput('');
      return;
    }

    stomp.sendMessage(null, input);
    setInput('');
  };

  useEffect(() => {
    setInput(enable ? '' : '입력할 수 없습니다');
  }, [enable]);

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={style}>
          <h2 id='parent-modal-title'>추가 기능</h2>
          <AdvancedModal sendMessage={sendMessage} setOpens={setOpen} />
        </Box>
      </Modal>
      <Button
        variant='contained'
        sx={{ width: '5%', backgroundColor: '#cac9c9', fontSize: '2rem', color: 'black' }}
        onClick={handleOpen}
      >
        +
      </Button>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleInput}
        readOnly={!enable}
      />
      <Button variant='contained' ref={button} onClick={handleClick} sx={{ width: '3%' }}>
        전송
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 8dvh;
  box-sizing: border-box;
  padding: 4px;
  max-width: 60dvh;
  width: 100%;
  height: 8dvh;
  padding: 5px;
  background-color: #cac9c9;
`;

const Input = styled.textarea`
  outline: 1px solid;
  width: 80%;
  border-radius: 10px;
  background-color: #e8e0e0;
  padding: 1rem 15px;
  font-size: 1.8rem;
  resize: none;
  white-space: pre-line;
  @media (max-width: 481px) {
    font-size: 1.5rem;
    line-height: 3dvh;
  }
`;

export default ChatInput;
