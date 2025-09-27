import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Plans from './pages/Plans';
import Progress from './pages/Progress';
import Achievements from './pages/Achievements';

import ActiveWorkout from './pages/ActiveWorkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Workouts />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="plans" element={<Plans />} />
          <Route path="progress" element={<Progress />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>
        <Route path="/workout/:planId" element={<ActiveWorkout />} />
      </Routes>
    </Router>
  );
}

export default App;