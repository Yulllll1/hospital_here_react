import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Btn } from '../../components/global/CustomComponents';

function BoardList({ boards = [] }) {
  const userRole = localStorage.getItem('userRole');

  return (
    <Box sx={{ width: '100%' }}>
      {boards.length > 0 ? (
        <List>
          {boards.map((board) => (
            <ListItem
              key={board.id}
              button
              component={Link}
              to={`/boards/${board.id}`}
              sx={{ borderBottom: '1px solid #ddd' }}
            >
              <ListItemIcon>
                <img src='/images/Contract.png' alt="icon" style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary={board.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          게시판이 없습니다.
        </Typography>
      )}
            {userRole === 'ADMIN' && (
        <Btn
          component={Link}
          to="/boards/create"
          sx={{ marginTop: 2, marginLeft: 'auto' }}
        >
          게시판 생성
        </Btn>
      )}
    </Box>
  );
}

export default BoardList;
