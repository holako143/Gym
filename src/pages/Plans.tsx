import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

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
              component={RouterLink}
              to="/create-plan"
            >
                New Plan
            </Button>
        </Box>

      <Grid container spacing={3}>
        {workoutPlans?.map(plan => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {plan.name}
                </Typography>
                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                  {plan.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to={`/workout/${plan.id}`} size="small">
                  Start Workout
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Plans;