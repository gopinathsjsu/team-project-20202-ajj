import React from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';

const Review = ({ review }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {review.reviewerName}
          </Typography>
          <Rating value={review.rating} precision={0.5} readOnly />
        </Box>
        <Typography variant="body1" color="text.secondary">
          {review.reviewText}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {new Date(review.reviewDate).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Review; 