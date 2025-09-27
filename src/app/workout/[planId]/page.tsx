"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { setReminderSettings, removeActiveReminder, clearActiveReminders } from '@/store/slices/reminderSlice';
import { reminderService } from '@/services/ReminderService';
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
  CircularProgress,
  TextField,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DoneIcon from '@mui/icons-material/Done';
import TimerIcon from '@mui/icons-material/Timer';

interface CompletedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

const ActiveWorkout: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId;

  const dispatch = useDispatch();

  const plan = useLiveQuery(() => db.workoutPlans.get(Number(planId)), [planId]);
  const exercises = useLiveQuery(() => db.exercises.toArray(), []);
  const reminderSettings = useLiveQuery(() => db.reminderSettings.get(1));
  const activeReminders = useSelector((state: RootState) => state.reminders.activeReminders);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionSets, setSessionSets] = useState<CompletedSet[][]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  useEffect(() => {
    if (reminderSettings) {
      dispatch(setReminderSettings(reminderSettings));
    }
  }, [reminderSettings, dispatch]);

  useEffect(() => {
    if (plan && reminderSettings) {
      setSessionStartTime(new Date());
      reminderService.startHydrationTimer(reminderSettings.hydration);

      const initialSets: CompletedSet[][] = plan.days.flatMap(day =>
        day.exercises.map(ex =>
          Array.from({ length: ex.sets }, () => ({ reps: 0, weight: 0, completed: false }))
        )
      );
      setSessionSets(initialSets);

      return () => {
        reminderService.stopHydrationTimer();
        dispatch(clearActiveReminders());
      };
    }
  }, [plan, reminderSettings, dispatch]);

  useEffect(() => {
      if (restTimer === null) return;
      if (restTimer > 0) {
          const timerId = setTimeout(() => setRestTimer(restTimer - 1), 1000);
          return () => clearTimeout(timerId);
      } else if (restTimer === 0) {
          if(reminderSettings) {
              reminderService.triggerSetTransitionReminder(0, reminderSettings.setTransition);
          }
          setRestTimer(null);
      }
  }, [restTimer, reminderSettings]);

  const currentPlanDay = plan?.days[currentDayIndex];
  const currentPlanExercise = currentPlanDay?.exercises[currentExerciseIndex];
  const exerciseDetails = useMemo(() =>
    exercises?.find(e => e.id === currentPlanExercise?.exerciseId),
    [exercises, currentPlanExercise]
  );

  const currentExerciseSets = sessionSets[currentExerciseIndex] || [];
  const currentSetIndex = currentExerciseSets.findIndex(s => !s.completed);
  const isExerciseFinished = currentSetIndex === -1;
  const isWorkoutFinished = currentDayIndex >= (plan?.days.length || 0);

  const handleSetDetailChange = (setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newSessionSets = JSON.parse(JSON.stringify(sessionSets));
    newSessionSets[currentExerciseIndex][setIndex][field] = value;
    setSessionSets(newSessionSets);
  };

  const handleCompleteSet = () => {
    if (currentSetIndex === -1) return;
    const newSessionSets = JSON.parse(JSON.stringify(sessionSets));
    newSessionSets[currentExerciseIndex][currentSetIndex].completed = true;
    setSessionSets(newSessionSets);

    if (currentPlanExercise && reminderSettings) {
        setRestTimer(currentPlanExercise.rest);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < (currentPlanDay?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      handleFinishDay();
    }
  };

  const handleFinishDay = () => {
    if (currentDayIndex < (plan?.days.length || 0) - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
      setCurrentExerciseIndex(0);
    } else {
      handleSaveWorkout();
    }
  };

  const handleSaveWorkout = async () => {
    if (!plan || !sessionStartTime) return;

    const sessionToSave = {
        planId: plan.id!,
        date: new Date(),
        duration: Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000),
        completedExercises: plan.days.flatMap((day) =>
            day.exercises.map((ex, exIdx) => ({
                exerciseId: ex.exerciseId,
                sets: sessionSets[exIdx] || [],
            }))
        )
    };
    await db.sessions.add(sessionToSave);
    router.push('/plans');
  };

  const handleCloseReminder = (id: string) => {
      dispatch(removeActiveReminder(id));
  }

  if (!plan || !exercises || sessionSets.length === 0 || !reminderSettings) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (isWorkoutFinished) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>Workout Complete!</Typography>
        <Button variant="contained" startIcon={<DoneIcon />} onClick={handleSaveWorkout}>Save Session</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {exerciseDetails?.name}
          </Typography>
          {restTimer !== null && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimerIcon sx={{ mr: 1 }}/>
                <Typography>{String(Math.floor(restTimer/60)).padStart(2,'0')}:{String(restTimer%60).padStart(2,'0')}</Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
        <List>
            {currentExerciseSets.map((set, setIndex) => (
                <ListItem key={setIndex} divider>
                    <ListItemIcon>
                        {set.completed ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
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
            ))}
        </List>
      </Container>

      <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, p: 2 }} elevation={4}>
         {isExerciseFinished ? (
             <Button variant="contained" fullWidth onClick={handleNextExercise}>
                {currentExerciseIndex < (currentPlanDay?.exercises.length || 0) - 1 ? 'Next Exercise' : 'Finish Day'}
             </Button>
         ) : (
            <Button variant="contained" fullWidth onClick={handleCompleteSet} disabled={restTimer !== null}>
                Complete Set {currentSetIndex + 1}
            </Button>
         )}
      </Paper>

      {activeReminders.map((reminder) => (
        <Snackbar
          key={reminder.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => handleCloseReminder(reminder.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => handleCloseReminder(reminder.id)} severity="info" sx={{ width: '100%' }}>
                {reminder.message}
            </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default ActiveWorkout;