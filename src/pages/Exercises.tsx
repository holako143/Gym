import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

const Exercises: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('Chest');

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []);

  const filteredExercises = useMemo(() => {
    if (!allExercises) return [];
    return allExercises.filter(exercise => {
      const matchesCategory = activeCategory === 'All' || exercise.category === activeCategory;
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
        primaryMuscles: [], // Add default value for required property
      });
      setNewExerciseName('');
      setNewExerciseCategory('Chest');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Exercises
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                Add
            </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search exercises"
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

        <Typography variant="h6" gutterBottom>Categories</Typography>
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
            component={RouterLink}
            to={`/exercise/${exercise.id}`}
            secondaryAction={
              <IconButton edge="end" aria-label="details">
                <ChevronRightIcon />
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
        <DialogTitle>Add New Exercise</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddExercise} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Exercise Name"
              type="text"
              fullWidth
              variant="standard"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              required
            />
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={newExerciseCategory}
                onChange={(e) => setNewExerciseCategory(e.target.value)}
                label="Category"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddExercise} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Exercises;