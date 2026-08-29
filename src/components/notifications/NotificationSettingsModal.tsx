import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bell, ShieldCheck, Moon, Calendar, MessageSquare, 
  Sparkles, X, Smartphone
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationSettingsState {
  dailySeva: boolean;
  tomorrowSeva: boolean;
  ekadashi: boolean;
  announcements: boolean;
  sadhanaAudit: boolean;
  sound: boolean;
  vibrate: boolean;
}

const DEFAULT_SETTINGS: NotificationSettingsState = {
  dailySeva: true,
  tomorrowSeva: true,
  ekadashi: true,
  announcements: true,
  sadhanaAudit: true,
  sound: true,
  vibrate: true,
};

const STORAGE_KEY = 'advaita_voice_notification_settings_v1';

export const NotificationSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<NotificationSettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [testing, setTesting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  if (!isOpen) return null;

  const toggleKey = (key: keyof NotificationSettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(language === 'bn' ? 'সেটিংস সংরক্ষিত হয়েছে' : 'Settings saved');
  };

  const handleSendTestNotification = async () => {
    setTesting(true);
    try {
      if (Capacitor.isNativePlatform()) {
        let perm = await LocalNotifications.checkPermissions();
        if (perm.display !== 'granted') {
          perm = await LocalNotifications.requestPermissions();
        }
        if (perm.display === 'granted') {
          const fireDate = new Date();
          fireDate.setSeconds(fireDate.getSeconds() + 5);

          await LocalNotifications.schedule({
            notifications: [{
              id: Math.floor(fireDate.getTime() / 1000),
              title: "🌸 Advaita VOICE • Seva Alert",
              body: language === 'bn' 
                ? "হরেকৃষ্ণ! আপনার নোটিফিকেশন সিস্টেম সফলভাবে সক্রিয় আছে।" 
                : "Hare Krishna! Your notification system is active and connected.",
              schedule: { at: fireDate },
              smallIcon: "ic_stat_onesignal_default",
              sound: settings.sound ? "default" : undefined
            }]
          });
          toast.success(language === 'bn' 
            ? '৫ সেকেন্ডের মধ্যে পুশ নোটিফিকেশন পাঠানো হবে!' 
            : 'Push notification will arrive in 5 seconds!');
        } else {
          toast.error('Notification permission denied by device.');
        }
      } else {
        // Web Browser Notifications
        if ('Notification' in window) {
          let perm = Notification.permission;
          if (perm !== 'granted') {
            perm = await Notification.requestPermission();
          }
          if (perm === 'granted') {
            new Notification("🌸 Advaita VOICE • Seva Alert", {
              body: language === 'bn'
                ? "হরেকৃষ্ণ! ওয়েব ও মোবাইল নোটিফিকেশন সক্রিয় আছে।"
                : "Hare Krishna! Live Web & Device Notifications are active and connected.",
              icon: "/favicon.svg"
            });
            toast.success(language === 'bn' ? 'টেস্ট নোটিফিকেশন পাঠানো হয়েছে!' : 'Test notification triggered!');
          } else {
            toast.error('Web notification permission denied in browser.');
          }
        } else {
          toast.success(language === 'bn' ? 'টেস্ট নোটিফিকেশন সক্রিয়!' : 'Test notification active!');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not schedule test notification');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'নোটিফিকেশন ও অ্যালার্ট সেটিংস' : 'Notification Settings'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'দৈনিক সেবা, একাদশী ও সাধনা অ্যালার্ট কাস্টমাইজ করুন' : 'Manage your seva duty, Ekadashi, and audit alerts'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live System Connectivity Badge */}
        <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="flex-1">
            <strong className="block font-bold">
              {language === 'bn' ? 'সিস্টেম কানেকশন স্ট্যাটাস: সক্রিয়' : 'System Connection: Active & Linked'}
            </strong>
            <span className="text-[10.5px] opacity-90">
              {language === 'bn' ? 'সেবাক্রম, একাদশী পঞ্জিকা ও ইনচার্জ নোটিশের সাথে সংযুক্ত।' : 'Linked to Service Cycle, Vaishnava Calendar & Notices.'}
            </span>
          </div>
        </div>

        {/* Toggle List */}
        <div className="space-y-3">
          
          {/* 1. Daily Seva Duty (Morning 6:00 AM) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-amber-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'আজকের দৈনিক সেবা অ্যালার্ট (সকাল ৬:০০)' : 'Today\'s Seva Duty Alert (Morning 6:00 AM)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'আজকের নির্ধারিত সেবার বিবরণ ও সময়সূচি' : 'Morning 6:00 AM notification with duty details'}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleKey('dailySeva')}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${settings.dailySeva ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.dailySeva ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* 2. Tomorrow's Seva Advance Reminder (Night 9:00 PM) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Moon size={16} className="text-indigo-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'আগামীকালের সেবা আগাম অ্যালার্ট (রাত ৯:০০)' : 'Tomorrow\'s Seva Advance Alert (Night 9:00 PM)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'রাতেই জেনে নিন আগামীকালের সেবা ও প্রস্তুতির তথ্য' : 'Night 9:00 PM reminder to prepare for tomorrow\'s duty'}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleKey('tomorrowSeva')}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${settings.tomorrowSeva ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.tomorrowSeva ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* 2. Ekadashi & Festival Reminders */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-rose-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'একাদশী ও মহোৎসব উপবাসের অ্যালার্ট' : 'Ekadashi & Festival Alerts'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'উপবাসের আগের দিন ও পারণ সময়সূচি' : '1-day prior warning & fasting morning schedule'}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleKey('ekadashi')}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${settings.ekadashi ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.ekadashi ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* 3. Incharge Announcements */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={16} className="text-indigo-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ইনচার্জ জরুরি নোটিশ ও স্টাডি কেয়ার' : 'Incharge Notices & Study Care'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'ক্যাম্পাস কার্যক্রম ও নতুন জরুরি বিজ্ঞপ্তি' : 'Instant broadcast of new incharge notices'}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleKey('announcements')}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${settings.announcements ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.announcements ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* 4. Weekly Sadhana Audit Deadline */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-purple-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'সাপ্তাহিক সাধনাপত্র জমা (শুক্রবার ৮:০০ PM)' : 'Sadhana Audit Reminder (Fri 8:00 PM)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'কাউন্সেলরকে সাধনাপত্র জমার রিমাইন্ডার' : 'Audit deadline reminder for counsellees'}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleKey('sadhanaAudit')}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${settings.sadhanaAudit ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.sadhanaAudit ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSendTestNotification}
            disabled={testing}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Smartphone size={14} />
            <span>{testing ? 'Sending...' : (language === 'bn' ? '🔔 টেস্ট পুশ পাঠান' : '🔔 Test Push Now')}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationSettingsModal;
