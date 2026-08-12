import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [isGuest, setIsGuest] = useState(false);
  
  const [todayAssignments, setTodayAssignments] = useState<DailyAssignment[]>([]);
  const [tomorrowAssignments, setTomorrowAssignments] = useState<DailyAssignment[]>([]);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const todayStr = todayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

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
          title: "Test Notification",
          body: "It works! Your daily notifications will work offline too.",
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
          return digitsOnly.slice(-10); // Match on last 10 digits to handle +880, 0, etc.
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
          Absent
        </span>
      );
    } else if (assignment.isReplacementFor) {
      statusBadge = (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          Replacement
        </span>
      );
    } else {
      statusBadge = (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          Active
        </span>
      );
    }

    return (
      <div key={assignment.service.id} className="bg-white/50 rounded-xl p-5 border border-slate-100/50 hover:bg-white/80 transition-colors shadow-sm mb-4">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            <span className="text-indigo-600 mr-2 block sm:inline">Service {assignment.service.id}:</span>
            {mainName}
          </h3>
          <div className="shrink-0 ml-3">
            {statusBadge}
          </div>
        </div>
        
        {absentDetail && (
          <div className="mb-2">
            <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
              {absentDetail}
            </span>
          </div>
        )}
        
        {assignment.isReplacementFor && (
          <div className="mb-3 inline-block bg-amber-50/80 border border-amber-200/60 rounded px-2 py-1">
            <p className="text-xs font-bold text-amber-700">
              Extra Duty (Replacement for {assignment.isReplacementFor.fullName})
            </p>
          </div>
        )}

        <p className="text-sm text-slate-500 mb-4 mt-2">{serviceDesc}</p>
        
        <div className="bg-slate-50/50 p-3 rounded-lg flex items-center gap-2 border border-slate-100">
          <span className="opacity-70">🕒</span>
          <span className="text-sm font-medium text-slate-700">{assignment.service.timing}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto" style={{ padding: '2rem 1rem' }}>
      
      <div className="flex flex-col items-center justify-center mb-8 animate-fade-in bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg border border-indigo-500/20">
        <h1 className="text-2xl font-bold mb-2 text-indigo-50">{t('member.greeting')}</h1>
        <p className="text-indigo-200/80 font-medium tracking-wide">{todayStr}</p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/manager" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-lg font-medium transition-all">
            <span>📅</span> View Full Schedule
          </Link>
          <button onClick={handleTestNotification} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white border border-amber-400 px-6 py-2.5 rounded-lg font-medium transition-all">
            <span>🔔</span> Test Notification
          </button>
        </div>
      </div>

      {!myMember && !loading && !isGuest && (
        <div className="glass-card mb-8 p-6 lg:p-8 border-l-4 border-l-indigo-500">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Claim Your Profile</h2>
          <p className="text-slate-600 mb-6">Your account hasn't been linked to a member profile yet. Please select your name from the list below to link your account and view your assignments.</p>
          
          <div className="max-w-md flex flex-col gap-3">
            <select 
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/50"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              disabled={linking}
            >
              <option value="">-- Select your name --</option>
              {unlinkedMembers.sort((a, b) => a.cycleOrder - b.cycleOrder).map(m => (
                <option key={m.id} value={m.id}>{m.fullName}</option>
              ))}
            </select>
            
            {selectedMemberId && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1">Verify Identity</label>
                <input 
                  type="tel"
                  placeholder="Enter the phone number for this profile"
                  value={phonePin}
                  onChange={(e) => setPhonePin(e.target.value)}
                  disabled={linking}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/50 mb-3"
                />
              </div>
            )}
            
            <button
              onClick={handleLinkAccount}
              disabled={!selectedMemberId || !phonePin || linking}
              className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {linking ? 'Linking...' : 'Link Account'}
            </button>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setIsGuest(true)}
              className="text-sm text-slate-500 hover:text-slate-700 underline transition-colors"
            >
              My name isn't here, I'm just visiting as a guest
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6 lg:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200/50">
            {t('member.todayService')}
          </h2>
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-8">Loading...</p>
          ) : todayAssignments.length === 0 ? (
            <div className="bg-slate-50/50 rounded-xl p-8 text-center border border-slate-100 border-dashed">
              <p className="text-slate-500 text-sm font-medium">No services assigned for today.</p>
            </div>
          ) : (
            <div>{todayAssignments.map(renderAssignmentCard)}</div>
          )}
        </div>

        <div className="glass-card p-6 lg:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200/50">
            {t('member.tomorrowService')}
          </h2>
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-8">Loading...</p>
          ) : tomorrowAssignments.length === 0 ? (
            <div className="bg-slate-50/50 rounded-xl p-8 text-center border border-slate-100 border-dashed">
              <p className="text-slate-500 text-sm font-medium">No services assigned for tomorrow.</p>
            </div>
          ) : (
            <div>{tomorrowAssignments.map(renderAssignmentCard)}</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MemberDashboard;
