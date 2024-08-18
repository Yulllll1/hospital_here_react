import { Button } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import { stompState } from '../../../../utils/atom';

function RemoveMessage({ msgId }) {
  const [stomp] = useRecoilState(stompState);

  const remove = async () => {
    stomp.sendMessage(msgId, null);
  };

  const handleClick = () => {
    const isConfirmed = window.confirm('선택한 메시지를 삭제하시겠습니까?');
    if (!isConfirmed) return;

    remove();
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
        메시지 삭제
      </Button>
    </>
  );
}

export default RemoveMessage;
