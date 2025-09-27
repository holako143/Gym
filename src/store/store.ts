import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import reminderReducer from './slices/reminderSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    reminders: reminderReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;