"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const navItems = [
  { path: '/', label: 'Workouts', icon: <FitnessCenterIcon /> },
  { path: '/exercises', label: 'Exercises', icon: <SearchIcon /> },
  { path: '/plans', label: 'Plans', icon: <EventNoteIcon /> },
  { path: '/progress', label: 'Progress', icon: <LeaderboardIcon /> },
  { path: '/achievements', label: 'Achievements', icon: <EmojiEventsIcon /> },
];

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
      <BottomNavigation value={pathname} onChange={handleChange} showLabels>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;