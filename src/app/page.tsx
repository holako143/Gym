"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

const Workouts: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        جلسات التمرين
      </Typography>
      <Typography>
        سيتم عرض جلسات التمرين السابقة والمجدولة هنا.
      </Typography>
    </Container>
  );
};

export default Workouts;