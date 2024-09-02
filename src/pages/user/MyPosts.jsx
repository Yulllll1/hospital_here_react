import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, IconButton } from "@mui/material";
import { axiosInstance } from '../../utils/axios';
import MainContainer from "../../components/global/MainContainer";
import { Loading } from "../../components/Loading";
import { ArrowRightIcon } from "@mui/x-date-pickers-pro";
import { useNavigate } from "react-router";

export const MyPosts = () => {

  const [postList, setPostList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/users/my-page/post', {
          headers: {
            Authorization: `${token}`
          }
        });
        setPostList(response.data);
      } catch (exception) {
        console.log(exception);
      }
    };
    getPosts();
  }, []);

  const OnClickPostButton = (id) => {
    navigate(`/posts/${id}`);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const PostComponent = () => {
    return postList.map((post) => (
      <Box
        key={post.id}
        sx={{
          height: 'auto',
          padding: '15px',
          margin: '15px 0',
          border: '1px solid var(--paper-soft)',
          borderRadius: '10px',
          backgroundColor: 'var(--paper-soft)',
          borderColor: "rgba(0, 0, 0, 0.12)",
          '&:hover': {
            backgroundColor: 'var(--paper-deep)',
          },
        }}
      >
        <IconButton
          sx={{
            float: 'right',
            margin: '5px 0',
          }}
          onClick={() => OnClickPostButton(post.id)}
        >
          <ArrowRightIcon fontSize="large" />
        </IconButton>
        <Typography variant='h6' sx={{ marginBottom: '5px', color: 'var(--main-common)' }}>
          {post.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E6E6E' }}>
          {formatDate(post.createdAt)}
        </Typography>
      </Box>
    ));
  };

  return (
    <MainContainer>
      <Paper
        elevation={0}
        sx={{
          margin: "10px",
          padding: 3,
          borderRadius: "10px",
          minHeight: '-webkit-fill-available',
          height: 'fit-content'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'inline', color: 'var(--main-common)' }}>
          내가 쓴 글
        </Typography>
        <Box sx={{ margin: "20px 0", borderBottom: "1px solid var(--main-common)" }}></Box>
        {postList ? (
          postList.length > 0 ? (
            <PostComponent />
          ) : (
            <Typography variant="body1" sx={{ color: 'var(--main-common)', textAlign: 'center', marginTop: 3 }}>
              작성한 게시글이 없습니다.
            </Typography>
          )
        ) : (
          <Loading />
        )}
      </Paper>
    </MainContainer>
  );
};
