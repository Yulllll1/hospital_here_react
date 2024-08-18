import React, { useState, useEffect } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { axiosInstance, fetchUserReviews, userInformation } from '../../utils/axios';
import MainContainer from "../../components/global/MainContainer";
import MyReviewCard from "../../components/MyReviewCard";

const MyReviews = () => {
  const [state, setState] = useState({
    reviews: [],
    editingReviewId: null,
    editedContent: "",
    editedRating: 0,
    username: ""
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userReviews = await fetchUserReviews(userId);
        const name = await userInformation(localStorage.getItem('token'));
        setState((prevState) => ({
          ...prevState,
          reviews: userReviews,
          username: name
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadReviews();
  }, []);

  const deleteReview = async (reviewId) => {
    const checkDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!checkDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/review/${reviewId}`, {
        headers: {
          Authorization: `${token}`,
        }
      });
      setState((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.filter((review) => review.id !== reviewId),
      }));
      alert("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const editReview = (reviewId, currentContent, currentRating) => {
    setState((prevState) => ({
      ...prevState,
      editingReviewId: reviewId,
      editedContent: currentContent,
      editedRating: currentRating,
    }));
  };

  const cancelEdit = () => {
    setState((prevState) => ({
      ...prevState,
      editingReviewId: null,
      editedContent: "",
      editedRating: 0,
    }));
  };

  const saveEditedReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`/review/${reviewId}`, {
        content: state.editedContent,
        rating: state.editedRating,
      }, {
        headers: {
          Authorization: `${token}`,
        }
      });
      setState((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.map((review) =>
          review.id === reviewId
            ? {
              ...review,
              content: prevState.editedContent,
              rating: prevState.editedRating,
            }
            : review
        ),
        editingReviewId: null,
        editedContent: "",
        editedRating: 0,
      }));
      alert("리뷰가 수정되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRatingChange = (newRating) => {
    setState((prevState) => ({
      ...prevState,
      editedRating: newRating,
    }));
  };

  const handleContentChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      editedContent: event.target.value,
    }));
  };

  const { reviews, editingReviewId, editedContent, editedRating, username } = state;

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
        }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'inline', color: 'var(--main-common)' }}>
          나의 리뷰
        </Typography>
        <Box sx={{ margin: "20px 0", borderBottom: "1px solid var(--main-common)" }}></Box>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <MyReviewCard
              key={review.id}
              review={review}
              isEditing={editingReviewId === review.id}
              editedContent={editedContent}
              editedRating={editedRating}
              onEdit={editReview}
              onDelete={deleteReview}
              onCancelEdit={cancelEdit}
              onSaveEdit={() => saveEditedReview(review.id)}
              onRatingChange={handleRatingChange}
              onContentChange={handleContentChange}
              username={username}
            />
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{ color: 'var(--main-common)', textAlign: 'center', marginTop: 3 }}
          >
            작성한 리뷰가 없습니다.
          </Typography>
        )}
      </Paper>
    </MainContainer>
  );
};

export default MyReviews;
