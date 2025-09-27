import Dexie, { type Table } from 'dexie';

// 1. User-related interfaces
export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface UserSettings {
  id?: number;
  units: 'metric' | 'imperial';
  language: string;
  theme: 'light' | 'dark';
}

export interface TrainingPreferences {
    id?: number;
    primaryGoal: 'build_muscle' | 'increase_strength' | 'lose_fat';
    workoutFrequency: number; // days per week
}

// 2. Reminder interfaces
export interface ReminderSettings {
    id?: number; // Should be 1
    hydration: {
        enabled: boolean;
        interval: number; // minutes
    };
    setTransition: {
        enabled: boolean;
        sound: boolean;
        vibration: boolean;
    };
}

// 3. Workout-related interfaces
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
      reps: string;
      rest: number;
    }[];
  }[];
}

export interface WorkoutSession {
  id?: number;
  planId: number;
  date: Date;
  duration: number;
  completedExercises: {
    exerciseId: number;
    sets: {
      reps: number;
      weight: number;
    }[];
    notes?: string;
  }[];
}

// 4. Analytics-related interfaces
export interface ProgressRecord {
    id?: number;
    exerciseId: number;
    date: Date;
    maxWeight: number;
    totalVolume: number;
}

// Initial data
const initialExercises: Omit<Exercise, 'id'>[] = [
    { name: 'Bench Press', category: 'Chest', primaryMuscles: ['Pectoralis Major'] },
    { name: 'Pull-ups', category: 'Back', primaryMuscles: ['Latissimus Dorsi'] },
];
const initialUserProfile: UserProfile = { id: 1, name: 'Alex', email: 'alex.fitness@example.com' };
const initialUserSettings: UserSettings = { id: 1, units: 'imperial', language: 'English', theme: 'dark' };
const initialTrainingPreferences: TrainingPreferences = { id: 1, primaryGoal: 'build_muscle', workoutFrequency: 4 };
const initialReminderSettings: ReminderSettings = {
    id: 1,
    hydration: { enabled: true, interval: 20 },
    setTransition: { enabled: true, sound: true, vibration: true },
};

export class MySubClassedDexie extends Dexie {
  // Define tables
  userProfile!: Table<UserProfile>;
  userSettings!: Table<UserSettings>;
  trainingPreferences!: Table<TrainingPreferences>;
  reminderSettings!: Table<ReminderSettings>;
  exercises!: Table<Exercise>;
  workoutPlans!: Table<WorkoutPlan>;
  sessions!: Table<WorkoutSession>;
  progress!: Table<ProgressRecord>;

  constructor() {
    super('gymTrackerDB');
    this.version(3).stores({
        userProfile: '++id, email',
        userSettings: '++id',
        trainingPreferences: '++id',
        reminderSettings: '++id',
        exercises: '++id, name, category, *primaryMuscles',
        workoutPlans: '++id, name',
        sessions: '++id, planId, date',
        progress: '++id, exerciseId, date',
    });
    // ... other versions
    this.version(2).stores({
        userProfile: '++id, email',
        userSettings: '++id',
        trainingPreferences: '++id',
        exercises: '++id, name, category, *primaryMuscles',
        workoutPlans: '++id, name',
        sessions: '++id, planId, date',
        progress: '++id, exerciseId, date',
    });
    this.version(1).stores({
        exercises: '++id, name, category',
        workoutPlans: '++id, name',
        sessions: '++id, workoutPlanId, date',
        progress: '++id, date, exerciseId',
        achievements: '++id, name, unlocked'
    });
  }

  async populate() {
    await db.transaction('rw', this.tables, async () => {
        if ((await this.exercises.count()) === 0) await this.exercises.bulkAdd(initialExercises);
        if ((await this.userProfile.count()) === 0) await this.userProfile.add(initialUserProfile);
        if ((await this.userSettings.count()) === 0) await this.userSettings.add(initialUserSettings);
        if ((await this.trainingPreferences.count()) === 0) await this.trainingPreferences.add(initialTrainingPreferences);
        if ((await this.reminderSettings.count()) === 0) await this.reminderSettings.add(initialReminderSettings);
    });
  }
}

export const db = new MySubClassedDexie();

db.populate().catch(err => {
    console.error("Failed to populate database:", err);
});