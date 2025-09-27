"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type WorkoutPlan } from '@/db';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface PlanExercise {
  exerciseId: number;
  name: string;
  sets: number;
  reps: string;
  rest: number;
}

interface PlanDay {
  day: number;
  exercises: PlanExercise[];
}

const CreatePlan: React.FC = () => {
  const router = useRouter();
  const allExercises = useLiveQuery(() => db.exercises.toArray());

  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [days, setDays] = useState<PlanDay[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

  const addDay = () => {
    setDays([...days, { day: days.length + 1, exercises: [] }]);
  };

  const removeDay = (dayIndex: number) => {
    setDays(days.filter((_, index) => index !== dayIndex).map((day, index) => ({ ...day, day: index + 1 })));
  };

  const openExerciseDialog = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex);
    setSelectedExercises([]);
    setIsDialogOpen(true);
  };

  const handleToggleExercise = (exerciseId: number) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const addExercisesToDay = () => {
    if (currentDayIndex === null) return;

    const newExercises: PlanExercise[] = selectedExercises.map(id => {
        const exerciseDetails = allExercises?.find(ex => ex.id === id);
        return {
            exerciseId: id,
            name: exerciseDetails?.name || 'Unknown Exercise',
            sets: 3,
            reps: '8-12',
            rest: 60,
        }
    });

    const newDays = [...days];
    newDays[currentDayIndex].exercises.push(...newExercises);
    setDays(newDays);

    setIsDialogOpen(false);
    setCurrentDayIndex(null);
  };

  const handleExerciseDetailChange = (dayIndex: number, exerciseIndex: number, field: keyof PlanExercise, value: string | number) => {
    const newDays = [...days];
    const exercise = newDays[dayIndex].exercises[exerciseIndex];
    (exercise[field] as any) = value;
    setDays(newDays);
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const handleSave = async () => {
    if (!planName.trim()) {
      alert('Plan name is required.');
      return;
    }

    const planToSave: Omit<WorkoutPlan, 'id'> = {
        name: planName,
        description: planDescription,
        days: days.map(day => ({
            day: day.day,
            exercises: day.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                sets: Number(ex.sets),
                reps: ex.reps,
                rest: Number(ex.rest),
            }))
        }))
    };

    try {
      await db.workoutPlans.add(planToSave);
      router.push('/plans');
    } catch (error) {
      console.error("Failed to save plan:", error);
      alert("Failed to save plan.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Create New Plan
          </Typography>
          <Button color="inherit" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 3, overflowY: 'auto' }}>
        <TextField
          label="Plan Name"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          value={planDescription}
          onChange={(e) => setPlanDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>Workout Days</Typography>

        {days.map((day, dayIndex) => (
          <Accordion key={dayIndex} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1 }}>Day {day.day}</Typography>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeDay(dayIndex); }}>
                <DeleteIcon />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {day.exercises.map((exercise, exIndex) => (
                        <ListItem key={exIndex} divider>
                           <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">{exercise.name}</Typography>
                                    <IconButton size="small" onClick={() => removeExerciseFromDay(dayIndex, exIndex)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <TextField label="Sets" size="small" type="number" value={exercise.sets} onChange={(e) => handleExerciseDetailChange(dayIndex, exIndex, 'sets', e.target.value)} />
                                    <TextField label="Reps" size="small" value={exercise.reps} onChange={(e) => handleExerciseDetailChange(dayIndex, exIndex, 'reps', e.target.value)} />
                                    <TextField label="Rest (s)" size="small" type="number" value={exercise.rest} onChange={(e) => handleExerciseDetailChange(dayIndex, exIndex, 'rest', e.target.value)} />
                                </Stack>
                           </Box>
                        </ListItem>
                    ))}
                </List>
              <Button startIcon={<AddIcon />} onClick={() => openExerciseDialog(dayIndex)}>
                Add Exercise
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={addDay}>
          Add Day
        </Button>
      </Container>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Select Exercises</DialogTitle>
        <DialogContent>
          <List>
            {allExercises?.map(exercise => (
              <ListItem key={exercise.id} onClick={() => handleToggleExercise(exercise.id!)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedExercises.includes(exercise.id!)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={exercise.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={addExercisesToDay} variant="contained">Add Selected</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePlan;