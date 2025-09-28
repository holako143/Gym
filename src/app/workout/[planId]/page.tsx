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
  Box, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemText,
  ListItemIcon, Paper, Button, Container, CircularProgress, TextField, Stack,
  Snackbar, Alert, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DoneIcon from '@mui/icons-material/Done';
import TimerIcon from '@mui/icons-material/Timer';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

interface CompletedSet {
  reps: number;
  weight: number;
}

// State for the entire session, mapping group index to its sets
interface SessionState {
  [groupIndex: number]: {
    [exerciseIndex: number]: CompletedSet[];
  };
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

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sessionState, setSessionState] = useState<SessionState>({});
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [initialRestTime, setInitialRestTime] = useState(0);
  const [isRestPaused, setIsRestPaused] = useState(false);

  useEffect(() => {
    if (plan) {
      setSessionStartTime(new Date());
      const initialState: SessionState = {};
      plan.days.forEach((day, dayIdx) => { // Assuming one day for now
          day.exerciseGroups.forEach((group, groupIdx) => {
              initialState[groupIdx] = {};
              group.forEach((ex, exIdx) => {
                  initialState[groupIdx][exIdx] = Array.from({ length: ex.sets }, () => ({ reps: 0, weight: 0 }));
              })
          })
      });
      setSessionState(initialState);

      if (reminderSettings) {
        dispatch(setReminderSettings(reminderSettings));
        reminderService.startHydrationTimer(reminderSettings.hydration);
      }

      return () => {
        reminderService.stopHydrationTimer();
        dispatch(clearActiveReminders());
      };
    }
  }, [plan, reminderSettings, dispatch]);

  useEffect(() => {
    if (!isResting || isRestPaused) return;
    if (restTime > 0) {
      const timerId = setTimeout(() => setRestTime(restTime - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (restTime === 0) {
      setIsResting(false);
      if (reminderSettings) {
        reminderService.triggerSetTransitionReminder(0, reminderSettings.setTransition);
      }
    }
  }, [restTime, isResting, isRestPaused, reminderSettings]);

  const currentDay = plan?.days[0]; // Assuming one day for now
  const currentGroup = currentDay?.exerciseGroups[currentGroupIndex];
  const totalSetsForGroup = currentGroup?.[0]?.sets || 0;
  const isWorkoutFinished = !currentDay || currentGroupIndex >= currentDay.exerciseGroups.length;

  const handleSetDetailChange = (groupIndex: number, exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newState = JSON.parse(JSON.stringify(sessionState));
    newState[groupIndex][exerciseIndex][setIndex][field] = value;
    setSessionState(newState);
  };

  const handleCompleteSet = () => {
    if (currentSetIndex >= totalSetsForGroup) return; // All sets for this group are done

    // Start rest after completing the set for all exercises in the superset
    const restDuration = currentGroup?.[currentGroup.length - 1].rest || 0;
    if (restDuration > 0) {
      setInitialRestTime(restDuration);
      setRestTime(restDuration);
      setIsResting(true);
    }

    setCurrentSetIndex(currentSetIndex + 1);
  };

  const skipRest = () => {
      setIsResting(false);
      setRestTime(0);
  }

  const handleNextGroup = () => {
    if (currentGroupIndex < (currentDay?.exerciseGroups.length || 0) - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentSetIndex(0); // Reset set index for the new group
    } else {
      handleSaveWorkout();
    }
  };

  const handleSaveWorkout = async () => {
    if (!plan || !sessionStartTime) return;
    // Simplified save logic for now
    router.push('/plans');
  };

  const handleCloseReminder = (id: string) => {
      dispatch(removeActiveReminder(id));
  }

  if (!plan || !exercises || Object.keys(sessionState).length === 0 || !reminderSettings) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (isWorkoutFinished) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>التمرين مكتمل!</Typography>
        <Button variant="contained" startIcon={<DoneIcon />} onClick={handleSaveWorkout}>حفظ الجلسة</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()} aria-label="رجوع"><ArrowForwardIcon /></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {currentGroup.length > 1 ? `سوبر سيت ${currentGroupIndex + 1}` : exercises.find(e => e.id === currentGroup[0].exerciseId)?.name}
          </Typography>
          <Box sx={{width: 48}} />
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
        {currentGroup.map((exercise, exerciseIndex) => {
            const exerciseDetails = exercises.find(e => e.id === exercise.exerciseId);
            return (
                <Paper key={exerciseIndex} sx={{p: 2, mb: 2}}>
                    <Typography variant="h6">{exerciseDetails?.name}</Typography>
                    <List>
                        {Array.from({length: exercise.sets}).map((_, setIndex) => (
                            <ListItem key={setIndex} divider>
                                <ListItemIcon>
                                    {currentSetIndex > setIndex ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
                                </ListItemIcon>
                                <ListItemText primary={`المجموعة ${setIndex + 1}`} secondary={`المستهدف: ${exercise.reps} تكرار`} />
                                <Stack direction="row" spacing={1}>
                                    <TextField label="تكرار" size="small" type="number" disabled={currentSetIndex !== setIndex} onChange={(e) => handleSetDetailChange(currentGroupIndex, exerciseIndex, setIndex, 'reps', Number(e.target.value))} sx={{width: '80px'}} />
                                    <TextField label="وزن" size="small" type="number" disabled={currentSetIndex !== setIndex} onChange={(e) => handleSetDetailChange(currentGroupIndex, exerciseIndex, setIndex, 'weight', Number(e.target.value))} sx={{width: '80px'}} />
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )
        })}
      </Container>

      <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, p: 2 }} elevation={4}>
         {currentSetIndex >= totalSetsForGroup ? (
             <Button variant="contained" fullWidth onClick={handleNextGroup}>
                {currentGroupIndex < (currentDay?.exerciseGroups.length || 0) - 1 ? 'المجموعة التالية' : 'إنهاء التمرين'}
             </Button>
         ) : (
            <Button variant="contained" fullWidth onClick={handleCompleteSet} disabled={isResting}>
                إكمال المجموعة {currentSetIndex + 1}
            </Button>
         )}
      </Paper>

      <Dialog open={isResting} fullWidth maxWidth="xs">
        <DialogTitle textAlign="center">وقت الراحة</DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, p: 3}}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}><CircularProgress variant="determinate" value={(restTime / initialRestTime) * 100} size={120} thickness={4} /><Box sx={{top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Typography variant="h4" component="div" color="text.secondary">{`${String(Math.floor(restTime/60)).padStart(2,'0')}:${String(restTime%60).padStart(2,'0')}`}</Typography></Box></Box>
            <Stack direction="row" spacing={1}><Button variant="outlined" onClick={() => setIsRestPaused(!isRestPaused)}>{isRestPaused ? <PlayArrowIcon /> : <PauseIcon />}{isRestPaused ? 'استئناف' : 'إيقاف مؤقت'}</Button><Button variant="contained" color="secondary" onClick={skipRest}><SkipNextIcon />تخطي</Button></Stack>
        </DialogContent>
      </Dialog>

      {activeReminders.map((reminder) => (
        <Snackbar key={reminder.id} open={true} autoHideDuration={6000} onClose={() => handleCloseReminder(reminder.id)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={() => handleCloseReminder(reminder.id)} severity="info" sx={{ width: '100%' }}>{reminder.message}</Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default ActiveWorkout;