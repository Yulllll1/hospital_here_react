import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/axios';
import { Box, TextField, Typography, List, ListItem, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import ReplyList from './ReplyList';
import { Btn } from '../../components/global/CustomComponents';

function CommentList({ comments = [], onDelete, onUpdate, onReply }) {
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCommentId, setMenuCommentId] = useState(null);
  const [commentsWithImages, setCommentsWithImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const updatedComments = await Promise.all(comments.map(async (comment) => {
        try {
          const response = await axiosInstance.get(`/users/${comment.userId}/img`);
          return { ...comment, userImg: response.data };
        } catch (error) {
          console.error("Error fetching user image:", error);
          return comment;
        }
      }));
      setCommentsWithImages(updatedComments);
    };

    fetchImages();
  }, [comments]);

  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditContent(comment.content || '');
    setAnchorEl(null);
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

  const handleMenuClick = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setMenuCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCommentId(null);
  };

  const handleDelete = () => {
    onDelete(menuCommentId);
    handleMenuClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {commentsWithImages.map((comment) => (
          <ListItem key={comment.id} sx={{ mb: 2, p: 0 }}>
            <Box sx={{ width: '100%', p: 2, bgcolor: '#fff', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {comment.userImg ? (
                  <img
                    src={comment.userImg}
                    alt="Profile"
                    style={{
                      backgroundColor: '#E9E9E9',
                      width: '35px',
                      height: '35px',
                      padding: '5px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      backgroundColor: '#E9E9E9',
                      width: '35px',
                      height: '35px',
                      padding: '5px',
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  />
                )}
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
                      <Box sx={{ display: 'flex' }}>
                        <Btn onClick={handleUpdate} sx={{ mr: 1, width: '15px' }}>
                          수정
                        </Btn>
                        <Btn onClick={handleCancelEdit} sx={{ width: '15px' }}>
                          취소
                        </Btn>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {comment.userName || '알 수 없는 사용자'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {comment.content || '내용 없음'}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                        {comment.updatedAt
                          ? new Date(comment.updatedAt).toLocaleString()
                          : comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : '알 수 없는 날짜'}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <IconButton
                  onClick={(event) => handleMenuClick(event, comment.id)}
                  color="default"
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              {editCommentId !== comment.id && comment.parentId === null && (
                <Box sx={{ textAlign: 'right' }}>
                  <Btn onClick={() => handleReplyClick(comment)} sx={{ width: '15px' }}>
                    답글
                  </Btn>
                </Box>
              )}
              {replyCommentId === comment.id && (
                <Box sx={{ mt: 2, bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  <TextField
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    placeholder="답글을 남기세요..."
                  />
                  <Box sx={{ display: 'flex' }}>
                    <Btn onClick={handleReply} sx={{ mr: 1, width: '15px' }}>
                      작성
                    </Btn>
                    <Btn onClick={handleCancelReply} sx={{ width: '15px' }}>
                      취소
                    </Btn>
                  </Box>
                </Box>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <ReplyList
                  replies={comment.replies}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onReply={onReply}
                  parentId={comment.id}
                />
              )}
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open && menuCommentId === comment.id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleEditClick(comment)}>수정</MenuItem>
              <MenuItem onClick={handleDelete}>삭제</MenuItem>
            </Menu>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CommentList;
