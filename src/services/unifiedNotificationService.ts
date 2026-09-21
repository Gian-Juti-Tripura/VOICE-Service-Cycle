import { supabase } from '../supabase/supabaseClient';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { localDb } from '../utils/localDb';
import { calculateDailyAssignments } from '../utils/cycleEngine';
import { CALENDAR_2026_DATA } from '../data/calendar2026Data';
import { addStoredNotice, type ManagerAnnouncement } from '../utils/noticesStore';

/**
 * Synthesize a clean, pleasant sacred chime using Web Audio API (Zero external MP3 dependencies)
 */
export const playDevotionalChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    
    // First bell tone (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // Second harmonic bell tone (1320 Hz - E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 1.2);
  } catch (e) {
    // AudioContext autoplay restrictions handled silently
  }
};

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Dispatch Lock-Screen / System Push Notification (PWA Web + Native Capacitor)
 */
export const dispatchSystemPushNotification = async (payload: PushNotificationPayload) => {
  const { title, body, icon = '/logo.png', url = '/#/', tag = 'voice-hub-notif' } = payload;

  // 1. Play auditory chime
  playDevotionalChime();

  // 2. Native Capacitor Android/iOS background push
  if (Capacitor.isNativePlatform()) {
    try {
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        perm = await LocalNotifications.requestPermissions();
      }
      if (perm.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [{
            id: Math.floor(Date.now() / 1000) % 1000000,
            title,
            body,
            schedule: { at: new Date(Date.now() + 200) },
            smallIcon: "ic_stat_onesignal_default",
            sound: "default"
          }]
        });
        return;
      }
    } catch (e) {
      console.error('Capacitor local notification error:', e);
    }
  }

  // 3. Web PWA Service Worker Push (Shows system banner like WhatsApp/Telegram)
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      let perm = Notification.permission;
      if (perm !== 'granted') {
        perm = await Notification.requestPermission();
      }

      if (perm === 'granted') {
        let reg: ServiceWorkerRegistration | null | undefined = null;

        if ('serviceWorker' in navigator) {
          try {
            reg = await navigator.serviceWorker.getRegistration();
            if (!reg) {
              reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            }
          } catch (swErr) {
            console.warn('ServiceWorker get/register error:', swErr);
          }
        }

        // On Android Chrome, showNotification via ServiceWorker is strictly required
        if (reg && 'showNotification' in reg) {
          await reg.showNotification(title, {
            body,
            icon,
            badge: '/logo.png',
            tag,
            renotify: true,
            vibrate: [200, 100, 200, 100, 200],
            data: { url }
          } as any);
          return;
        }

        // Fallback for desktop browsers
        try {
          new Notification(title, {
            body,
            icon,
            tag
          });
        } catch (notifErr) {
          console.warn('Standard Notification constructor fallback failed:', notifErr);
        }
      } else {
        console.warn('Notification permission is not granted:', perm);
      }
    } catch (e) {
      console.error('Web notification dispatch error:', e);
    }
  }
};

/**
 * Cache for self-published announcements to avoid echoing back
 */
let lastSelfPublishedId = '';

/**
 * Listen to Supabase Realtime for instant announcement broadcasts from any manager/admin
 */
let realtimeChannelSubscribed = false;

