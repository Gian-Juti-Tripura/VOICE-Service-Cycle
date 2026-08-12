import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { localDb } from './localDb';
import { calculateDailyAssignments } from './cycleEngine';

// How many days into the future to schedule notifications
const SCHEDULE_DAYS = 14;

export const scheduleDailyNotifications = async (userId: string) => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Local notifications only supported on native devices.");
    return;
  }

  try {
    // Request permission if not already granted
    let permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display !== 'granted') {
      permStatus = await LocalNotifications.requestPermissions();
    }
    if (permStatus.display !== 'granted') {
      console.warn("Local notification permission denied.");
      return;
    }

    // Clear all previously scheduled notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    // Fetch data
    const allMembers = await localDb.getMembers();
    const myMember = allMembers.find(m => m.userId === userId);
    
    // If the logged in user is not linked to a member profile, don't schedule
    if (!myMember) {
      console.log("No member profile linked. Cannot schedule daily service notifications.");
      return;
    }

    const allServices = await localDb.getServices();

    // Prepare date ranges
    const dateStrs: string[] = [];
    const targetDates: Date[] = [];
    
    for (let i = 0; i < SCHEDULE_DAYS; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dateStrs.push(d.toISOString().split('T')[0]);
      
      const tDate = new Date(d);
      tDate.setHours(0, 0, 0, 0);
      targetDates.push(tDate);
    }

    // Fetch overrides for the whole range
    const overrides = await localDb.getOverridesByDateRange(dateStrs);

    const notificationsToSchedule = [];

    // Calculate assignments for each day
    for (let i = 0; i < targetDates.length; i++) {
      const targetDate = targetDates[i];
      const targetDateStr = targetDate.toISOString().split('T')[0];
      
      const dayOverrides = overrides.filter(o => o.dateStr === targetDateStr || o.dateStr === 'CONTINUOUS');
      
      const assignments = calculateDailyAssignments(targetDate, allMembers, allServices, dayOverrides);
      
      // Filter for assignments specifically for THIS member
      const myAssignments = assignments.filter(a => a.member.id === myMember.id);
      
      if (myAssignments.length > 0) {
        const serviceNames = myAssignments.map(a => {
          let text = a.service.nameEn;
          if (a.isAbsent) {
            text += " (Absent)";
          } else if (a.isReplacementFor) {
            text += ` (+ Replacement for ${a.isReplacementFor.fullName})`;
          }
          return text;
        });
        
        const servicesString = serviceNames.join(" & ");

        // 1. Schedule 6:00 AM notification for the morning of the service
        const today6AM = new Date(targetDate);
        today6AM.setHours(6, 0, 0, 0);
        
        if (today6AM.getTime() > new Date().getTime()) {
          notificationsToSchedule.push({
            id: Math.floor(today6AM.getTime() / 1000), // unique ID based on timestamp
            title: "Hare Krishna!",
            body: `Today your service is: ${servicesString}`,
            schedule: { at: today6AM, allowWhileIdle: true },
            smallIcon: "ic_stat_onesignal_default", 
            sound: "default"
          });
        }

        // 2. Schedule 8:00 PM notification for the night before the service
        const prevDay8PM = new Date(targetDate);
        prevDay8PM.setDate(prevDay8PM.getDate() - 1);
        prevDay8PM.setHours(20, 0, 0, 0);
        
        if (prevDay8PM.getTime() > new Date().getTime()) {
          notificationsToSchedule.push({
            id: Math.floor(prevDay8PM.getTime() / 1000) + 1, // unique ID based on timestamp (+1 to avoid collisions)
            title: "Hare Krishna!",
            body: `Tomorrow your service is: ${servicesString}`,
            schedule: { at: prevDay8PM, allowWhileIdle: true },
            smallIcon: "ic_stat_onesignal_default", 
            sound: "default"
          });
        }
      }
    }

    if (notificationsToSchedule.length > 0) {
      await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      console.log(`Successfully scheduled ${notificationsToSchedule.length} local notifications.`);
    }

  } catch (error) {
    console.error("Error scheduling local notifications:", error);
  }
};
