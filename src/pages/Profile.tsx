import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, UserProfile, UserSettings, TrainingPreferences } from '../db';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const Profile: React.FC = () => {
  // Fetch data from Dexie tables
  const userProfile = useLiveQuery(() => db.userProfile.get(1));
  const userSettings = useLiveQuery(() => db.userSettings.get(1));
  const trainingPreferences = useLiveQuery(() => db.trainingPreferences.get(1));

  // Local state for form fields
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [preferences, setPreferences] = useState<Partial<TrainingPreferences>>({});

  useEffect(() => {
    if (userProfile) setProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (userSettings) setSettings(userSettings);
  }, [userSettings]);

  useEffect(() => {
    if (trainingPreferences) setPreferences(trainingPreferences);
  }, [trainingPreferences]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e: SelectChangeEvent<string | 'metric' | 'imperial'>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: SelectChangeEvent<string | 'build_muscle' | 'increase_strength' | 'lose_fat' | number>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await db.transaction('rw', db.userProfile, db.userSettings, db.trainingPreferences, async () => {
        if (profile.id) await db.userProfile.update(profile.id, profile);
        if (settings.id) await db.userSettings.update(settings.id, settings);
        if (preferences.id) await db.trainingPreferences.update(preferences.id, preferences);
      });
      // Optionally, show a success snackbar
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Optionally, show an error snackbar
      alert('Failed to save profile.');
    }
  };

  if (!userProfile || !userSettings || !trainingPreferences) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile & Settings
      </Typography>
      <Grid container spacing={3}>
        {/* Personal Information Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Name" name="name" value={profile.name || ''} onChange={handleProfileChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" name="email" value={profile.email || ''} onChange={handleProfileChange} fullWidth disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Age" name="age" type="number" value={profile.age || ''} onChange={handleProfileChange} fullWidth />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* App Settings Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>App Settings</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Units</InputLabel>
                <Select name="units" value={settings.units || 'imperial'} onChange={handleSettingsChange}>
                  <MenuItem value="imperial">Imperial (lbs)</MenuItem>
                  <MenuItem value="metric">Metric (kg)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Training Goals Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Training Goals</Typography>
               <FormControl fullWidth margin="normal">
                <InputLabel>Primary Goal</InputLabel>
                <Select name="primaryGoal" value={preferences.primaryGoal || 'build_muscle'} onChange={handlePreferencesChange}>
                  <MenuItem value="build_muscle">Build Muscle</MenuItem>
                  <MenuItem value="increase_strength">Increase Strength</MenuItem>
                  <MenuItem value="lose_fat">Lose Fat</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Workout Frequency</InputLabel>
                <Select name="workoutFrequency" value={preferences.workoutFrequency || 4} onChange={handlePreferencesChange}>
                    {[...Array(7).keys()].map(i => (
                        <MenuItem key={i+1} value={i+1}>{i+1} days/week</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;