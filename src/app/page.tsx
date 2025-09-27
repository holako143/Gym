"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

const Workouts: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Workouts
      </Typography>
      <Typography>
        Your workout sessions and history will be displayed here.
      </Typography>
    </Container>
  );
};

export default Workouts;