import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function BoardForm({ initialValues = {}, onSubmit }) {
  const [name, setName] = useState(initialValues.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" gutterBottom>
          {initialValues.id ? 'Update Board' : 'Create Board'}
        </Typography>
        <TextField
          label="Board Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          {initialValues.id ? 'Update Board' : 'Create Board'}
        </Button>
      </Box>
    </Container>
  );
}

export default BoardForm;
