import React from 'react';
import ModifyMessage from './subModals/ModifyMessage';
import RemoveMessage from './subModals/RemoveMessage';
import DepartmentSuggestion from '../../chatRoom/modal/subModals/DepartmentSuggestion';

function EditModal({ msgId, msg, setOpens, isDpt }) {
  return (
    <React.Fragment>
      <RemoveMessage msgId={msgId} />
      {isDpt ? (
        <DepartmentSuggestion
          text={'제공 정보 수정'}
          defaultValue={msg.replace('dpt: ', '')}
          msgId={msgId}
          setOpens={setOpens}
        />
      ) : (
        <ModifyMessage msgId={msgId} msg={msg} setOpens={setOpens} />
      )}
    </React.Fragment>
  );
}

export default EditModal;
