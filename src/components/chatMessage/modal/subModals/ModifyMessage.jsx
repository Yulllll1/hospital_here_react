import { Box, Button, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { stompState } from '../../../../utils/atom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

function ModifyMessage({ msgId, msg, setOpens }) {
  const [stomp] = useRecoilState(stompState);

  const [message, setMessage] = useState(msg);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setOpens(false);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const modify = async e => {
    stomp.sendMessage(msgId, message);
  };

  const handleModifyClick = () => {
    if (message === msg) {
      alert('변경사항이 없습니다');
      return;
    }

    if (!message) {
      alert('공백 메시지는 불가능합니다');
      return;
    }

    const isConfirmed = window.confirm('수정 하시겠습니까?');
    if (!isConfirmed) {
      return;
    }

    modify();
    setOpens(false);
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
        메시지 수정
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: '70%' }}>
          <div>
            <TextField
              required
              id='outlined-required'
              label='Required'
              defaultValue={msg.replace(/\\n/g, ' ')}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <Button
            variant='contained'
            sx={{
              marginTop: '15px',
              backgroundColor: 'var(--main-common)',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'var(--main-deep)'
              }
            }}
            onClick={handleModifyClick}
          >
            수정하기
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default ModifyMessage;
