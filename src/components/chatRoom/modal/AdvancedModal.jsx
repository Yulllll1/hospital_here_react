import React, { useEffect, useState } from 'react';
import DepartmentSuggestion from './subModals/DepartmentSuggestion';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../../utils/atom';
import ExitChatRoom from './subModals/ExitChatRoom';

function AdvancedModal({ sendMessage, setOpens }) {
  const [auth] = useRecoilState(userauthState);

  return (
    <React.Fragment>
      {auth.role === 'DOCTOR' && (
        <DepartmentSuggestion sendMessage={sendMessage} setOpens={setOpens} defaultValue={''} />
      )}
      <ExitChatRoom />
    </React.Fragment>
  );
}

export default AdvancedModal;
