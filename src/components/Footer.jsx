import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const pathnameToLabel = pathname => {
  switch (pathname) {
    case '/':
      return 'home';
    case '/boards':
      return 'community';
    case '/chatlist':
      return 'chat';
    default:
      return 'my';
  }
};

function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //각 아이콘 누를 때 각 page로 navigate
  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 'home':
        navigate('/');
        break;
      case 'community':
        navigate('/boards');
        break;
      case 'chat':
        navigate('/chatlist');
        break;
      case 'my':
        navigate('/my-page');
        break;
      default:
        navigate('/home');
    }
  };

  return (
    <StyledFooterBar value={pathnameToLabel(pathname)} onChange={handleChange}>
      <BottomNavigationAction label='Home' value='home' sx={actionStyle} icon={<HomeIcon />} />
      <BottomNavigationAction
        label='Community'
        value='community'
        sx={actionStyle}
        icon={<TextSnippetOutlinedIcon />}
      />
      <BottomNavigationAction
        label='Chat'
        value='chat'
        sx={actionStyle}
        icon={<SmsOutlinedIcon />}
      />
      <BottomNavigationAction
        label='My'
        value='my'
        sx={actionStyle}
        icon={<PersonOutlineOutlinedIcon color='red' />}
      />
    </StyledFooterBar>
  );
}

const StyledFooterBar = styled(BottomNavigation)`
  height: 8dvh;
  text-align: center;
  background-color: skyblue;
  border-top: 1px solid #e9e9e9;
`;

const actionStyle = {
  '&.Mui-selected': {
    transition: 'paddsing-top 0.5s',
    color: 'var(--main-deep)'
  },
  '&:hover': {
    padding: '0 12px',
    '.MuiBottomNavigationAction-label': {
      fontSize: '0.875rem',
      opacity: 1
    }
  }
};

export default Footer;
