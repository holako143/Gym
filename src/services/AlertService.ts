class AlertService {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser.");
        return null;
      }
    }
    return this.audioContext;
  }

  public playBeep() {
    const context = this.getContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 pitch
    gainNode.gain.setValueAtTime(0.5, context.currentTime);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.2); // Beep for 0.2 seconds
  }

  public vibrate(pattern: number | number[] = 200) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.error("Vibration failed.", e);
      }
    }
  }
}

export const alertService = new AlertService();