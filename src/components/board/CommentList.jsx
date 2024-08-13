import React, { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, IconButton, Card, CardContent, CardActions, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Reply as ReplyIcon } from '@mui/icons-material';
import ReplyList from './ReplyList';

function CommentList({ comments = [], onDelete, onUpdate, onReply }) {
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditContent(comment.content || '');
  };

  const handleUpdate = () => {
    onUpdate(editCommentId, editContent);
    setEditCommentId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditContent('');
  };

  const handleReplyClick = (comment) => {
    setReplyCommentId(comment.id);
    setReplyContent('');
  };

  const handleReply = () => {
    onReply(replyCommentId, replyContent);
    setReplyCommentId(null);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyCommentId(null);
    setReplyContent('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <List>
        {comments.map(comment => (
          <ListItem key={comment.id} sx={{ mb: 2 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  {editCommentId === comment.id ? (
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
                      <Typography variant="subtitle1" gutterBottom>
                        {comment.userName || 'Unknown User'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {comment.content || 'No content'}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                        {comment.updatedAt
                          ? new Date(comment.updatedAt).toLocaleString()
                          : (comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : 'Unknown date')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
              <CardActions>
                {editCommentId !== comment.id && (
                  <>
                    <IconButton onClick={() => handleEditClick(comment)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(comment.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    {comment.parentId === null && (
                      <IconButton onClick={() => handleReplyClick(comment)} color="info">
                        <ReplyIcon />
                      </IconButton>
                    )}
                  </>
                )}
              </CardActions>
              {replyCommentId === comment.id && (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <TextField
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    placeholder="Add a reply..."
                  />
                  <Button onClick={handleReply} variant="contained" color="primary" sx={{ mr: 1 }}>
                    Add Reply
                  </Button>
                  <Button onClick={handleCancelReply} variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Box>
              )}
              {(comment.replies && comment.replies.length > 0) && (
                <ReplyList
                  replies={comment.replies}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onReply={onReply}
                  parentId={comment.id}
                />
              )}
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CommentList;
