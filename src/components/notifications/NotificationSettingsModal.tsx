import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bell, ShieldCheck, Moon, Calendar, MessageSquare, 
  Sparkles, X, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { dispatchSystemPushNotification } from '../../services/unifiedNotificationService';
import { requestPushPermission, isPushPermissionGranted } from '../../utils/onesignal';

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

  const [hasPermission, setHasPermission] = useState<boolean>(() => isPushPermissionGranted());
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setHasPermission(isPushPermissionGranted());
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleKey = (key: keyof NotificationSettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(language === 'bn' ? 'সেটিংস সংরক্ষিত হয়েছে' : 'Settings saved');
  };

  const handleEnablePermissions = async () => {
    const granted = await requestPushPermission();
    setHasPermission(granted);
    if (granted) {
      toast.success(language === 'bn' ? '✅ পুশ নোটিফিকেশন সফলভাবে সক্রিয় হয়েছে!' : '✅ Push notifications enabled!');
    } else {
      toast.error(language === 'bn' ? 'ব্রাউজার সেটিংসে নোটিফিকেশন এলাউ করুন' : 'Please allow notifications in browser settings');
    }
  };

  // Test 1: Announcement Push
  const handleTestAnnouncement = async () => {
    setTesting(true);
    await dispatchSystemPushNotification({
      title: language === 'bn' ? "📢 নতুন মন্দির নোটিশ • সার্বিক সমন্বয়ক" : "📢 New Temple Notice • Coordinator",
      body: language === 'bn' ? "আজ রাত ৮:৩০ টায় মন্দির প্রাঙ্গণে বিশেষ সান্ধ্য সংকীর্তন ও ইস্টগোষ্ঠী অনুষ্ঠিত হবে।" : "Special evening Kirtan and meeting will be held at 8:30 PM in the temple hall.",
      url: '/#/announcements',
      tag: 'test-announcement'
    });
    toast.success(language === 'bn' ? '📢 টেস্ট নোটিশ পুশ পাঠানো হয়েছে!' : '📢 Test notice push sent!');
    setTesting(false);
  };

  // Test 2: Daily Seva Alert
  const handleTestSeva = async () => {
    setTesting(true);
    await dispatchSystemPushNotification({
      title: language === 'bn' ? "🌸 আজকের সেবা দায়িত্ব • শ্রীশ্রী রাধামাধব" : "🌸 Today's Seva Duty • Radha Madhava",
      body: language === 'bn' ? "আজ আপনার সেবা: সকালের মঙ্গলারতি ও ভোগ নিবেদন (Shift 1)\nসময়: ভোর ৪:৩০ - ৬:০০" : "Today your seva: Morning Mangala Arati & Offering (Shift 1)\nTime: 4:30 AM - 6:00 AM",
      url: '/#/service-cycle',
      tag: 'test-seva'
    });
    toast.success(language === 'bn' ? '🌸 টেস্ট সেবা পুশ পাঠানো হয়েছে!' : '🌸 Test seva alert push sent!');
    setTesting(false);
  };

  // Test 3: Next-Day Festival Alert
  const handleTestFestival = async () => {
    setTesting(true);
    await dispatchSystemPushNotification({
      title: language === 'bn' ? "🪷 আগামীকাল: পবিত্র ইন্দিরা একাদশী ব্রত" : "🪷 Tomorrow: Sacred Indira Ekadashi",
      body: language === 'bn' ? "সর্বপ্রকার শস্য বর্জনপূর্বক সজল/নির্জলা উপবাস পালন করুন।\nপারণ: পরদিন সকাল ০৫:৪৫ - ০৯:৩০" : "Fasting from grains and beans all day.\nParana: Next morning 5:45 AM - 9:30 AM",
      url: '/#/calendar',
      tag: 'test-festival'
    });
    toast.success(language === 'bn' ? '🪷 টেস্ট উৎসব পুশ পাঠানো হয়েছে!' : '🪷 Test festival push sent!');
    setTesting(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'নোটিফিকেশন ও পুশ অ্যালার্ট' : 'Push Notification Settings'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'দৈনিক সেবা, উৎসব ও নোটিশের হোয়াটসঅ্যাপ স্টাইল পুশ' : 'Instant WhatsApp-style lock-screen push alerts'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Permission Status Banner */}
        <div className="shrink-0">
          {!hasPermission ? (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <AlertCircle size={16} className="shrink-0" />
                <span className="text-xs font-bold leading-tight">
                  {language === 'bn' ? 'পুশ নোটিফিকেশন অনুমতি প্রয়োজন' : 'Push Notification Permission Required'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleEnablePermissions}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-black transition-all cursor-pointer shrink-0 shadow-xs"
              >
                {language === 'bn' ? 'এলাউ করুন' : 'Allow Push'}
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{language === 'bn' ? '✅ পুশ নোটিফিকেশন সফলভাবে সক্রিয় আছে' : '✅ Push Notifications are Active & Connected'}</span>
            </div>
          )}
        </div>

        {/* Settings List */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          
          {/* 1. Daily Seva Duty (Morning 6:00 AM) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-amber-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'আজকের সেবা দায়িত্ব (সকাল ৬:০০)' : 'Today\'s Seva Duty (6:00 AM)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'আজকের দায়িত্ব ও নির্দিষ্ট সময়সূচি অ্যালার্ট' : 'Morning reminder for today\'s seva assignment'}
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

          {/* 2. Tomorrow's Seva Preview (Night 9:00 PM) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Moon size={16} className="text-indigo-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'আগামীকালের সেবা পর্যালোচনা (রাত ৯:০০)' : 'Tomorrow\'s Seva Preview (9:00 PM)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'পরদিনের সেবা প্রস্তুতি ও শিফট প্রিভিউ' : 'Advance night reminder for tomorrow'}
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

          {/* 3. Ekadashi & Festival Reminders */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-rose-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'একাদশী ও আগামীকালের উৎসব' : 'Ekadashi & Next-Day Festivals'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'উপবাস নিয়ম, পারণ সময় ও মহোৎসবের আগের দিন অ্যালার্ট' : 'Fasting dates, parana times & next-day festivals'}
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

          {/* 4. Manager Announcements */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={16} className="text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ব্যবস্থাপনা নোটিশ (প্রকাশের সাথে সাথে)' : 'Manager Notices (Instant Broadcast)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'যেকোনো কর্মকর্তা নোটিশ প্রকাশ করা মাত্র নোটিফিকেশন' : 'Instant push notification whenever a notice is posted'}
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

          {/* 5. Weekly Sadhana Audit Deadline */}
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

        {/* 3 Dedicated Test Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {language === 'bn' ? '🔔 লাইভ পুশ টেস্ট করুন (৩টি মোড)' : '🔔 Test Live Push (3 Modes)'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={handleTestAnnouncement}
              disabled={testing}
              className="px-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 text-[10px] font-bold transition-all cursor-pointer truncate text-center shadow-xs"
              title="Test Instant Announcement Push"
            >
              📢 {language === 'bn' ? 'নোটিশ টেস্ট' : 'Notice'}
            </button>

            <button
              type="button"
              onClick={handleTestSeva}
              disabled={testing}
              className="px-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 text-[10px] font-bold transition-all cursor-pointer truncate text-center shadow-xs"
              title="Test Today's Seva Duty Push"
            >
              🌸 {language === 'bn' ? 'আজকের সেবা' : 'Seva Duty'}
            </button>

            <button
              type="button"
              onClick={handleTestFestival}
              disabled={testing}
              className="px-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 text-[10px] font-bold transition-all cursor-pointer truncate text-center shadow-xs"
              title="Test Tomorrow Festival Push"
            >
              🪷 {language === 'bn' ? 'উৎসব অ্যালার্ট' : 'Festival'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default NotificationSettingsModal;
