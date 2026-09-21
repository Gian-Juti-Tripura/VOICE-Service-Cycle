import { Capacitor } from '@capacitor/core';
import OneSignal from '@onesignal/capacitor-plugin';

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

const ONESIGNAL_APP_ID = "85c8aad6-6ade-4d30-a9fe-f0fdd9826937";

/**
 * Initialize OneSignal on both Native (Android/iOS) and Web (PWA / Browsers)
 */
export const initializeOneSignal = () => {
  if (Capacitor.isNativePlatform()) {
    try {
      OneSignal.initialize(ONESIGNAL_APP_ID);
      
      // Request permission to send push notifications
      OneSignal.Notifications.requestPermission(true).then((success: boolean) => {
        console.log("Native Push permission response:", success);
      });

      OneSignal.Notifications.addEventListener('click', (event: any) => {
        console.log('OneSignal native notification clicked:', event);
      });
    } catch (e) {
      console.error("Error initializing Native OneSignal:", e);
    }
  } else if (typeof window !== 'undefined') {
    // Web / PWA Push Initialization
    try {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignalWeb: any) {
        await OneSignalWeb.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/" },
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false, // We use custom in-app buttons & modals
          },
        });
        console.log("OneSignal Web Push initialized for PWA.");
      });
    } catch (e) {
      console.error("Error initializing OneSignal Web Push:", e);
    }
  }
};

/**
 * Explicitly prompt user for push notification permission (Web & Native)
 */
export const requestPushPermission = async (): Promise<boolean> => {
  if (Capacitor.isNativePlatform()) {
    try {
      return await OneSignal.Notifications.requestPermission(true);
    } catch (e) {
      console.error('Failed to request native push permission:', e);
      return false;
    }
  }

  // Web Browser / PWA
  if (typeof window !== 'undefined') {
    if (window.OneSignal) {
      try {
        await window.OneSignal.Notifications.requestPermission();
        return window.OneSignal.Notifications.permission;
      } catch {
        // Fallback to standard browser API
      }
    }

    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      } catch (e) {
        console.error('Browser notification permission error:', e);
        return false;
      }
    }
  }

  return false;
};

/**
 * Check if push notifications are allowed
 */
export const isPushPermissionGranted = (): boolean => {
  if (Capacitor.isNativePlatform()) {
    return true; // Let capacitor local notifications check permissions directly
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission === 'granted';
  }

  return false;
};

/**
 * Associate devotee metadata (tags) with OneSignal for targeted push messaging
 */
export const setDevoteePushTags = (tags: { email?: string; name?: string; role?: string; group?: string }) => {
  if (typeof window !== 'undefined' && window.OneSignal) {
    try {
      window.OneSignal.User.addTags(tags);
    } catch (e) {
      console.warn("Failed to set OneSignal tags:", e);
    }
  }
};

