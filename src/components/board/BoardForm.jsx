import React, { useState } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Btntwo, TextF } from '../../components/global/CustomComponents';

function BoardForm({ initialValues = {}, onSubmit }) {
  const [name, setName] = useState(initialValues.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center', // 수평 중앙 정렬
        alignItems: 'center',     // 수직 중앙 정렬
        height: '80dvh',          // 화면 전체 높이
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2, // 내부 여백 추가
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          {initialValues.id ? '게시판 수정' : '게시판 생성'}
        </Typography>
        <TextF
          label="Board Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Btntwo type="submit" sx={{ width: '100%', marginTop: 2 }}>
          {initialValues.id ? 'Update Board' : 'Create Board'}
        </Btntwo>
      </Box>
    </Container>
  );
}

export default BoardForm;
