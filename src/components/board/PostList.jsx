import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Btn, TextF } from '../../components/global/CustomComponents';

function PostList({ posts = [], boardId }) {
  const userRole = localStorage.getItem('userRole');
  return (
      
    <Box sx={{ width: '100%' }}>
      {posts.length > 0 ? (
        <List>
          {posts.map((post) => (
            <ListItem
              key={post.id}
              button
              component={RouterLink}
              to={`/posts/${post.id}`}
              sx={{ borderBottom: '1px solid #ddd', padding: 2 }}
            >
              <ListItemText
                primary={post.title || 'No Title'}
                secondary={`작성자: ${post.userName || 'Unknown User'} | 작성일: ${post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString()
                  : (post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : 'Unknown Date')} | 조회수: ${post.viewCount || 0} | 추천수: ${post.likeCount || 0}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          게시글이 존재하지 않습니다.
        </Typography>
      )}
    </Box>
  );
}

export default PostList;