import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';


function Footer() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  
  //각 아이콘 누를 때 각 page로 navigate
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
      <Box sx={{ width: '100%' }}>
        <StyledFooterBar value={value} onChange={handleChange}>
          <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Community"
            value="community"
            icon={<TextSnippetOutlinedIcon />}
          />
          <BottomNavigationAction
            label="Chat"
            value="chat"
            icon={<SmsOutlinedIcon />}
          />
          <BottomNavigationAction 
            label="My" 
            value="my" 
            icon={<PersonOutlineOutlinedIcon />} />
        </StyledFooterBar>
      </Box>
  );
};

const StyledFooterBar = styled(BottomNavigation)`
  height: 8vh;
  text-align: center;
  background-color: skyblue;
`;

export default Footer;
