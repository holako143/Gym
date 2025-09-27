import Dexie, { type Table } from 'dexie';

// 1. User-related interfaces
export interface UserProfile {
  id?: number; // Should be 1 for the single user
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface UserSettings {
  id?: number; // Should be 1
  units: 'metric' | 'imperial';
  language: string;
  theme: 'light' | 'dark';
}

export interface TrainingPreferences {
    id?: number; // Should be 1
    primaryGoal: 'build_muscle' | 'increase_strength' | 'lose_fat';
    workoutFrequency: number; // days per week
}


// 2. Workout-related interfaces
export interface Exercise {
  id?: number;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions?: string;
  image?: string;
  videoUrl?: string;
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  description: string;
  days: {
    day: number;
    exercises: {
      exerciseId: number;
      sets: number;
      reps: string; // e.g., "8-12"
      rest: number; // in seconds
    }[];
  }[];
}

export interface WorkoutSession {
  id?: number;
  planId: number;
  date: Date;
  duration: number; // in minutes
  completedExercises: {
    exerciseId: number;
    sets: {
      reps: number;
      weight: number;
    }[];
    notes?: string;
  }[];
}

// 3. Analytics-related interfaces
export interface ProgressRecord {
    id?: number;
    exerciseId: number;
    date: Date;
    maxWeight: number;
    totalVolume: number;
}

// Initial data for seeding the database
const initialExercises: Omit<Exercise, 'id'>[] = [
    { name: 'Bench Press', category: 'Chest', primaryMuscles: ['Pectoralis Major'], secondaryMuscles: ['Triceps', 'Deltoids'] },
    { name: 'Pull-ups', category: 'Back', primaryMuscles: ['Latissimus Dorsi'], secondaryMuscles: ['Biceps', 'Trapezius'] },
    { name: 'Squats', category: 'Legs', primaryMuscles: ['Quadriceps', 'Gluteus Maximus'], secondaryMuscles: ['Hamstrings', 'Calves'] },
    { name: 'Overhead Press', category: 'Shoulders', primaryMuscles: ['Deltoids'], secondaryMuscles: ['Triceps'] },
    { name: 'Bicep Curls', category: 'Arms', primaryMuscles: ['Biceps'] },
];


export class MySubClassedDexie extends Dexie {
  // Define tables
  userProfile!: Table<UserProfile>;
  userSettings!: Table<UserSettings>;
  trainingPreferences!: Table<TrainingPreferences>;
  exercises!: Table<Exercise>;
  workoutPlans!: Table<WorkoutPlan>;
  sessions!: Table<WorkoutSession>;
  progress!: Table<ProgressRecord>;


  constructor() {
    super('gymTrackerDB');
    this.version(2).stores({
        // New schema definition
        userProfile: '++id, email',
        userSettings: '++id',
        trainingPreferences: '++id',
        exercises: '++id, name, category, *primaryMuscles',
        workoutPlans: '++id, name',
        sessions: '++id, planId, date',
        progress: '++id, exerciseId, date',
    });

    // We keep the old version definition for migration purposes,
    // although we won't define a migration function for this simple case.
    this.version(1).stores({
        exercises: '++id, name, category',
        workoutPlans: '++id, name',
        sessions: '++id, workoutPlanId, date',
        progress: '++id, date, exerciseId',
        achievements: '++id, name, unlocked'
    });
  }

  async populate() {
    const count = await this.exercises.count();
    if (count === 0) {
      await this.exercises.bulkAdd(initialExercises);
    }
  }
}

export const db = new MySubClassedDexie();

db.populate().catch(err => {
    console.error("Failed to populate database:", err);
});