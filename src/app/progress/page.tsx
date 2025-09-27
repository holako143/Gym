"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

const Progress: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Progress
      </Typography>
      <Typography>
        Progress tracking and analytics will be displayed here.
      </Typography>
    </Container>
  );
};

export default Progress;