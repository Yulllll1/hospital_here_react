import styled from 'styled-components';
import profileDefaultImage from '../../assets/user-profile-default.png';
import adminDefaultImage from '../../assets/admin-profile-default.png';
import { useState } from 'react';
import DoctorProfile from '../DoctorSimpleProfile';
import { Box, Modal } from '@mui/material';

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

function ProfileImage(props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageClick = () => {
    if (props.user) setOpen(true);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: '50%', maxWidth: '600px' }}>
          <DoctorProfile imgUrl={props.url} user={props.user} />
        </Box>
      </Modal>
      <Image
        insert={props.insert}
        url={props.user?.image}
        size={props.size}
        user={props.user}
        onClick={handleImageClick}
      />
    </>
  );
}

const Image = styled.div`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  border: 1px solid black;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: ${({ self }) => (!self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '10px' : '0px')};
  background-image: ${({ insert, url }) =>
    insert === true
      ? `url(${adminDefaultImage})`
      : url
        ? `url(${url})`
        : `url(${profileDefaultImage})`};
  &:hover {
    cursor: ${({ user }) => (user ? 'pointer' : null)};
    border: ${({ user }) => (user ? '3px solid red' : null)};
  }
`;

export default ProfileImage;
