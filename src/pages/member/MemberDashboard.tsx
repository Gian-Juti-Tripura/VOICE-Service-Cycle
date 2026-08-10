import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../utils/localDb';
import type { Member, DailyAssignment } from '../../types';
import { calculateDailyAssignments } from '../../utils/cycleEngine';

const MemberDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [myMember, setMyMember] = useState<Member | null>(null);
  
  const [todayAssignments, setTodayAssignments] = useState<DailyAssignment[]>([]);
  const [tomorrowAssignments, setTomorrowAssignments] = useState<DailyAssignment[]>([]);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const todayStr = todayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

  useEffect(() => {
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
        // Note: For Phase 1 without an explicit pairing UI, we assume userId might not be set.
        // We'll try to find the member, but if not linked, they see a message.
        const me = allMembers.find(m => m.userId === user.uid) || null;
        setMyMember(me);

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

    loadData();
  }, [user]);

  const renderAssignmentCard = (assignment: DailyAssignment) => {
    const serviceName = language === 'bn' ? assignment.service.nameBn : assignment.service.nameEn;
    const serviceDesc = language === 'bn' ? assignment.service.descBn : assignment.service.descEn;
    
    let statusBadge = null;
    if (assignment.isAbsent) {
      statusBadge = <span style={{ backgroundColor: 'var(--color-danger)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Absent</span>;
    } else if (assignment.isReplacementFor) {
      statusBadge = <span style={{ backgroundColor: 'var(--color-warning)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Replacement</span>;
    } else {
      statusBadge = <span style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Active</span>;
    }

    return (
      <div key={assignment.service.id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
        <div className="flex justify-between items-start mb-2">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{serviceName}</h3>
          {statusBadge}
        </div>
        <p className="text-sm text-muted mb-4">{serviceDesc}</p>
        
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.5rem' }}>
          <span style={{ opacity: 0.7 }}>🕒</span>
          <span className="text-sm font-medium">{assignment.service.timing}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      <div className="flex flex-col items-center justify-center mb-8 animate-fade-in" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
        <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>{t('member.greeting')}</h1>
        <p style={{ opacity: 0.9 }}>{todayStr}</p>
      </div>

      {!myMember && !loading && (
        <div className="card mb-8" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <p><strong>Account Not Linked</strong></p>
          <p className="text-sm text-muted mt-2">Your account has not been linked to a Member profile yet. Please ask the Internal Manager to link your account.</p>
        </div>
      )}

      <div className="mb-8">
        <h2 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--color-surface)', paddingBottom: '0.5rem' }}>
          {t('member.todayService')}
        </h2>
        {loading ? (
          <p className="text-muted text-sm text-center py-4">Loading...</p>
        ) : todayAssignments.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p className="text-muted text-sm">No services assigned for today.</p>
          </div>
        ) : (
          <div>{todayAssignments.map(renderAssignmentCard)}</div>
        )}
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--color-surface)', paddingBottom: '0.5rem' }}>
          {t('member.tomorrowService')}
        </h2>
        {loading ? (
          <p className="text-muted text-sm text-center py-4">Loading...</p>
        ) : tomorrowAssignments.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p className="text-muted text-sm">No services assigned for tomorrow.</p>
          </div>
        ) : (
          <div>{tomorrowAssignments.map(renderAssignmentCard)}</div>
        )}
      </div>

    </div>
  );
};

export default MemberDashboard;
