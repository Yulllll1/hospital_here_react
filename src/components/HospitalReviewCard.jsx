import React from "react";
import {Typography, Card, CardContent, IconButton} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const HospitalReviewCard = ({ review, isEditable = false, onRatingChange, onContentChange }) => {
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
    <Card sx={{ marginBottom: 2, backgroundColor: 'var(--paper-soft)' }} elevation={0}>
      <CardContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {renderStars(review.rating, isEditable)}
        </div>
        <Typography variant="h6">{review.content}</Typography>
        <Typography variant="body2" color="textSecondary">
          작성자: {review.userName} | 작성일: {review.created_At}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HospitalReviewCard;