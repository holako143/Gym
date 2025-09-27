"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

const Progress: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        التقدم
      </Typography>
      <Typography>
        سيتم عرض تتبع التقدم والتحليلات هنا.
      </Typography>
    </Container>
  );
};

export default Progress;