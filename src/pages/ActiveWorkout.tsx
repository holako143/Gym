import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db';

const mockWorkoutData = {
  exerciseName: 'Barbell Bench Press',
  sets: [
    { id: 1, weight: 135, reps: 8, completed: true },
    { id: 2, weight: 135, reps: 8, completed: true },
    { id: 3, weight: 135, reps: 8, completed: false },
    { id: 4, weight: 135, reps: 8, completed: false },
    { id: 5, weight: 135, reps: 8, completed: false },
  ],
};

const ActiveWorkout: React.FC = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [sets, setSets] = useState(mockWorkoutData.sets);

  const currentSetIndex = sets.findIndex(set => !set.completed);
  const isWorkoutFinished = currentSetIndex === -1;
  const currentSetNumber = isWorkoutFinished ? sets.length + 1 : currentSetIndex + 1;

  const handleCompleteSet = async () => {
    if (isWorkoutFinished) {
      try {
        if (planId) {
          await db.sessions.add({
            workoutPlanId: Number(planId),
            date: new Date(),
          });
          console.log("Workout session saved successfully!");
        }
        navigate('/plans');
      } catch (error) {
        console.error("Failed to save workout session:", error);
        // Optionally, show an error message to the user
      }
      return;
    }

    const newSets = [...sets];
    newSets[currentSetIndex].completed = true;
    setSets(newSets);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col justify-between group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="flex flex-col flex-grow">
        <header className="flex items-center p-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
          <button onClick={() => navigate(-1)} className="text-gray-800 dark:text-gray-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center pr-10">{mockWorkoutData.exerciseName}</h1>
        </header>
        <main className="flex-grow px-4 pb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-4 pb-2">Sets</h2>
          <div className="space-y-2">
            {sets.map((set, index) => (
              <div
                key={set.id}
                className={`flex items-center justify-between gap-4 p-4 rounded-lg transition-colors ${
                  set.completed
                  ? 'bg-primary/10 dark:bg-primary/20'
                  : 'bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex-grow">
                  <p className="text-base font-bold text-gray-900 dark:text-white">Set {index + 1}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{set.weight} lbs x {set.reps} reps</p>
                </div>
                <div className={`flex size-8 items-center justify-center rounded-full transition-all ${
                  set.completed
                  ? 'bg-primary text-white'
                  : 'border-2 border-gray-300 dark:border-gray-600'
                }`}>
                  {set.completed && (
                    <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <footer className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-4 justify-stretch">
          <button className="flex flex-1 items-center justify-center rounded-lg h-12 px-5 bg-primary/20 dark:bg-primary/30 text-primary text-base font-bold hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors">
            <span className="truncate">View History</span>
          </button>
          <button
            onClick={handleCompleteSet}
            className="flex flex-1 items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold hover:opacity-90 transition-opacity"
          >
            <span className="truncate">
              {isWorkoutFinished ? 'Finish Workout' : `Start Set ${currentSetNumber}`}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ActiveWorkout;