export const initRealtimeAnnouncementListener = () => {
  if (realtimeChannelSubscribed || typeof window === 'undefined') return;
  realtimeChannelSubscribed = true;

  try {
    const channel = supabase
      .channel('public:announcements_realtime_broadcast')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        async (payload) => {
          const row = payload.new as any;
          if (!row) return;

          // Skip if self published in the last 3 seconds
          if (row.id === lastSelfPublishedId) return;

          const title = row.title_bn || row.title_en || '📢 নতুন আশ্রম নোটিশ';
          const body = row.desc_bn || row.desc_en || 'বিস্তারিত দেখতে ট্যাপ করুন।';

          // Fire system push banner & audio
          await dispatchSystemPushNotification({
            title: `📢 ${title}`,
            body,
            url: '/#/announcements',
            tag: 'voice-announcement-' + row.id
          });

          // Sync local notices store and update navbar badge
          window.dispatchEvent(new Event('advaita_notices_updated'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      realtimeChannelSubscribed = false;
    };
  } catch (e) {
    console.warn('Realtime announcement listener setup error:', e);
  }
};

/**
 * Publish an announcement to both local state and Supabase Realtime for instant broadcast to all devotees
 */
export const broadcastAnnouncement = async (
  noticeData: Omit<ManagerAnnouncement, 'id' | 'date'>
): Promise<ManagerAnnouncement> => {
  // 1. Store in local state
  const stored = addStoredNotice(noticeData);
  lastSelfPublishedId = stored.id;

  // 2. Dispatch local notification confirmation
  dispatchSystemPushNotification({
    title: `📢 ${noticeData.titleBn || noticeData.titleEn}`,
    body: noticeData.descBn || noticeData.descEn,
    url: '/#/announcements',
    tag: 'voice-announcement-self'
  });

  // 3. Publish to Supabase Realtime table (broadcasts to all other phones & computers)
  try {
    const { data } = await supabase
      .from('announcements')
      .insert({
        title_en: noticeData.titleEn,
        title_bn: noticeData.titleBn,
        desc_en: noticeData.descEn + (noticeData.actionRequiredEn ? ` • Action: ${noticeData.actionRequiredEn}` : ''),
        desc_bn: noticeData.descBn + (noticeData.actionRequiredBn ? ` • নির্দেশ: ${noticeData.actionRequiredBn}` : ''),
        type: 'ANNOUNCEMENT',
        is_pinned: noticeData.priority === 'HIGH'
      })
      .select()
      .single();

    if (data?.id) {
      lastSelfPublishedId = data.id;
    }
  } catch (e) {
    console.warn('Failed to publish announcement to Supabase (offline fallback retained):', e);
  }

  return stored;
};

/**
 * Check and alert daily Seva Duty for logged-in devotee
 */
export const checkAndAlertDailySeva = async (userId: string) => {
  if (!userId) return;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const lastAlertedDate = localStorage.getItem('advaita_last_seva_duty_alert_date');

  // Only alert once per day
  if (lastAlertedDate === todayStr) return;

  try {
    const allMembers = await localDb.getMembers();
    const myMember = allMembers.find(m => m.userId === userId || m.id === userId);
    if (!myMember) return;

    const allServices = await localDb.getServices();
    const overrides = await localDb.getOverridesByDateRange([todayStr]);
    const dayOverrides = overrides.filter(o => o.dateStr === todayStr || o.dateStr === 'CONTINUOUS');

    const assignments = calculateDailyAssignments(today, allMembers, allServices, dayOverrides);
    const myAssignment = assignments.find(a => a.member.id === myMember.id);

    if (myAssignment) {
      const serviceNameBn = myAssignment.service.nameBn;
      const serviceNameEn = myAssignment.service.nameEn;
      const timing = myAssignment.service.timing || 'সারাদিন';

      await dispatchSystemPushNotification({
        title: `🌸 আজকের সেবা দায়িত্ব • ${myMember.fullName}`,
        body: `আজ আপনার সেবা: ${serviceNameBn} (${serviceNameEn})\nসময়সূচি: ${timing}`,
        url: '/#/service-cycle',
        tag: `voice-seva-${todayStr}`
      });

      localStorage.setItem('advaita_last_seva_duty_alert_date', todayStr);
    }
  } catch (e) {
    console.warn('Error checking daily seva duty:', e);
  }
};

/**
 * Check and alert upcoming festivals & Ekadashi (Next Day Reminders)
 */
export const checkAndAlertNextDayFestivals = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const lastAlertedDate = localStorage.getItem('advaita_last_festival_alert_date');
  if (lastAlertedDate === tomorrowStr) return;

  try {
    const event = CALENDAR_2026_DATA.find(ev => ev.date === tomorrowStr);
    if (event) {
      const isEkadashi = event.type === 'EKADASHI';
      const title = isEkadashi 
        ? `🌙 আগামীকাল: ${event.nameBn} (${event.nameEn})`
        : `🪷 আগামীকাল মহোৎসব: ${event.nameBn} (${event.nameEn})`;
      
      const body = `${event.fastingBn || event.fastingEn}\n${event.paranaBn ? `পারণ: ${event.paranaBn}` : ''}`;

      await dispatchSystemPushNotification({
        title,
        body,
        url: '/#/calendar',
        tag: `voice-festival-${tomorrowStr}`
      });

      localStorage.setItem('advaita_last_festival_alert_date', tomorrowStr);
    }
  } catch (e) {
    console.warn('Error checking upcoming festivals:', e);
  }
};
