import Dexie, { type Table } from 'dexie';

// Interfaces remain largely the same, but the structure of WorkoutPlan changes.

export interface UserProfile { id?: number; name: string; email: string; age?: number; gender?: 'male' | 'female' | 'other'; }
export interface UserSettings { id?: number; units: 'metric' | 'imperial'; language: string; theme: 'light' | 'dark'; }
export interface TrainingPreferences { id?: number; primaryGoal: 'build_muscle' | 'increase_strength' | 'lose_fat'; workoutFrequency: number; }
export interface ReminderSettings { id?: number; hydration: { enabled: boolean; interval: number; }; setTransition: { enabled: boolean; sound: boolean; vibration: boolean; }; }
export interface Exercise { id?: number; name: string; category: string; primaryMuscles: string[]; secondaryMuscles?: string[]; instructions?: string; image?: string; videoUrl?: string; }
export interface WorkoutSession { id?: number; planId: number; date: Date; duration: number; completedExercises: { exerciseId: number; sets: { reps: number; weight: number; }[]; notes?: string; }[]; }
export interface ProgressRecord { id?: number; exerciseId: number; date: Date; maxWeight: number; totalVolume: number; }

// New structure for exercises within a plan
export interface PlanExercise {
    exerciseId: number;
    sets: number;
    reps: string;
    rest: number; // Rest *after* this exercise. For supersets, this will be 0 for all but the last one.
}

export interface WorkoutPlanDay {
    day: number;
    // An array of exercise groups. A group with 1 exercise is a normal set.
    // A group with >1 exercise is a superset.
    exerciseGroups: PlanExercise[][];
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  description:string;
  days: WorkoutPlanDay[];
}


// Initial data in Arabic
const initialExercises: Omit<Exercise, 'id'>[] = [
    { name: 'بنش برس', category: 'صدر', primaryMuscles: ['العضلة الصدرية الكبرى'], secondaryMuscles: ['الترايسبس', 'الدالية'] },
    { name: 'عقلة', category: 'ظهر', primaryMuscles: ['العضلة الظهرية العريضة'], secondaryMuscles: ['البايسبس', 'شبه المنحرفة'] },
    { name: 'سكوات', category: 'أرجل', primaryMuscles: ['عضلات الفخذ الرباعية', 'الألوية الكبرى'], secondaryMuscles: ['أوتار الركبة', 'السمانة'] },
    { name: 'رفرفة علوية', category: 'أكتاف', primaryMuscles: ['الدالية'], secondaryMuscles: ['الترايسبس'] },
    { name: 'بايسبس كيرل', category: 'أذرع', primaryMuscles: ['البايسبس'] },
];

const initialUserProfile: UserProfile = { id: 1, name: 'أليكس', email: 'alex.fitness@example.com' };
const initialUserSettings: UserSettings = { id: 1, units: 'metric', language: 'Arabic', theme: 'dark' };
const initialTrainingPreferences: TrainingPreferences = { id: 1, primaryGoal: 'build_muscle', workoutFrequency: 4 };
const initialReminderSettings: ReminderSettings = {
    id: 1,
    hydration: { enabled: true, interval: 20 },
    setTransition: { enabled: true, sound: true, vibration: true },
};

export class MySubClassedDexie extends Dexie {
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
    // Bump the version for the new schema
    this.version(4).stores({
        userProfile: '++id, email',
        userSettings: '++id',
        trainingPreferences: '++id',
        reminderSettings: '++id',
        exercises: '++id, name, category, *primaryMuscles',
        workoutPlans: '++id, name',
        sessions: '++id, planId, date',
        progress: '++id, exerciseId, date',
    });

    this.version(3).stores({
        userProfile: '++id, email',
        userSettings: '++id',
        trainingPreferences: '++id',
        reminderSettings: '++id',
        exercises: '++id, name, category, *primaryMuscles',
        workoutPlans: '++id, name',
        sessions: '++id, planId, date',
        progress: '++id, exerciseId, date',
    }).upgrade(tx => {
        // Migration logic for workoutPlans would go here if needed.
        // For now, we assume existing plans can be manually updated or are not critical.
        return tx.table("workoutPlans").toCollection().modify(plan => {
            plan.days = plan.days.map((day: any) => ({
                day: day.day,
                exerciseGroups: day.exercises.map((ex: any) => [ex]) // Wrap each old exercise in a group
            }));
        });
    });

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