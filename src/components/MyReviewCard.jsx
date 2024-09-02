import React from "react";
import { Typography, Card, CardContent, CardActions, Button, IconButton, TextField } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const MyReviewCard = ({
  review,
  isEditing,
  editedContent,
  editedRating,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  onRatingChange,
  onContentChange,
  username
}) => {
  const renderStars = (rating, editable = false) => {
    const maxRating = 5;
    const filledStars = Array.from({ length: rating }, (_, index) => (
      <IconButton
        key={index}
        onClick={() => editable && onRatingChange(index + 1)}
        disabled={!editable}
        sx={{ color: "#FFD700", padding: "4px" }}
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
          sx={{ color: "#FFD700", padding: "4px" }}
        >
          <StarBorder />
        </IconButton>
      )
    );

    return [...filledStars, ...emptyStars];
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        backgroundColor: "var(--paper-soft)",
        borderRadius: "10px",
        boxShadow: "none",
        padding: 2,
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.12)"
      }}
    >
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
            sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
          />
        ) : (
          <Typography variant="h6" sx={{ color: "var(--main-common)" }}>
            {review.content}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          병원: {review.hospitalName} | 작성일: {review.created_At} | 작성자: {username}
        </Typography>
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <Button
              size="small"
              sx={{
                backgroundColor: "var(--main-deep)",
                color: "white",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "var(--main-common)" },
              }}
              onClick={onSaveEdit}
            >
              저장
            </Button>
            <Button
              size="small"
              sx={{
                backgroundColor: "#E9E9E9",
                color: "black",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#E2E2E2" },
              }}
              onClick={onCancelEdit}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              size="small"
              sx={{
                backgroundColor: "#E9E9E9",
                color: "black",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#E2E2E2" },
              }}
              onClick={() => onEdit(review.id, review.content, review.rating)}
            >
              수정
            </Button>
            <Button
              size="small"
              sx={{
                backgroundColor: "red",
                color: "white",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "darkred" },
              }}
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
