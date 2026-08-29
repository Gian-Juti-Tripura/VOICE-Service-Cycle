/**
 * Android Tactile Haptic Feedback Engine
 * Leverages native Vibration API for crisp tactile confirmation
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'selection';

export const triggerHaptic = (type: HapticType = 'light') => {
  if (typeof window === 'undefined' || !navigator || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
      case 'selection':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(45);
        break;
      case 'success':
        navigator.vibrate([15, 35, 20]);
        break;
      case 'warning':
        navigator.vibrate([30, 45, 30]);
        break;
      default:
        navigator.vibrate(15);
    }
  } catch (e) {
    // Vibration failed or permission blocked by OS
  }
};
