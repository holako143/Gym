import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ReminderSettings } from '../../db';

export const ReminderType = {
  WATER_BREAK: "💧 وقت شرب الماء",
  SET_TRANSITION: "🔄 بدء الجلسة التالية",
  EXERCISE_SWITCH: "➡️ الانتقال للتمرين التالي",
  FORM_CHECK: "📐 مراجعة الوضعية",
} as const;

export type ReminderType = typeof ReminderType[keyof typeof ReminderType];


export interface ActiveReminder {
  id: string; // Unique ID for the reminder, e.g., timestamp
  type: ReminderType;
  message: string;
  triggeredAt: number; // timestamp
}

interface ReminderState {
  settings: ReminderSettings | null;
  activeReminders: ActiveReminder[];
}

const initialState: ReminderState = {
  settings: null,
  activeReminders: [],
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminderSettings(state, action: PayloadAction<ReminderSettings>) {
      state.settings = action.payload;
    },
    addActiveReminder(state, action: PayloadAction<Omit<ActiveReminder, 'id' | 'triggeredAt'>>) {
      const newReminder: ActiveReminder = {
        ...action.payload,
        id: new Date().toISOString(),
        triggeredAt: Date.now(),
      };
      state.activeReminders.push(newReminder);
    },
    removeActiveReminder(state, action: PayloadAction<string>) {
      state.activeReminders = state.activeReminders.filter(
        (reminder) => reminder.id !== action.payload
      );
    },
    clearActiveReminders(state) {
        state.activeReminders = [];
    }
  },
});

export const {
  setReminderSettings,
  addActiveReminder,
  removeActiveReminder,
  clearActiveReminders,
} = reminderSlice.actions;

export default reminderSlice.reducer;