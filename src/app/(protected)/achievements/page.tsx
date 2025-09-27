"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

const Achievements: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Achievements
      </Typography>
      <Typography>
        Your trophies and unlocked achievements will be displayed here.
      </Typography>
    </Container>
  );
};

export default Achievements;