import { store } from '../store/store';
import { addActiveReminder, ReminderType } from '../store/slices/reminderSlice';
import type { ReminderSettings } from '../db';
import { alertService } from './AlertService';

class ReminderService {
  private dispatch: typeof store.dispatch;
  private hydrationIntervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.dispatch = store.dispatch;
  }

  // Call this when rest period starts
  public triggerSetTransitionReminder(restSeconds: number, settings: ReminderSettings['setTransition']) {
    if (!settings.enabled) return;

    setTimeout(() => {
      this.dispatch(
        addActiveReminder({
          type: ReminderType.SET_TRANSITION,
          message: "Time for the next set!",
        })
      );

      if (settings.sound) {
        alertService.playBeep();
      }
      if (settings.vibration) {
        alertService.vibrate([200, 100, 200]); // Vibrate pattern
      }

    }, restSeconds * 1000);
  }

  // Call this when a workout starts
  public startHydrationTimer(settings: ReminderSettings['hydration']) {
    if (!settings.enabled || this.hydrationIntervalId) return;

    const intervalMilliseconds = settings.interval * 60 * 1000;

    this.hydrationIntervalId = setInterval(() => {
      this.dispatch(
        addActiveReminder({
          type: ReminderType.WATER_BREAK,
          message: `Time for a water break! Drink up.`,
        })
      );
      // For hydration, let's use a simpler alert.
      alertService.playBeep();
      alertService.vibrate();

    }, intervalMilliseconds);
  }

  // Call this when a workout ends
  public stopHydrationTimer() {
    if (this.hydrationIntervalId) {
      clearInterval(this.hydrationIntervalId);
      this.hydrationIntervalId = null;
    }
  }
}

// Export a singleton instance of the service
export const reminderService = new ReminderService();