"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

const Achievements: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        الإنجازات
      </Typography>
      <Typography>
        سيتم عرض الجوائز والإنجازات التي حققتها هنا.
      </Typography>
    </Container>
  );
};

export default Achievements;