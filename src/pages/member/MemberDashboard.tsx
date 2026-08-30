import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bell, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../utils/localDb';
import { useSupabaseSync } from '../../hooks/useSupabaseSync';
import type { Member, DailyAssignment } from '../../types';
import { calculateDailyAssignments } from '../../utils/cycleEngine';

import { LocalNotifications } from '@capacitor/local-notifications';

const MemberDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [myMember, setMyMember] = useState<Member | null>(null);
  const [unlinkedMembers, setUnlinkedMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [phonePin, setPhonePin] = useState('');
  const [linking, setLinking] = useState(false);
  
  const [todayAssignments, setTodayAssignments] = useState<DailyAssignment[]>([]);
  const [tomorrowAssignments, setTomorrowAssignments] = useState<DailyAssignment[]>([]);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const todayStr = todayDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const handleTestNotification = async () => {
    try {
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        permStatus = await LocalNotifications.requestPermissions();
      }
      if (permStatus.display !== 'granted') {
        alert("Notification permission denied!");
        return;
      }
      
      const fireDate = new Date();
      fireDate.setSeconds(fireDate.getSeconds() + 10);
      
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.floor(fireDate.getTime() / 1000),
          title: "Advaita VOICE Seva Alert",
          body: "It works! Your daily seva notifications are ready.",
          schedule: { at: fireDate },
          smallIcon: "ic_stat_onesignal_default",
          sound: "default"
        }]
      });
      alert("Test notification scheduled! Please MINIMIZE the app now and wait 10 seconds.");
    } catch (err) {
      console.error(err);
      alert("Error scheduling test notification.");
    }
  };

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const todayIso = todayDate.toISOString().split('T')[0];
      const tomorrowIso = tomorrowDate.toISOString().split('T')[0];

      const [allMembers, allServices, todayOverrides, tomorrowOverrides] = await Promise.all([
        localDb.getMembers(),
        localDb.getServices(),
        localDb.getOverridesByDate(todayIso),
        localDb.getOverridesByDate(tomorrowIso)
      ]);

      const overrides = [...todayOverrides, ...tomorrowOverrides];

      // Find my member record
      const me = allMembers.find(m => m.userId === user.id) || null;
      setMyMember(me);

      if (!me) {
        setUnlinkedMembers(allMembers.filter(m => !m.userId));
      }

      if (me) {
        const todayOverrides = overrides.filter(o => o.dateStr === todayIso);
        const tomorrowOverrides = overrides.filter(o => o.dateStr === tomorrowIso);

        const allToday = calculateDailyAssignments(todayDate, allMembers, allServices, todayOverrides);
        const allTomorrow = calculateDailyAssignments(tomorrowDate, allMembers, allServices, tomorrowOverrides);

        // Filter for my assignments (either assigned to me, or I am replacing someone)
        const myToday = allToday.filter(a => a.member.id === me.id);
        const myTomorrow = allTomorrow.filter(a => a.member.id === me.id);

        setTodayAssignments(myToday);
        setTomorrowAssignments(myTomorrow);
      }
    } catch (err) {
      console.error("Error loading member data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useSupabaseSync(['members', 'services', 'assignment_overrides'], () => {
    loadData();
  });

  const handleLinkAccount = async () => {
    if (!selectedMemberId || !user) return;
    setLinking(true);
    try {
      const memberToLink = unlinkedMembers.find(m => m.id === selectedMemberId);
      if (memberToLink) {
        if (!memberToLink.phone || memberToLink.phone.trim() === '') {
          alert('This member profile does not have a phone number set. Please contact a manager to set it before you can link.');
          setLinking(false);
          return;
        }
        
        const normalizePhone = (phone: string) => {
          const digitsOnly = phone.replace(/\D/g, '');
          return digitsOnly.slice(-10);
        };

        const targetPhone = normalizePhone(memberToLink.phone);
        const enteredPhone = normalizePhone(phonePin);

        if (targetPhone !== enteredPhone || targetPhone === '') {
          alert('Incorrect Phone Number PIN. Please try again.');
          setLinking(false);
          return;
        }

        memberToLink.userId = user.id;
        memberToLink.updatedAt = new Date().toISOString();
        await localDb.saveMembers([memberToLink]);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to link account');
      setLinking(false);
    }
  };

  const renderAssignmentCard = (assignment: DailyAssignment) => {
    const serviceNameRaw = language === 'bn' ? assignment.service.nameBn : assignment.service.nameEn;
    const serviceDesc = language === 'bn' ? assignment.service.descBn : assignment.service.descEn;
    
    const parts = serviceNameRaw.split(' (+ ');
    const mainName = parts[0];
    const absentDetail = parts.length > 1 ? `(+ ${parts[1]}` : null;
    
    let statusBadge = null;
    if (assignment.isAbsent) {
      statusBadge = (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>{language === 'bn' ? 'অনুপস্থিত' : 'Absent'}</span>
        </span>
      );
    } else if (assignment.isReplacementFor) {
      statusBadge = (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{language === 'bn' ? 'প্রতিস্থাপন সেবা' : 'Replacement'}</span>
        </span>
      );
    } else {
      statusBadge = (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>{language === 'bn' ? 'সক্রিয় সেবা' : 'Active'}</span>
        </span>
      );
    }

    return (
      <div 
        key={assignment.service.id} 
        className="rounded-2xl p-5 bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 shadow-xs hover:shadow-md transition-all mb-4 space-y-3"
      >
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
            <span className="text-amber-600 dark:text-amber-400 font-mono font-bold mr-2 block sm:inline">
              Service {assignment.service.id}:
            </span>
            {mainName}
          </h3>
          <div className="shrink-0">
            {statusBadge}
          </div>
        </div>
        
        {absentDetail && (
          <div>
            <span className="inline-block text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800">
              {absentDetail}
            </span>
          </div>
        )}
        
        {assignment.isReplacementFor && (
          <div className="inline-block bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-2.5 py-1">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {language === 'bn' 
                ? `অতিরিক্ত সেবা (${assignment.isReplacementFor.fullName}-এর পরিবর্তে)`
                : `Extra Duty (Replacement for ${assignment.isReplacementFor.fullName})`}
            </p>
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {serviceDesc}
        </p>
        
        <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl flex items-center gap-2 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-bold">
          <Clock size={14} className="text-amber-500 shrink-0" />
          <span>{assignment.service.timing}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        <ServiceCycleHeader />
        
        {/* Hero Greeting Box (Unified Royal Saffron & Slate Luxury Theme) */}
        <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white shadow-xl border border-white/15">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10.5px] font-extrabold uppercase tracking-wider border border-white/15">
              <Sparkles size={12} className="text-amber-400" />
              <span>Advaita VOICE • University of Chittagong</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t('member.greeting')}
            </h1>
            
            <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
              {todayStr}
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2.5 justify-center sm:justify-start">
              <Link 
                to="/manager" 
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Calendar size={14} className="text-amber-300" />
                <span>{language === 'bn' ? 'সম্পূর্ণ সেবা সূচি দেখুন' : 'View Full Schedule'}</span>
              </Link>
              <button 
                onClick={handleTestNotification} 
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                <Bell size={14} className="text-slate-950" />
                <span>{language === 'bn' ? 'টেস্ট নোটিফিকেশন' : 'Test Notification'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Claim Section (If unlinked resident student) */}
        {!myMember && !loading && (
          <div className="space-y-6">
            
            {/* Guest / External Student Welcome Banner */}
            <div className="rounded-[28px] p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-lg">
                    {user?.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || (language === 'bn' ? 'সম্মানিত অতিথি ভক্ত' : 'Guest Devotee')}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {language === 'bn' ? 'আইওয়াইএফ যুব শিক্ষার্থী / অতিথি' : 'IYF Youth Student / Guest'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 font-bold">
                    {user?.email}
                  </span>
                </div>
              </div>

              {/* Guest Quick Resource Cards */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <Link
                  to="/camps"
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {language === 'bn' ? 'ইউথ ক্যাম্প ও রিট্রিট' : 'Youth Retreats'}
                    </span>
                    <span className="text-xs text-amber-500">→</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {language === 'bn' ? 'আসন্ন ক্যাম্পের শিডিউল ও অনলাইন বুকিং' : 'View upcoming camps & registrations'}
                  </p>
                </Link>

                <Link
                  to="/courses"
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {language === 'bn' ? 'গীতা ও ডিওয়াইএস কোর্স' : 'Gita & DYS Courses'}
                    </span>
                    <span className="text-xs text-orange-500">→</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {language === 'bn' ? 'কোর্স কারিকুলাম ও সার্টিফিকেট' : 'Spiritual courses & certification'}
                  </p>
                </Link>

                <Link
                  to="/sadhana"
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {language === 'bn' ? 'দৈনিক সাধনা ট্র্যাকার' : 'Daily Sadhana'}
                    </span>
                    <span className="text-xs text-emerald-500">→</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {language === 'bn' ? 'জপ, শাস্ত্রপাঠ ও শ্রবণ হিসেব রাখুন' : 'Log daily japa & reading progress'}
                  </p>
                </Link>
              </div>

              {/* Collapsible Resident Student Link Card */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <details className="group cursor-pointer">
                  <summary className="text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center justify-between select-none">
                    <span>
                      {language === 'bn' 
                        ? '🏠 আপনি কি ভয়েস আশ্রমের ১২ জন আবাসিক শিক্ষার্থীর একজন? সেবা একাউন্ট লিংক করুন' 
                        : '🏠 Are you one of the 12 resident ashram students? Link your seva profile'}
                    </span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>

                  <div className="pt-3 max-w-md space-y-3">
                    <select 
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      disabled={linking}
                    >
                      <option value="">{language === 'bn' ? '-- আপনার নাম বেছে নিন --' : '-- Select your resident name --'}</option>
                      {unlinkedMembers.sort((a, b) => a.cycleOrder - b.cycleOrder).map(m => (
                        <option key={m.id} value={m.id}>{m.fullName}</option>
                      ))}
                    </select>
                    
                    {selectedMemberId && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {language === 'bn' ? 'ফোন নম্বর দিয়ে পরিচয় নিশ্চিত করুন' : 'Verify Identity (Phone PIN)'}
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="password" 
                            placeholder="Enter registered phone number"
                            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                            value={phonePin}
                            onChange={(e) => setPhonePin(e.target.value)}
                          />
                          <button
                            onClick={handleLinkAccount}
                            disabled={linking || !phonePin}
                            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
                          >
                            {linking ? 'Linking...' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              </div>

            </div>
          </div>
        )}

        {/* Daily Service Cards Grid (For Linked Resident Members) */}
        {myMember && (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Today's Service Card */}
            <div className="rounded-[28px] p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-500" />
                  <span>{t('member.todayService')}</span>
                </h2>
                <span className="text-[11px] font-bold text-slate-400 font-mono">
                  {todayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              
              {loading ? (
                <p className="text-slate-400 text-xs text-center py-8">Loading...</p>
              ) : todayAssignments.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">
                    {language === 'bn' ? 'আজ আপনার কোনো নির্ধারিত সেবা নেই।' : 'No services assigned for today.'}
                  </p>
                </div>
              ) : (
                <div>{todayAssignments.map(renderAssignmentCard)}</div>
              )}
            </div>

            {/* Tomorrow's Service Card */}
            <div className="rounded-[28px] p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar size={18} className="text-amber-500" />
                  <span>{t('member.tomorrowService')}</span>
                </h2>
                <span className="text-[11px] font-bold text-slate-400 font-mono">
                  {tomorrowDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              
              {loading ? (
                <p className="text-slate-400 text-xs text-center py-8">Loading...</p>
              ) : tomorrowAssignments.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">
                    {language === 'bn' ? 'আগামীকাল আপনার কোনো নির্ধারিত সেবা নেই।' : 'No services assigned for tomorrow.'}
                  </p>
                </div>
              ) : (
                <div>{tomorrowAssignments.map(renderAssignmentCard)}</div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MemberDashboard;

