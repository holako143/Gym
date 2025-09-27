import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, WorkoutSession } from '../db';
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
  Divider,
  CircularProgress,
  TextField,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import ReplayIcon from '@mui/icons-material/Replay';

interface CompletedSet {
  reps: number;
  weight: number;
}

const ActiveWorkout: React.FC = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const plan = useLiveQuery(() => db.workoutPlans.get(Number(planId)), [planId]);
  const exercises = useLiveQuery(() => db.exercises.toArray(), []);

  // State for the current session
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionSets, setSessionSets] = useState<CompletedSet[][]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);


  useEffect(() => {
    if (plan) {
      // Initialize session state when plan loads
      setStartTime(new Date());
      const initialSets: CompletedSet[][] = plan.days.flatMap(day =>
        day.exercises.map(ex =>
          Array.from({ length: ex.sets }, () => ({ reps: 0, weight: 0 }))
        )
      );
      setSessionSets(initialSets);
    }
  }, [plan]);

  const currentPlanDay = plan?.days[currentDayIndex];
  const currentPlanExercise = currentPlanDay?.exercises[currentExerciseIndex];
  const exerciseDetails = useMemo(() =>
    exercises?.find(e => e.id === currentPlanExercise?.exerciseId),
    [exercises, currentPlanExercise]
  );

  const currentExerciseSets = sessionSets[currentExerciseIndex] || [];
  const completedSetsCount = currentExerciseSets.filter(s => s.reps > 0).length;
  const isExerciseFinished = completedSetsCount === currentPlanExercise?.sets;
  const isWorkoutFinished = currentDayIndex >= (plan?.days.length || 0);

  const handleSetDetailChange = (setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newSessionSets = [...sessionSets];
    newSessionSets[currentExerciseIndex][setIndex][field] = value;
    setSessionSets(newSessionSets);
  };

  const handleCompleteSet = () => {
      // Logic to move to the next set would go here.
      // For this implementation, we assume user fills details and we check completion by `isExerciseFinished`.
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < (currentPlanDay?.exercises.length || 0) - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
        // Last exercise of the day
        handleFinishDay();
    }
  };

  const handleFinishDay = () => {
    if (currentDayIndex < (plan?.days.length || 0) - 1) {
        setCurrentDayIndex(currentDayIndex + 1);
        setCurrentExerciseIndex(0);
    } else {
        // Last day of the plan
        handleSaveWorkout();
    }
  };

  const handleSaveWorkout = async () => {
    if (!plan || !startTime) return;

    const sessionToSave: Omit<WorkoutSession, 'id'> = {
        planId: plan.id!,
        date: new Date(),
        duration: Math.round((new Date().getTime() - startTime.getTime()) / 60000), // duration in minutes
        completedExercises: plan.days.flatMap((day, dayIdx) =>
            day.exercises.map((ex, exIdx) => ({
                exerciseId: ex.exerciseId,
                sets: sessionSets[exIdx] || [], // This logic needs to be more robust for multi-day plans
            }))
        )
    };

    try {
        await db.sessions.add(sessionToSave);
        navigate('/plans');
    } catch (error) {
        console.error("Failed to save session:", error);
    }
  };


  if (!plan || !exercises || sessionSets.length === 0) {
    return <Container sx={{textAlign: 'center', mt: 4}}><CircularProgress /></Container>;
  }

  if (isWorkoutFinished) {
      return (
        <Container sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Workout Complete!</Typography>
            <Button variant="contained" startIcon={<DoneIcon />} onClick={handleSaveWorkout}>Save Session</Button>
        </Container>
      )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {exerciseDetails?.name || 'Loading...'}
          </Typography>
          <Box sx={{ width: 48 }} />
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Day {currentPlanDay.day} - Exercise {currentExerciseIndex + 1} of {currentPlanDay.exercises.length}
        </Typography>
        <Paper elevation={1}>
            <List disablePadding>
                {currentExerciseSets.map((set, setIndex) => (
                <React.Fragment key={setIndex}>
                    <ListItem>
                        <ListItemIcon>
                            {set.reps > 0 ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary={`Set ${setIndex + 1}`}
                            secondary={`Target: ${currentPlanExercise?.reps} reps`}
                        />
                        <Stack direction="row" spacing={1}>
                            <TextField label="Reps" size="small" type="number" value={set.reps || ''} onChange={(e) => handleSetDetailChange(setIndex, 'reps', Number(e.target.value))} sx={{width: '80px'}} />
                            <TextField label="Weight" size="small" type="number" value={set.weight || ''} onChange={(e) => handleSetDetailChange(setIndex, 'weight', Number(e.target.value))} sx={{width: '80px'}} />
                        </Stack>
                    </ListItem>
                    {setIndex < currentExerciseSets.length - 1 && <Divider />}
                </React.Fragment>
                ))}
            </List>
        </Paper>
      </Container>

      <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, p: 2 }} elevation={4}>
          <Button
            variant="contained"
            fullWidth
            disabled={!isExerciseFinished}
            onClick={handleNextExercise}
          >
            {currentExerciseIndex < (currentPlanDay?.exercises.length || 0) - 1 ? 'Next Exercise' : 'Finish Day'}
          </Button>
      </Paper>
    </Box>
  );
};

export default ActiveWorkout;