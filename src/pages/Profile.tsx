import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type UserProfile, type UserSettings, type TrainingPreferences, type ReminderSettings } from '../db';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  type SelectChangeEvent,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const Profile: React.FC = () => {
  const userProfile = useLiveQuery(() => db.userProfile.get(1));
  const userSettings = useLiveQuery(() => db.userSettings.get(1));
  const trainingPreferences = useLiveQuery(() => db.trainingPreferences.get(1));
  const reminderSettings = useLiveQuery(() => db.reminderSettings.get(1));

  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [preferences, setPreferences] = useState<Partial<TrainingPreferences>>({});
  const [reminders, setReminders] = useState<Partial<ReminderSettings>>({ hydration: { enabled: false, interval: 20 }, setTransition: { enabled: false, sound: false, vibration: false }});

  useEffect(() => { if (userProfile) setProfile(userProfile); }, [userProfile]);
  useEffect(() => { if (userSettings) setSettings(userSettings); }, [userSettings]);
  useEffect(() => { if (trainingPreferences) setPreferences(trainingPreferences); }, [trainingPreferences]);
  useEffect(() => { if (reminderSettings) setReminders(reminderSettings); }, [reminderSettings]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e: SelectChangeEvent<any>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: SelectChangeEvent<any>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = e.target;
    const [category, key] = name.split('.');

    setReminders(prev => {
        const newReminders = JSON.parse(JSON.stringify(prev));
        newReminders[category as keyof ReminderSettings][key as keyof (ReminderSettings['hydration'] | ReminderSettings['setTransition'])] = checked;
        return newReminders;
    });
  };

  const handleSave = async () => {
    try {
      await db.transaction('rw', db.userProfile, db.userSettings, db.trainingPreferences, db.reminderSettings, async () => {
        if (profile.id) await db.userProfile.update(profile.id, profile);
        if (settings.id) await db.userSettings.update(settings.id, settings);
        if (preferences.id) await db.trainingPreferences.update(preferences.id, preferences);
        if (reminders.id) await db.reminderSettings.update(reminders.id, reminders);
      });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile.');
    }
  };

  if (!userProfile || !userSettings || !trainingPreferences || !reminderSettings) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile & Settings
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField label="Name" name="name" value={profile.name || ''} onChange={handleProfileChange} sx={{ flexGrow: 1, minWidth: '200px' }} />
                <TextField label="Email" name="email" value={profile.email || ''} onChange={handleProfileChange} sx={{ flexGrow: 1, minWidth: '200px' }} disabled />
                <TextField label="Age" name="age" type="number" value={profile.age || ''} onChange={handleProfileChange} sx={{ flexGrow: 1, minWidth: '200px' }} />
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ width: '100%', '@media (min-width:768px)': { width: 'calc(50% - 12px)' } }}>
                <Card>
                    <CardContent><Typography variant="h6" gutterBottom>App Settings</Typography><FormControl fullWidth margin="normal"><InputLabel>Units</InputLabel><Select name="units" value={settings.units || 'imperial'} onChange={handleSettingsChange}><MenuItem value="imperial">Imperial (lbs)</MenuItem><MenuItem value="metric">Metric (kg)</MenuItem></Select></FormControl></CardContent>
                </Card>
            </Box>
            <Box sx={{ width: '100%', '@media (min-width:768px)': { width: 'calc(50% - 12px)' } }}>
                <Card>
                    <CardContent><Typography variant="h6" gutterBottom>Training Goals</Typography><FormControl fullWidth margin="normal"><InputLabel>Primary Goal</InputLabel><Select name="primaryGoal" value={preferences.primaryGoal || 'build_muscle'} onChange={handlePreferencesChange}><MenuItem value="build_muscle">Build Muscle</MenuItem><MenuItem value="increase_strength">Increase Strength</MenuItem><MenuItem value="lose_fat">Lose Fat</MenuItem></Select></FormControl><FormControl fullWidth margin="normal"><InputLabel>Workout Frequency</InputLabel><Select name="workoutFrequency" value={preferences.workoutFrequency || 4} onChange={handlePreferencesChange}>{[...Array(7).keys()].map(i => (<MenuItem key={i+1} value={i+1}>{i+1} days/week</MenuItem>))}</Select></FormControl></CardContent>
                </Card>
            </Box>
        </Box>

        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Reminder Settings</Typography>
                <Box>
                    <FormControlLabel control={<Switch checked={reminders.hydration?.enabled || false} onChange={handleReminderChange} name="hydration.enabled" />} label="Hydration Reminders" />
                </Box>
                <Box>
                    <Typography sx={{mt: 2}}>Set Transition Alerts</Typography>
                    <FormControlLabel control={<Switch checked={reminders.setTransition?.enabled || false} onChange={handleReminderChange} name="setTransition.enabled" />} label="Enable" />
                    <FormControlLabel control={<Switch checked={reminders.setTransition?.sound || false} onChange={handleReminderChange} name="setTransition.sound" />} label="Sound" />
                    <FormControlLabel control={<Switch checked={reminders.setTransition?.vibration || false} onChange={handleReminderChange} name="setTransition.vibration" />} label="Vibration" />
                </Box>
            </CardContent>
        </Card>
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;