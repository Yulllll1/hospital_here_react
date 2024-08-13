import React from "react";
import { Typography, Card, CardContent, CardActions, Button, IconButton, TextField } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const MyReviewCard = ({review, isEditing, editedContent, editedRating, onEdit, onDelete, onCancelEdit, onSaveEdit, onRatingChange, onContentChange,
  username }) => {
  const renderStars = (rating, editable = false) => {
    const maxRating = 5;
    const filledStars = Array.from({ length: rating }, (_, index) => (
      <IconButton
        key={index}
        onClick={() => editable && onRatingChange(index + 1)}
        disabled={!editable}
      >
        <Star style={{ color: "#FFD700" }} />
      </IconButton>
    ));
    const emptyStars = Array.from(
      { length: maxRating - rating },
      (_, index) => (
        <IconButton
          key={index + rating}
          onClick={() => editable && onRatingChange(rating + index + 1)}
          disabled={!editable}
        >
          <StarBorder style={{ color: "#FFD700" }} />
        </IconButton>
      )
    );

    return [...filledStars, ...emptyStars];
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {isEditing ? renderStars(editedRating, true) : renderStars(review.rating)}
        </div>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            value={editedContent}
            onChange={onContentChange}
          />
        ) : (
          <Typography variant="h6">{review.content}</Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          병원: {review.hospitalName} | 작성일: {review.created_At} | 작성자: {username}
        </Typography>
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={onSaveEdit}
            >
              저장
            </Button>
            <Button size="small" variant="outlined" onClick={onCancelEdit}>
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onEdit(review.id, review.content, review.rating)}
            >
              수정
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => onDelete(review.id)}
            >
              삭제
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default MyReviewCard;
