import { Capacitor } from '@capacitor/core';
import OneSignal from '@onesignal/capacitor-plugin';

export const initializeOneSignal = () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const appId = "85c8aad6-6ade-4d30-a9fe-f0fdd9826937";
      OneSignal.initialize(appId);
      
      // Request permission to send push notifications
      OneSignal.Notifications.requestPermission(true).then((success: boolean) => {
        console.log("Push permission prompt response: ", success);
      });

      // You can also listen to notification click events here if needed
      OneSignal.Notifications.addEventListener('click', (event: any) => {
        console.log('OneSignal notification clicked:', event);
      });
    } catch (e) {
      console.error("Error initializing OneSignal:", e);
    }
  } else {
    console.log("OneSignal push notifications are not initialized because we are not running natively.");
  }
};
