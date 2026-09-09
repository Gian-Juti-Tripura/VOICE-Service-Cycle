import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../utils/localDb';
import { useSupabaseSync } from '../../hooks/useSupabaseSync';
import type { Member, DailyAssignment, AssignmentOverride } from '../../types';
import { calculateDailyAssignments } from '../../utils/cycleEngine';
import { seedInitialData } from '../../utils/seedData';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Edit2, X, Copy, Check, ShieldAlert, ArrowRight } from 'lucide-react';
import { 
  calculateEmergencyAssignments, 
  generateEmergencyWhatsAppMessage 
} from '../../utils/emergencyCycleEngine';

import { createPortal } from 'react-dom';

const ManagerDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, role } = useAuth();

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [overrides, setOverrides] = useState<AssignmentOverride[]>([]);
  const [assignments, setAssignments] = useState<DailyAssignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<DailyAssignment | null>(null);
  const [overrideForm, setOverrideForm] = useState({
    status: 'ACTIVE' as 'ACTIVE' | 'ABSENT' | 'REPLACED',
    absenceReason: '',
    replacementMemberId: '',
    isContinuous: false
  });
  
  const [copied, setCopied] = useState(false);

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
      setOverrides(overridesData);
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

  useSupabaseSync(['members', 'services', 'assignment_overrides'], () => {
    loadData();
  });

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
    const hasContinuous = overrides.some(o => o.memberId === assignment.member.id && o.dateStr === 'CONTINUOUS');
    setSelectedAssignment(assignment);
    setOverrideForm({
      status: assignment.isAbsent ? 'ABSENT' : 'ACTIVE',
      absenceReason: assignment.absenceReason || '',
      replacementMemberId: assignment.replacementMember?.id || '',
      isContinuous: hasContinuous
    });
    setIsModalOpen(true);
  };

  const handleSaveOverride = async () => {
    if (!selectedAssignment) return;
    
    try {
      if (overrideForm.status === 'ACTIVE') {
         const hadContinuous = overrides.some(o => o.memberId === selectedAssignment.member.id && o.dateStr === 'CONTINUOUS');
         if (hadContinuous) {
           await localDb.deleteOverride(`CONTINUOUS_${selectedAssignment.member.id}`);
         }
         
         const overrideId = `${selectedDateIso}_${selectedAssignment.member.id}_${selectedAssignment.service.id}`;
         const override: AssignmentOverride = {
           id: overrideId,
           dateStr: selectedDateIso,
           memberId: selectedAssignment.member.id,
           serviceId: selectedAssignment.service.id,
           status: 'ACTIVE',
           managerId: user?.id || '',
           timestamp: new Date().toISOString()
         };
         await localDb.saveOverride(override);
      } else {
          if (overrideForm.isContinuous) {
            const dailyOverrideId = `${selectedDateIso}_${selectedAssignment.member.id}_${selectedAssignment.service.id}`;
            const hasDaily = overrides.some(o => o.id === dailyOverrideId);
            if (hasDaily) {
              await localDb.deleteOverride(dailyOverrideId);
            }

            const continuousOverrideId = `CONTINUOUS_${selectedAssignment.member.id}`;
            const continuousOverride: AssignmentOverride = {
               id: continuousOverrideId,
               dateStr: 'CONTINUOUS',
               memberId: selectedAssignment.member.id,
               serviceId: selectedAssignment.service.id,
               status: overrideForm.status,
               absenceReason: overrideForm.absenceReason,
               replacementMemberId: undefined,
               managerId: user?.id || '',
               timestamp: new Date().toISOString()
            };
            await localDb.saveOverride(continuousOverride);
          } else {
           const hadContinuous = overrides.some(o => o.memberId === selectedAssignment.member.id && o.dateStr === 'CONTINUOUS');
           if (hadContinuous) {
             await localDb.deleteOverride(`CONTINUOUS_${selectedAssignment.member.id}`);
           }
           
           const overrideId = `${selectedDateIso}_${selectedAssignment.member.id}_${selectedAssignment.service.id}`;
           const override: AssignmentOverride = {
             id: overrideId,
             dateStr: selectedDateIso,
             memberId: selectedAssignment.member.id,
             serviceId: selectedAssignment.service.id,
             status: overrideForm.status,
             absenceReason: overrideForm.absenceReason,
             replacementMemberId: undefined,
             managerId: user?.id || '',
             timestamp: new Date().toISOString()
           };
           await localDb.saveOverride(override);
         }
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save override:', err);
      alert('Failed to save override.');
    }
  };

  const generateWhatsAppSummary = () => {
    let text = `🌟 *Daily Service Announcement* 🌟\n📅 *Date:* ${selectedDateStr}\n\n`;
    
    const sortedMembers = [...members].sort((a, b) => a.cycleOrder - b.cycleOrder);
    
    let index = 1;
    sortedMembers.forEach(member => {
      const memberAssignments = assignments.filter(a => a.member.id === member.id);
      if (memberAssignments.length === 0) return;
      
      const activeOrReplacement = memberAssignments.filter(a => !a.isAbsent);
      if (activeOrReplacement.length > 0) {
        text += `${index}. 👤 *${member.fullName.trim()}*\n`;
        activeOrReplacement.forEach(a => {
          let sName = language === 'bn' ? a.service.nameBn : a.service.nameEn;
          const mainName = sName.split(' (+ ')[0];
          
          let icon = a.isReplacementFor ? '🟠' : '🟢';
          let replacementText = a.isReplacementFor ? ` [Replacement for ${a.isReplacementFor.fullName}]` : '';
          
          text += `   ${icon} *[Service ${a.service.id}]* ${mainName} (${a.service.timing})${replacementText}\n`;
        });
        text += `\n`;
        index++;
      }
    });

    const absentAssignments = assignments.filter(a => a.isAbsent);
    if (absentAssignments.length > 0) {
      text += `🕊️ *On Leave / Absent:*\n`;
      absentAssignments.forEach(a => {
        text += `   • ${a.member.fullName.trim()} (${a.absenceReason || 'On Leave'})\n`;
      });
      text += `\n`;
    }
    
    text += `🙏 *Thank you for your service!* ✨`;
    return text;
  };

  const handleCopyWhatsApp = async () => {
    const text = generateWhatsAppSummary();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err2) {
        console.error('Fallback copy failed', err2);
        alert("Failed to copy to clipboard.");
      }
      document.body.removeChild(textArea);
    }
  };

  const [emergencyCopied, setEmergencyCopied] = useState(false);

  const absentMemberIds = overrides
    .filter(o => (o.dateStr === selectedDateIso || o.dateStr === 'CONTINUOUS') && (o.status === 'ABSENT' || o.status === 'REPLACED'))
    .map(o => o.memberId);

  const presentDevotees = members.filter(m => m.isActive && !absentMemberIds.includes(m.id));
  const isEmergencyNoticeActive = presentDevotees.length <= 6 || members.filter(m => m.isActive).length <= 6;

  const handleCopyEmergencyWhatsApp = async () => {
    try {
      const servicesData = await localDb.getServices();
      const emergencyRes = calculateEmergencyAssignments(selectedDate, presentDevotees, servicesData);
      const text = generateEmergencyWhatsAppMessage(selectedDate, emergencyRes.devoteeSchedules, language);

      await navigator.clipboard.writeText(text);
      setEmergencyCopied(true);
      setTimeout(() => setEmergencyCopied(false), 2200);
    } catch {
      try {
        const servicesData = await localDb.getServices();
        const emergencyRes = calculateEmergencyAssignments(selectedDate, presentDevotees, servicesData);
        const text = generateEmergencyWhatsAppMessage(selectedDate, emergencyRes.devoteeSchedules, language);

        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setEmergencyCopied(true);
        setTimeout(() => setEmergencyCopied(false), 2200);
      } catch (err) {
        console.error('Failed to copy emergency roster', err);
        alert("Failed to copy emergency roster.");
      }
    }
  };

  const activeCount = assignments.filter(a => !a.isAbsent && !a.isReplacementFor).length;
  const absentCount = assignments.filter(a => a.isAbsent).length;
  const replacementCount = assignments.filter(a => a.isReplacementFor).length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <ServiceCycleHeader 
        title={language === 'bn' ? 'ম্যানেজার ড্যাশবোর্ড ও সেবাক্রম' : 'Manager Dashboard — Service Cycle'} 
        subtitle={language === 'bn' ? 'দৈনিক ১২ দিনের সেবাক্রম রোস্টার ও অনুপস্থিতি প্রতিস্থাপন' : '12-Day Service Cycle Daily Roster, Absences & Replacement Engine'}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="hidden md:block">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'তারিখ ও সেবার বিবরণ নির্বাচন করুন' : 'Select Date & View Dynamic Assignments'}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm w-full md:w-auto justify-between md:justify-start overflow-hidden">
          <div className="flex items-center">
            <button onClick={() => changeDate(-1)} className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors shrink-0" title="Previous Day">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-4 py-1">
              <Calendar size={18} className="text-primary-500 hidden sm:block shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 min-w-[110px] sm:min-w-[140px] text-center text-sm sm:text-base truncate">{selectedDateStr}</span>
            </div>
            <button onClick={() => changeDate(1)} className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors shrink-0" title="Next Day">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={() => setSelectedDate(new Date())} className="ml-1 sm:ml-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors border border-primary-100 dark:border-primary-900/50 shrink-0 whitespace-nowrap">
            Today
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">{error}</div>
      )}

      {/* Emergency Notice Banner when active or present members <= 6 */}
      {isEmergencyNoticeActive && presentDevotees.length > 0 && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-primary-500/10 border border-amber-500/30 dark:border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert size={22} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                {language === 'bn' 
                  ? `আশ্রমে বর্তমানে ${presentDevotees.length} জন ভক্ত উপস্থিত (${absentCount} জন অনুপস্থিত)`
                  : `Currently ${presentDevotees.length} Devotees Present in Ashram (${absentCount} Absent)`}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {language === 'bn'
                  ? 'স্বাভাবিক রোস্টারে কিছু সেবা বাদ পড়েছে। সকল ১২টি সেবা দায়িত্বের কাঠিন্য (Difficulty Level) অনুযায়ী সবার মাঝে সুষমভাবে বণ্টন করতে জরুরী চার্ট ব্যবহার করুন।'
                  : 'In standard rotation, some services are left unassigned. Use the Emergency Chart to distribute all 12 services equally by difficulty level.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              to="/manager/emergency"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>{language === 'bn' ? '১২টি সেবার সুষম জরুরী চার্ট খুলুন' : 'Open 12-Service Emergency Chart'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{members.length}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">{t('manager.totalMembers') || 'Total Members'}</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-emerald-500 dark:text-emerald-400">{activeCount}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">{t('manager.activeServices') || 'Active'}</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-rose-500 dark:text-rose-400">{absentCount}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">{t('manager.absentServices') || 'Absent'}</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <span className="text-4xl font-extrabold text-amber-500 dark:text-amber-400">{replacementCount}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">{t('manager.replacementServices') || 'Replacement'}</span>
        </div>
      </div>

      <div className="glass-card p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Assignments for {selectedDateIso}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {isEmergencyNoticeActive && presentDevotees.length > 0 && (
              <button 
                onClick={handleCopyEmergencyWhatsApp} 
                className="flex items-center gap-2 bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-amber-500/30"
                title={language === 'bn' ? 'সকল ১২টি সেবার সুষম বার্তা কপি করুন' : 'Export 100% 12-Service Balanced Emergency Roster'}
              >
                {emergencyCopied ? <Check size={16} className="text-emerald-600" /> : <ShieldAlert size={16} className="text-amber-600" />}
                <span>{emergencyCopied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? '১২-সেবা সুষম চার্ট এক্সপোর্ট' : '12-Service Balanced Export')}</span>
              </button>
            )}
            <button 
              onClick={handleCopyWhatsApp} 
              className="flex items-center gap-2 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-[#25D366]/30"
              title="Copy WhatsApp Summary"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'WhatsApp Export'}</span>
            </button>
            {members.length === 0 && (role === 'INTERNAL_MANAGER' || role === 'ADMIN') && (
              <button onClick={handleSeedData} className="btn-secondary text-sm py-1.5 px-3">Seed Data</button>
            )}
          </div>
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
                <div key={member.id} className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm relative group flex flex-col h-full">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200/50 dark:border-slate-700/50">{member.fullName}</h4>
                  <div className="space-y-4 flex-grow">
                    {memberAssignments.map((assignment, idx) => {
                      const serviceName = language === 'bn' ? assignment.service.nameBn : assignment.service.nameEn;
                      const parts = serviceName.split(' (+ ');
                      const mainName = parts[0];

                      return (
                        <div key={idx} className="flex items-start justify-between gap-3 group/item">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {assignment.isAbsent ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                              ) : assignment.isReplacementFor ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50/20" />
                              ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                <span className="text-primary-600 mr-2 block sm:inline">Service {assignment.service.id}:</span>
                                {mainName}
                              </p>
                              {assignment.isAbsent && (
                                <p className="text-sm font-medium text-rose-600 mt-1">
                                  Absent{assignment.absenceReason ? ` — ${assignment.absenceReason}` : ''}
                                </p>
                              )}
                              {assignment.isReplacementFor && (
                                <div className="mt-1.5 inline-block bg-amber-50/80 border border-amber-200/60 rounded px-2 py-1">
                                  <p className="text-xs font-bold text-amber-700">
                                    Extra Duty (Replacement for {assignment.isReplacementFor.fullName})
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          {!assignment.isReplacementFor && (role === 'INTERNAL_MANAGER' || role === 'ADMIN') && (
                            <button onClick={() => handleEditClick(assignment)} className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-all" title="Edit Assignment / Add Override">
                              <Edit2 size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                    {memberAssignments.some(a => a.isAbsent) ? (
                      <p className="text-sm font-semibold text-rose-600">Absent Today</p>
                    ) : memberAssignments.some(a => a.isReplacementFor) ? (
                      <p className="text-sm font-bold text-amber-600">You have an absent service today! 🙏</p>
                    ) : (
                      <p className="text-sm font-medium text-emerald-600">No absent service today, Haribol (Enjoy)! ✨</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Override Modal using createPortal to escape transform contexts */}
      {isModalOpen && selectedAssignment && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Manage Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
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
                  <option value="ABSENT">Absent (Automatically Replaced)</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <input 
                  type="checkbox" 
                  id="continuous"
                  checked={overrideForm.isContinuous}
                  onChange={e => setOverrideForm({ ...overrideForm, isContinuous: e.target.checked })}
                  className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500 cursor-pointer"
                />
                <label htmlFor="continuous" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Keep absent until unmarked (Continuous Absence)
                </label>
              </div>
              {overrideForm.status !== 'ACTIVE' && (
                <div className="animate-fade-in space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Absence</label>
                    <select 
                      className="input-field" 
                      value={
                        ['Sick', 'Out of town', 'Exam / Study', 'Personal', ''].includes(overrideForm.absenceReason) 
                          ? overrideForm.absenceReason 
                          : 'Other'
                      } 
                      onChange={e => {
                        const val = e.target.value;
                        setOverrideForm({ ...overrideForm, absenceReason: val === 'Other' ? 'Other details...' : val });
                      }}
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="Sick">Sick / Health Issues</option>
                      <option value="Out of town">Out of town</option>
                      <option value="Exam / Study">Exam / Study Pressure</option>
                      <option value="Personal">Personal Reason</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {!['Sick', 'Out of town', 'Exam / Study', 'Personal', ''].includes(overrideForm.absenceReason) && (
                    <div className="animate-fade-in">
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Type specific reason..." 
                        value={overrideForm.absenceReason === 'Other details...' ? '' : overrideForm.absenceReason} 
                        onChange={e => setOverrideForm({ ...overrideForm, absenceReason: e.target.value })} 
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSaveOverride} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManagerDashboard;
