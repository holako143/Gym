import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import type { RootState } from './store/store';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Plans from './pages/Plans';
import Progress from './pages/Progress';
import Achievements from './pages/Achievements';
import ActiveWorkout from './pages/ActiveWorkout';
import Profile from './pages/Profile';
import ExerciseDetail from './pages/ExerciseDetail';
import CreatePlan from './pages/CreatePlan';

function App() {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = getTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Workouts />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="exercise/:exerciseId" element={<ExerciseDetail />} />
              <Route path="plans" element={<Plans />} />
              <Route path="create-plan" element={<CreatePlan />} />
              <Route path="progress" element={<Progress />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/workout/:planId" element={<ActiveWorkout />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;