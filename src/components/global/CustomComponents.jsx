import React from 'react';
import { Box } from '@mui/material';
import { TextField, Button } from '@mui/material';
import { styled } from '@mui/system';


// StyledTextField 컴포넌트
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '40px',
    backgroundColor: '#E9E9E9', // 입력 필드 배경색 설정
    '& fieldset': {
      borderColor: '#E9E9E9', // 기본 테두리 색상
      borderWidth: '2px', // 테두리 두께
    },
    '&:hover fieldset': {
      borderColor: 'black', // hover 상태에서 테두리 색상 변경
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black', // 포커스 상태에서 테두리 색상 변경
    },
  },
  '& input': {
    color: 'black', // 텍스트 색상 설정
  },
  '& .MuiInputLabel-root': {
    color: '#000', // 기본 라벨 색상
  },
  '& label.Mui-focused': {
    color: '#4A885D', //포커스 시 라벨 색상
  },
}));

// TextF 컴포넌트
const TextF = (props) => {
  return <StyledTextField {...props} />;
};

// StyledButton 컴포넌트
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E9E9E9',
  color: '#000',
  width: '130px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '30px',
  '&:hover': {
    backgroundColor: '#E2E2E2',
  },
}));

const StyledButtonTwo = styled(Button)(({ theme }) => ({
    backgroundColor: 'var(--main-common)',
    color: 'white',
    width: '130px',
    height: '50px',
    px : 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '30px',
    '&:hover': {
      backgroundColor: 'var(--main-deep)',
    },
}));

// Btn 컴포넌트
const Btn = ({ ...props }) => {
  return <StyledButton  {...props}>{props.children}</StyledButton>;
};

const Btntwo = ({ ...props }) => {
    return <StyledButtonTwo {...props}>{props.children}</StyledButtonTwo>;
}

const SmallBtn = (props) => {
  return <StyledSmallButton {...props}>{props.children}</StyledSmallButton>;
};

const StyledSmallButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E9E9E9',
  color: '#000',
  width: '90px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '30px',
  '&:hover': {
    backgroundColor: '#E2E2E2',
  },
}));

// 컴포넌트 export
export { TextF, Btn, Btntwo, SmallBtn };
