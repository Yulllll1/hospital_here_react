import styled from 'styled-components';
import { Box } from '@mui/material';

export const CustomScrollBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '100%', 
  position: 'relative',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  '&::-webkit-scrollbar': {
    width: '5px',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0',
    transition: 'background-color 0.3s',
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: '#f1f1f1',
  },
  '&:hover::-webkit-scrollbar': {
    opacity: 1,
  },
}));
