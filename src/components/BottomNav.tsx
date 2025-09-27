import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Workouts', icon: 'fitness_center' },
  { path: '/exercises', label: 'Exercises', icon: 'search' },
  { path: '/plans', label: 'Plans', icon: 'event_note' },
  { path: '/progress', label: 'Progress', icon: 'leaderboard' },
  { path: '/achievements', label: 'Achievements', icon: 'emoji_events' },
];

const BottomNav: React.FC = () => {
  const activeLinkClass = 'text-primary';
  const inactiveLinkClass = 'text-gray-500 dark:text-gray-400';

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 pb-safe">
      <nav className="flex justify-around p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-primary/10 ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;