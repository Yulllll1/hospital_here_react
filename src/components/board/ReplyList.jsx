import React, { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, IconButton, Card, CardContent, CardActions, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function ReplyList({ replies = [], onDelete, onUpdate, onReply, parentId }) {
  const [editReplyId, setEditReplyId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const handleEditClick = (reply) => {
    setEditReplyId(reply?.id ?? null);
    setEditContent(reply?.content ?? '');
  };

  const handleUpdate = () => {
    if (editReplyId !== null) {
      onUpdate(editReplyId, editContent);
      setEditReplyId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditReplyId(null);
    setEditContent('');
  };

  const handleReply = () => {
    if (parentId) {
      onReply(parentId, replyContent);
      setReplyContent('');
    }
  };

  const handleCancelReply = () => {
    setReplyContent('');
  };

  return (
    <Box sx={{ ml: 4 }}>
      <List>
        {replies.map(reply => (
          <ListItem key={reply?.id} sx={{ mb: 2 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  {editReplyId === reply?.id ? (
                    <Box>
                      <TextField
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                      <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mr: 1 }}>
                        Update
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {reply?.userName || 'Anonymous'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {reply?.content || 'No content'}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                        {reply?.updatedAt
                          ? new Date(reply.updatedAt).toLocaleString()
                          : reply?.createdAt
                            ? new Date(reply.createdAt).toLocaleString()
                            : 'Unknown date'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
              <CardActions>
                {editReplyId !== reply?.id && (
                  <>
                    <IconButton onClick={() => handleEditClick(reply)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(reply?.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ReplyList;
