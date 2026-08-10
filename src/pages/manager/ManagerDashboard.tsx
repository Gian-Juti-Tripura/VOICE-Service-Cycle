import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../utils/localDb';
import type { Member, DailyAssignment, AssignmentOverride } from '../../types';
import { calculateDailyAssignments } from '../../utils/cycleEngine';
import { seedInitialData } from '../../utils/seedData';
import { ChevronLeft, ChevronRight, Calendar, Edit2, X } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  // Removed unused services state
  const [assignments, setAssignments] = useState<DailyAssignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Date navigation state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modal state for overrides
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<DailyAssignment | null>(null);
  const [overrideForm, setOverrideForm] = useState({
    status: 'ACTIVE' as 'ACTIVE' | 'ABSENT' | 'REPLACED',
    absenceReason: '',
    replacementMemberId: ''
  });

  const selectedDateStr = selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const selectedDateIso = selectedDate.toISOString().split('T')[0];

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, servicesData, overridesData] = await Promise.all([
        localDb.getMembers(),
        localDb.getServices(),
        localDb.getOverridesByDate(selectedDateIso)
      ]);
      setMembers(membersData);
      // setServices(servicesData); // removed unused state
      const dailyAssignments = calculateDailyAssignments(selectedDate, membersData, servicesData, overridesData);
      setAssignments(dailyAssignments);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateIso]);

  const handleSeedData = async () => {
    if (window.confirm('Seed initial 12 members and services?')) {
      await seedInitialData();
      loadData();
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleEditClick = (assignment: DailyAssignment) => {
    setSelectedAssignment(assignment);
    setOverrideForm({
      status: assignment.isAbsent ? (assignment.replacementMember ? 'REPLACED' : 'ABSENT') : 'ACTIVE',
      absenceReason: assignment.absenceReason || '',
      replacementMemberId: assignment.replacementMember?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveOverride = async () => {
    if (!selectedAssignment) return;
    const overrideId = `${selectedDateIso}_${selectedAssignment.member.id}_${selectedAssignment.service.id}`;
    const override: AssignmentOverride = {
      id: overrideId,
      dateStr: selectedDateIso,
      memberId: selectedAssignment.member.id,
      serviceId: selectedAssignment.service.id,
      status: overrideForm.status,
      absenceReason: overrideForm.status !== 'ACTIVE' ? overrideForm.absenceReason : undefined,
      replacementMemberId: overrideForm.status === 'REPLACED' ? overrideForm.replacementMemberId : undefined,
      managerId: user?.uid || 'unknown',
      timestamp: new Date().toISOString()
    };
    try {
      await localDb.saveOverride(override);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save override:', err);
      alert('Failed to save override.');
    }
  };

  const activeCount = assignments.filter(a => !a.isAbsent && !a.isReplacementFor).length;
  const absentCount = assignments.filter(a => a.isAbsent).length;
  const replacementCount = assignments.filter(a => a.isReplacementFor).length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('manager.dashboard')}</h1>
          <p className="mt-2 text-lg text-primary-600 font-medium">Daily Schedule &amp; Overrides</p>
        </div>
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Previous Day">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-4 py-1">
            <Calendar size={18} className="text-primary-500" />
            <span className="font-semibold text-slate-800 min-w-[140px] text-center">{selectedDateStr}</span>
          </div>
          <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Next Day">
            <ChevronRight size={20} />
          </button>
          <button onClick={() => setSelectedDate(new Date())} className="ml-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-primary-100">
            Today
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-slate-800">{members.length}</span>
          <span className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wide">{t('manager.totalMembers') || 'Total Members'}</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-emerald-500">{activeCount}</span>
          <span className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wide">{t('manager.activeServices') || 'Active'}</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-rose-500">{absentCount}</span>
          <span className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wide">{t('manager.absentServices') || 'Absent'}</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-amber-500">{replacementCount}</span>
          <span className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wide">{t('manager.replacementServices') || 'Replacement'}</span>
        </div>
      </div>

      <div className="glass-card p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Assignments for {selectedDateIso}</h3>
          {members.length === 0 && (
            <button onClick={handleSeedData} className="btn-secondary text-sm py-1.5 px-3">Seed Data</button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/50 rounded-xl p-5 border border-slate-100/50">
                <div className="h-6 bg-slate-200/60 rounded w-1/2 mb-4 pb-2"></div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200/60 rounded w-3/4 mb-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">No assignments found for this date.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {members.sort((a, b) => a.cycleOrder - b.cycleOrder).map(member => {
              const memberAssignments = assignments.filter(a => a.member.id === member.id);
              if (memberAssignments.length === 0) return null;
              return (
                <div key={member.id} className="bg-white/50 rounded-xl p-5 border border-slate-100/50 hover:bg-white/80 transition-colors shadow-sm relative group">
                  <h4 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200/50">{member.fullName}</h4>
                  <div className="space-y-4">
                    {memberAssignments.map((assignment, idx) => {
                      const serviceName = language === 'bn' ? assignment.service.nameBn : assignment.service.nameEn;
                      return (
                        <div key={idx} className="flex items-start justify-between gap-3 group/item">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {assignment.isAbsent ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                              ) : assignment.isReplacementFor ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-5 0/20" />
                              ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 leading-snug">
                                {serviceName}
                                <span className="text-xs font-normal text-slate-400 ml-2 block sm:inline mt-1 sm:mt-0">(Service {assignment.service.id})</span>
                              </p>
                              {assignment.isAbsent && (
                                <p className="text-sm font-medium text-rose-600 mt-1">
                                  Absent{assignment.absenceReason ? ` — ${assignment.absenceReason}` : ''}
                                </p>
                              )}
                              {assignment.isReplacementFor && (
                                <p className="text-sm font-medium text-amber-600 mt-1">
                                  Replacement for: {assignment.isReplacementFor.fullName}
                                </p>
                              )}
                            </div>
                          </div>
                          {!assignment.isReplacementFor && (
                            <button onClick={() => handleEditClick(assignment)} className="opacity-0 group-hover/item:opacity-100 p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all" title="Edit Assignment / Add Override">
                              <Edit2 size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Override Modal */}
      {isModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Manage Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">{selectedDateStr}</p>
                <p className="font-bold text-slate-800">{selectedAssignment.member.fullName}</p>
                <p className="text-slate-600 text-sm mt-1">
                  Service {selectedAssignment.service.id}: {language === 'bn' ? selectedAssignment.service.nameBn : selectedAssignment.service.nameEn}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select className="input-field" value={overrideForm.status} onChange={e => setOverrideForm({ ...overrideForm, status: e.target.value as any })}>
                  <option value="ACTIVE">Active (Attending)</option>
                  <option value="ABSENT">Absent (No Replacement)</option>
                  <option value="REPLACED">Absent (With Replacement)</option>
                </select>
              </div>
              {overrideForm.status !== 'ACTIVE' && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Absence (Optional)</label>
                  <input type="text" className="input-field" placeholder="e.g. Sick, Out of town..." value={overrideForm.absenceReason} onChange={e => setOverrideForm({ ...overrideForm, absenceReason: e.target.value })} />
                </div>
              )}
              {overrideForm.status === 'REPLACED' && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Replacement Member</label>
                  <select className="input-field" value={overrideForm.replacementMemberId} onChange={e => setOverrideForm({ ...overrideForm, replacementMemberId: e.target.value })}>
                    <option value="">-- Select Replacement --</option>
                    {members.filter(m => m.isActive && m.id !== selectedAssignment.member.id).map(m => (
                      <option key={m.id} value={m.id}>{m.fullName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSaveOverride} disabled={overrideForm.status === 'REPLACED' && !overrideForm.replacementMemberId} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
