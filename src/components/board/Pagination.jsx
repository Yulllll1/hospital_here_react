import React from 'react';
import { Container, Pagination } from '@mui/material';

function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={(event, page) => onPageChange(page - 1)}
        size="small"
      />
    </Container>
  );
}

export default PaginationComponent;
