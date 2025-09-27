import React from 'react';
import { Link } from 'react-router-dom';

const workoutPlans = [
  { id: 1, name: 'Full Body Strength', description: 'A 3-day routine focusing on compound lifts.' },
  { id: 2, name: 'Push/Pull/Legs', description: 'A classic split for intermediate lifters.' },
  { id: 3, name: 'High-Volume Hypertrophy', description: 'Maximize muscle growth with this intense plan.' },
];

const Plans: React.FC = () => {
  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Plans</h1>
        <button className="flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-primary/20 dark:text-gray-300 dark:hover:bg-primary/30">
            <span className="material-symbols-outlined"> add </span>
        </button>
      </header>

      <div className="space-y-4">
        {workoutPlans.map(plan => (
          <div key={plan.id} className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md overflow-hidden p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.description}</p>
                <Link to={`/workout/${plan.id}`}>
                  <button className="mt-4 bg-primary/10 dark:bg-primary/20 text-primary font-bold py-2 px-4 rounded-full text-sm hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                    Start Workout
                  </button>
                </Link>
              </div>
              <div className="w-24 h-24 rounded-lg bg-cover bg-center bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;