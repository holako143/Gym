"use client";
import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';

const categories = ['الكل', 'صدر', 'ظهر', 'أرجل', 'أكتاف', 'أذرع'];

const Exercises: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('صدر');

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []);

  const filteredExercises = useMemo(() => {
    if (!allExercises) return [];
    return allExercises.filter(exercise => {
      const matchesCategory = activeCategory === 'الكل' || exercise.category === activeCategory;
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allExercises, activeCategory, searchTerm]);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) return;

    try {
      await db.exercises.add({
        name: newExerciseName,
        category: newExerciseCategory,
        primaryMuscles: [],
      });
      setNewExerciseName('');
      setNewExerciseCategory('صدر');
      setIsModalOpen(false);
    } catch (error) {
      console.error("فشل إضافة التمرين:", error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                مكتبة التمارين
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                إضافة
            </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="ابحث عن تمرين..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" gutterBottom>الفئات</Typography>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 2 }}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => setActiveCategory(category)}
              color={activeCategory === category ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </Box>

      <List>
        {filteredExercises?.map((exercise) => (
          <ListItem
            key={exercise.id}
            component={Link}
            href={`/exercise/${exercise.id}`}
            secondaryAction={
              <IconButton edge="end" aria-label="التفاصيل">
                <ChevronLeftIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar src={exercise.image}>
                {!exercise.image && <FitnessCenterIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={exercise.name} secondary={exercise.category} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>إضافة تمرين جديد</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddExercise} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="اسم التمرين"
              type="text"
              fullWidth
              variant="standard"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              required
            />
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel id="category-label">الفئة</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={newExerciseCategory}
                onChange={(e) => setNewExerciseCategory(e.target.value)}
                label="الفئة"
              >
                {categories.filter(c => c !== 'الكل').map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleAddExercise} variant="contained">إضافة</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Exercises;