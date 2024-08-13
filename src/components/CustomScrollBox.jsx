import styled from 'styled-components';
import { Box } from '@mui/material';

export const CustomScrollBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'hidden', // X축 스크롤을 숨깁니다
  height: '100%', // CustomScrollBox의 높이를 100%로 설정
  position: 'relative', // 레이아웃 문제를 방지하기 위해 상대 위치 설정
  margin: 0,
  padding: 0,
  boxSizing: 'border-box', // padding과 border를 height에 포함시키기 위해
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
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s',
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: '#f1f1f1',
  },
  '&:hover::-webkit-scrollbar': {
    opacity: 1,
  },
}));
