import Dexie, { Table } from 'dexie';

export interface Exercise {
  id?: number;
  name: string;
  category: string;
  image?: string;
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  description: string;
}

export interface Session {
  id?: number;
  workoutPlanId: number;
  date: Date;
}

export interface Progress {
    id?: number;
    date: Date;
    weight: number;
    reps: number;
    exerciseId: number;
}

export interface Achievement {
    id?: number;
    name: string;
    unlocked: boolean;
}

const initialExercises: Omit<Exercise, 'id'>[] = [
    { name: 'Bench Press', category: 'Chest', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0LZN_7nOq0bxOz9HTm_DA0CeeeQTQOGFjtMFRcsgezLLkb754ZbkDG_W8brKvFyHxHwI3xVDpRNqtUPTPeNUx5leX7zxg-s2ZFEiy_UAMpJh7faYLRePOyE4aLyIEiz4yjlDdh5rW78jFf01ckvnzolTb_kBmE4OqzcprM-LNSky8kr2rfLtAiwuTygZ9J-4mlTf0PAp4r8_neKoNHVdQs6zsd6O7IdmmOyRuLA6ORPNjJ6AnqhbOBqw08hoDuUwid3UdceiDME5I' },
    { name: 'Pull-ups', category: 'Back', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDusMlG6vlBYys1cdTzApTzo8y1mca517Nd6AT9Uun3riH2mT_nJcyNgXH_zrPQxJYboonf3GlqC38TAtl0MTeRJ8P3Ng09dICbGwY2P3djuOq5kY2bNlR5mxbw16r3rTDQVN2wo_2C_91VDByI5lvXhx21Az1aPbE_NZ6uMOpqjddJ2Q-Px1-tU_sk2bS1PO5A-5lYjhTUts4v678pa12bwwtb-MDfqh9skOorInkC0KtQsBrnzO-97YPIAlpqZKzAIGZ5u0WphhV4' },
    { name: 'Squats', category: 'Legs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4-VKRG7k23GDxl_TbdGAbLPGMWszmeDWuR7Lme5vQx0vRvomClhI7Bqxq4Yb777pcQfBiWmomE4sKYEqY8FF8u_5sRasApVucclbX6SkKASGynz6Jli-1Va7-X8704T5vgchrMY-T6JUqLuIRb6FQA40ZSRo7Ljtkf6Rm6t-yske1w7pjQHQcnNXXECRA4M3t1MHRX2re7KCZGgdSQZgMlPox1tES7Wf_LoTCNN3y3w84dNdGpqF11B1xNuXKo1lMn6mgMxRR52u_' },
    { name: 'Overhead Press', category: 'Shoulders', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm0VHLdEMSd79y2UKq2ZF-39pJ-kjFKyrh26C8hrlQd-OUb_MD-dTIA-s8ihNN8vAa5mKxrHbnCB6R5Bo07nSzKAzpqIb-vWTXFk0_fncx9jtHEkU-XIK99KFniUHjKWF1BFpQswH_Mh8fjHqcweTEp4_nLg3L5PXlk-AvT3ee72So3LziGEjTrvS1y3KDDopaLWNxpnLxNbBzwnCnlSMOVof_f-N3CyppladvtPt3XURJO-ZKM5YHvk4_jeEzuNPOWjddJKC7Ms5L' },
    { name: 'Bicep Curls', category: 'Arms', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGa5zKf8yXu3VMPNgwDIBhw7ypi6mGzUlWyhANvy7FRkCzyiPjwIocntgsuThtxd3yJ2ffLD9Ok6AXg4dLUWhh4TnV-e1iQk-4DNhq4KSJ7sX4RB2F795lwZCUjK4eyp9qppgaiZ8YccQ7oTzDZ5psJJwao47llQStWXSze2XkxdWGRN4fTe9erTF3f5XpC8uUI3qz-UkmtUkXEkpndcN1uUNZmX6wyWk7S_TrWRDF3F1UZfP_dDp3CRz8ZWf4uej3ZdJgJgtqzDym' },
];

export class MySubClassedDexie extends Dexie {
  exercises!: Table<Exercise>;
  workoutPlans!: Table<WorkoutPlan>;
  sessions!: Table<Session>;
  progress!: Table<Progress>;
  achievements!: Table<Achievement>;

  constructor() {
    super('gymTrackerDB');
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