"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Container, Typography, Box, Paper, Chip, Stack, CircularProgress } from '@mui/material';

const ExerciseDetail: React.FC = () => {
  const params = useParams();
  const exerciseId = params.exerciseId;

  const exercise = useLiveQuery(
    () => db.exercises.get(Number(exerciseId)),
    [exerciseId]
  );

  if (!exercise) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading exercise details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 2 }}>
        {exercise.image && (
          <Box
            component="img"
            src={exercise.image}
            alt={exercise.name}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 300,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3,
            }}
          />
        )}
        <Typography variant="h4" component="h1" gutterBottom>
          {exercise.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={exercise.category} color="primary" />
        </Stack>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Primary Muscles
        </Typography>
        <Stack direction="row" spacing={1}>
            {exercise.primaryMuscles.map(muscle => (
                <Chip key={muscle} label={muscle} />
            ))}
        </Stack>

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Secondary Muscles
                </Typography>
                <Stack direction="row" spacing={1}>
                    {exercise.secondaryMuscles.map(muscle => (
                        <Chip key={muscle} label={muscle} variant="outlined" />
                    ))}
                </Stack>
            </>
        )}

        {exercise.instructions && (
             <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Instructions
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {exercise.instructions}
                </Typography>
            </>
        )}
      </Paper>
    </Container>
  );
};

export default ExerciseDetail;