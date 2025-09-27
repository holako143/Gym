"use client";
import React from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

const Plans: React.FC = () => {
  const workoutPlans = useLiveQuery(() => db.workoutPlans.toArray());

  return (
    <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Workout Plans
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              href="/create-plan"
            >
                New Plan
            </Button>
        </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {workoutPlans?.map(plan => (
          <Box key={plan.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, flexGrow: 1 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {plan.name}
                </Typography>
                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                  {plan.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href={`/workout/${plan.id}`} size="small">
                  Start Workout
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Plans;