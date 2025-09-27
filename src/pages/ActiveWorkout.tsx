import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Button,
  Container,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HistoryIcon from '@mui/icons-material/History';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';


const mockWorkoutData = {
  exerciseName: 'Barbell Bench Press',
  sets: [
    { id: 1, weight: 135, reps: 8, completed: true },
    { id: 2, weight: 135, reps: 8, completed: true },
    { id: 3, weight: 135, reps: 8, completed: false },
    { id: 4, weight: 135, reps: 8, completed: false },
    { id: 5, weight: 135, reps: 8, completed: false },
  ],
};

const ActiveWorkout: React.FC = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [sets, setSets] = useState(mockWorkoutData.sets);

  const currentSetIndex = sets.findIndex(set => !set.completed);
  const isWorkoutFinished = currentSetIndex === -1;
  const currentSetNumber = isWorkoutFinished ? sets.length + 1 : currentSetIndex + 1;

  const handleCompleteSet = async () => {
    if (isWorkoutFinished) {
      try {
        if (planId) {
          await db.sessions.add({
            workoutPlanId: Number(planId),
            date: new Date(),
          });
        }
        navigate('/plans');
      } catch (error) {
        console.error("Failed to save workout session:", error);
      }
      return;
    }

    const newSets = [...sets];
    newSets[currentSetIndex].completed = true;
    setSets(newSets);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {mockWorkoutData.exerciseName}
          </Typography>
          <Box sx={{ width: 48 }} /> {/* Placeholder for balance */}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
        <Typography variant="h5" gutterBottom>Sets</Typography>
        <Paper elevation={1}>
            <List disablePadding>
                {sets.map((set, index) => (
                <React.Fragment key={set.id}>
                    <ListItem>
                        <ListItemIcon>
                            {set.completed ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary={`Set ${index + 1}`}
                            secondary={`${set.weight} lbs x ${set.reps} reps`}
                        />
                    </ListItem>
                    {index < sets.length - 1 && <Divider />}
                </React.Fragment>
                ))}
            </List>
        </Paper>
      </Container>

      <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, p: 2 }} elevation={4}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<HistoryIcon />} fullWidth>
            History
          </Button>
          <Button
            variant="contained"
            startIcon={isWorkoutFinished ? <DoneIcon /> : <PlayArrowIcon />}
            fullWidth
            onClick={handleCompleteSet}
          >
            {isWorkoutFinished ? 'Finish Workout' : `Start Set ${currentSetNumber}`}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ActiveWorkout;