"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type WorkoutPlan, type PlanExercise } from '@/db';
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
  Stack,
  Paper
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';

interface DisplayExercise extends PlanExercise {
    name: string;
}

interface PlanDay {
  day: number;
  exerciseGroups: DisplayExercise[][];
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
    setDays([...days, { day: days.length + 1, exerciseGroups: [] }]);
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
    setSelectedExercises(prev => prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]);
  };

  const addExercisesToDay = () => {
    if (currentDayIndex === null) return;

    const newExerciseGroups: DisplayExercise[][] = selectedExercises.map(id => {
        const exerciseDetails = allExercises?.find(ex => ex.id === id);
        return [{
            exerciseId: id,
            name: exerciseDetails?.name || 'تمرين غير معروف',
            sets: 3, reps: '8-12', rest: 60,
        }];
    });

    const newDays = [...days];
    newDays[currentDayIndex].exerciseGroups.push(...newExerciseGroups);
    setDays(newDays);
    setIsDialogOpen(false);
  };

  const handleExerciseDetailChange = (dayIndex: number, groupIndex: number, exerciseIndex: number, field: keyof PlanExercise, value: string | number) => {
    const newDays = [...days];
    const exercise = newDays[dayIndex].exerciseGroups[groupIndex][exerciseIndex];
    (exercise[field] as any) = value;
    setDays(newDays);
  };

  const removeExerciseGroup = (dayIndex: number, groupIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exerciseGroups.splice(groupIndex, 1);
    setDays(newDays);
  };

  const handleSuperset = (dayIndex: number, groupIndex: number) => {
    const newDays = [...days];
    const currentGroup = newDays[dayIndex].exerciseGroups[groupIndex];
    const nextGroup = newDays[dayIndex].exerciseGroups[groupIndex + 1];

    if (!nextGroup) return; // Cannot superset the last item

    // Merge next group into current group
    currentGroup.push(...nextGroup);
    // Set rest time of newly added items to 0, except for the last one
    currentGroup.forEach((ex, idx) => {
        if(idx < currentGroup.length -1) ex.rest = 0;
    });

    // Remove the merged group
    newDays[dayIndex].exerciseGroups.splice(groupIndex + 1, 1);
    setDays(newDays);
  };

  const handleSave = async () => {
    if (!planName.trim()) {
      alert('اسم الخطة مطلوب.');
      return;
    }

    const planToSave: Omit<WorkoutPlan, 'id'> = {
        name: planName,
        description: planDescription,
        days: days.map(day => ({
            day: day.day,
            exerciseGroups: day.exerciseGroups.map(group =>
                group.map(({ name, ...rest }) => rest) // Remove the 'name' property before saving
            )
        }))
    };

    try {
      await db.workoutPlans.add(planToSave);
      router.push('/plans');
    } catch (error) {
      console.error("فشل حفظ الخطة:", error);
      alert("فشل حفظ الخطة.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()} aria-label="رجوع"><ArrowForwardIcon /></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>إنشاء خطة جديدة</Typography>
          <Button color="inherit" startIcon={<SaveIcon />} onClick={handleSave}>حفظ</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 3, overflowY: 'auto' }}>
        <TextField label="اسم الخطة" value={planName} onChange={(e) => setPlanName(e.target.value)} fullWidth required margin="normal" />
        <TextField label="الوصف" value={planDescription} onChange={(e) => setPlanDescription(e.target.value)} fullWidth multiline rows={3} margin="normal" />

        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>أيام التمرين</Typography>

        {days.map((day, dayIndex) => (
          <Accordion key={dayIndex} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ flexGrow: 1 }}>اليوم {day.day}</Typography><IconButton size="small" onClick={(e) => { e.stopPropagation(); removeDay(dayIndex); }}><DeleteIcon /></IconButton></AccordionSummary>
            <AccordionDetails>
                {day.exerciseGroups.map((group, groupIndex) => (
                    <Paper key={groupIndex} variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                            <Typography variant="overline">
                                {group.length > 1 ? `سوبر سيت (${group.length} تمارين)`: 'تمرين عادي'}
                            </Typography>
                            <IconButton size="small" onClick={() => removeExerciseGroup(dayIndex, groupIndex)}><DeleteIcon fontSize="small" /></IconButton>
                        </Box>
                        {group.map((exercise, exIndex) => (
                            <Box key={exIndex} sx={{mb: exIndex === group.length - 1 ? 0 : 2}}>
                                <Typography variant="subtitle1" gutterBottom>{exercise.name}</Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField label="مجموعات" size="small" type="number" value={exercise.sets} onChange={(e) => handleExerciseDetailChange(dayIndex, groupIndex, exIndex, 'sets', e.target.value)} />
                                    <TextField label="تكرارات" size="small" value={exercise.reps} onChange={(e) => handleExerciseDetailChange(dayIndex, groupIndex, exIndex, 'reps', e.target.value)} />
                                    <TextField label="راحة (ث)" size="small" type="number" value={exercise.rest} onChange={(e) => handleExerciseDetailChange(dayIndex, groupIndex, exIndex, 'rest', e.target.value)} />
                                </Stack>
                            </Box>
                        ))}
                         {group.length === 1 && groupIndex < day.exerciseGroups.length - 1 && (
                            <Button size="small" startIcon={<LinkIcon />} onClick={() => handleSuperset(dayIndex, groupIndex)} sx={{mt: 1}}>
                                دمج مع التالي (سوبر سيت)
                            </Button>
                        )}
                    </Paper>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => openExerciseDialog(dayIndex)} sx={{mt: 1}}>إضافة تمرين</Button>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={addDay}>إضافة يوم</Button>
      </Container>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>اختر التمارين</DialogTitle>
        <DialogContent>
          <List>
            {allExercises?.map(exercise => (
              <ListItem key={exercise.id} onClick={() => handleToggleExercise(exercise.id!)}>
                <ListItemIcon><Checkbox edge="start" checked={selectedExercises.includes(exercise.id!)} tabIndex={-1} disableRipple /></ListItemIcon>
                <ListItemText primary={exercise.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
          <Button onClick={addExercisesToDay} variant="contained">إضافة المحدد</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePlan;