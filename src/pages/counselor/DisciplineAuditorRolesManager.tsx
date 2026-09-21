import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, UserCheck, Trash2, Edit, Plus, 
  Copy, AlertCircle, Lock, Mail, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  type DisciplineAuditorAssignment,
  getAuditorAssignments,
  saveAuditorAssignment,
  deleteAuditorAssignment,
  isMasterAdmin,
  getAuditorRoleForEmail
} from '../../services/disciplineAuditorService';
import { 
  type DisciplineAuditorRole,
  DISCIPLINE_AUDITOR_ROLES,
  INITIAL_DISCIPLINE_STUDENTS
} from '../../data/groupDisciplineData';

export const DisciplineAuditorRolesManager: React.FC = () => {
  const { user, role: authRole } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  const [assignments, setAssignments] = useState<DisciplineAuditorAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [gmail, setGmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<DisciplineAuditorRole>('MORNING_INCHARGE');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Check admin authorization
  const currentUserEmail = user?.email?.toLowerCase().trim();
  const isAdmin = isMasterAdmin(currentUserEmail) || authRole === 'ADMIN' || getAuditorRoleForEmail(currentUserEmail) === 'ADMIN';

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await getAuditorAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load auditor assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle devotee dropdown selection for quick autofill
  const handleSelectDevotee = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (!studentId) return;
    const found = INITIAL_DISCIPLINE_STUDENTS.find(s => s.id === studentId);
    if (found) {
      setDevoteeName(found.name);
    }
  };

  const handleResetForm = () => {
    setEditingId(null);
    setSelectedStudentId('');
    setDevoteeName('');
    setGmail('');
    setSelectedRole('MORNING_INCHARGE');
    setIsActive(true);
  };

  const handleEditClick = (item: DisciplineAuditorAssignment) => {
    setEditingId(item.id);
    setDevoteeName(item.name);
    setGmail(item.email);
    setSelectedRole(item.role);
    setIsActive(item.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = gmail.trim().toLowerCase();
    const cleanName = devoteeName.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error(isBn ? 'সঠিক জিমেইল ঠিকানা প্রদান করুন!' : 'Please enter a valid Gmail address!');
      return;
    }

    if (!cleanName) {
      toast.error(isBn ? 'ভক্তের নাম লিখুন!' : 'Please enter the devotee name!');
      return;
    }

    // Check duplicate email (if creating new or changing to existing email)
    const duplicate = assignments.find(
      a => a.email.toLowerCase() === cleanEmail && a.id !== editingId
    );
    if (duplicate) {
      toast.error(
        isBn 
          ? `এই জিমেইলটি ইতোমধ্যে ${duplicate.name}-এর নামে বরাদ্দ রয়েছে!`
          : `This Gmail is already assigned to ${duplicate.name}!`
      );
      return;
    }

    const assignedBy = user?.email || (isBn ? 'অ্যাডমিন' : 'Admin');

    try {
      await saveAuditorAssignment({
        id: editingId || undefined,
        email: cleanEmail,
        name: cleanName,
        role: selectedRole,
        assignedBy,
        isActive
      });

      toast.success(
        editingId
          ? (isBn ? 'রোল অ্যাসাইনমেন্ট আপডেট করা হয়েছে!' : 'Role assignment updated!')
          : (isBn ? 'নতুন ইনচার্জ সফলভাবে বরাদ্দ করা হয়েছে!' : 'New incharge role successfully assigned!')
      );

      handleResetForm();
      loadAssignments();
    } catch (err) {
      toast.error(isBn ? 'সংরক্ষণ ব্যর্থ হয়েছে!' : 'Failed to save assignment!');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAuditorAssignment(id);
      toast.success(isBn ? 'অ্যাসাইনমেন্ট মুছে ফেলা হয়েছে!' : 'Assignment removed successfully!');
      setDeleteConfirmId(null);
      loadAssignments();
    } catch (err) {
      toast.error(isBn ? 'মুছে ফেলতে সমস্যা হয়েছে!' : 'Failed to delete assignment!');
    }
  };

  // If user is not authorized, show strict access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            {isBn ? 'সংরক্ষিত প্রশাসনিক এলাকা' : 'Access Strictly Restricted'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isBn
              ? 'শুধুমাত্র অনুমোদিত প্রধান অ্যাডমিনগণ আশ্রম শৃঙ্খলার ইনচার্জ ও জিমেইল রোল ব্যবস্থাপনা করতে পারেন।'
              : 'Only Master Admins can access and manage discipline audit incharge roles and Gmail assignments.'}
          </p>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 font-mono">
            {isBn ? 'লগইনকৃত আইডি:' : 'Current Logged Account:'}{' '}
            <span className="text-amber-400 font-bold">{currentUserEmail || (isBn ? 'লগইন করা নেই' : 'Not logged in')}</span>
          </div>
          <button
            onClick={() => navigate('/discipline-audit')}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
          >
            {isBn ? 'অডিট পেজে ফিরে যান' : 'Back to Discipline Audit'}
          </button>
        </div>
      </div>
    );
  }

  const roleCounts = {
    ADMIN: assignments.filter(a => a.role === 'ADMIN' && a.isActive).length,
    MORNING_INCHARGE: assignments.filter(a => a.role === 'MORNING_INCHARGE' && a.isActive).length,
    SECURITY_MANAGER: assignments.filter(a => a.role === 'SECURITY_MANAGER' && a.isActive).length,
    INTERNAL_MANAGER: assignments.filter(a => a.role === 'INTERNAL_MANAGER' && a.isActive).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            to="/discipline-audit"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-xs transition-all w-fit cursor-pointer"
          >
            <ArrowLeft size={15} className="text-amber-500" />
            <span>{isBn ? 'ডিসিপ্লিন অডিটে ফিরে যান' : 'Back to Discipline Audit'}</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>👤 {isBn ? 'অ্যাডমিন:' : 'Admin:'}</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-black">{currentUserEmail}</span>
          </div>
        </div>

        {/* Title Banner */}
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white shadow-xl border border-white/15">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10px] font-extrabold uppercase tracking-wider border border-white/15">
              <Shield size={11} className="text-amber-400" />
              <span>{isBn ? 'শৃঙ্খলা অডিট ইনচার্জ ও জিমেইল নিয়ন্ত্রণ' : 'Discipline Incharge & Gmail Control'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isBn ? 'ইনচার্জ রোল ও জিমেইল অ্যাসাইনমেন্ট' : 'Auditor Role & Gmail Assignment'}
            </h1>
            <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
              {isBn
                ? 'ভক্তদের জিমেইল অনুযায়ী সুনির্দিষ্ট ইনচার্জ রোল বরাদ্দ করুন। অডিট পেজে সম্পাদনার জন্য এই জিমেইল দিয়ে লগইন বাধ্যতামূলক।'
                : 'Assign specific auditor roles to member Gmail accounts. Devotees must log in with their assigned Gmail to edit their respective sections.'}
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="text-[10px] text-slate-300 block uppercase font-bold">👑 Admin</span>
                <span className="text-lg font-black text-amber-400">{roleCounts.ADMIN}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="text-[10px] text-slate-300 block uppercase font-bold">🌅 Morning IC</span>
                <span className="text-lg font-black text-emerald-400">{roleCounts.MORNING_INCHARGE}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="text-[10px] text-slate-300 block uppercase font-bold">🌙 Security IC</span>
                <span className="text-lg font-black text-indigo-400">{roleCounts.SECURITY_MANAGER}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="text-[10px] text-slate-300 block uppercase font-bold">📋 Internal Mgr</span>
                <span className="text-lg font-black text-purple-400">{roleCounts.INTERNAL_MANAGER}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Assignment Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                {editingId ? <Edit size={16} /> : <Plus size={16} />}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {editingId
                    ? (isBn ? 'ইনচার্জ তথ্য ও রোল সম্পাদনা' : 'Edit Incharge Role')
                    : (isBn ? 'নতুন ইনচার্জ ও জিমেইল যুক্ত করুন' : 'Assign New Incharge & Gmail')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isBn ? 'জিমেইল দিয়ে লগইন করলে স্বয়ংক্রিয়ভাবে পারমিশন সক্রিয় হবে' : 'Login with this Gmail unlocks assigned editing capabilities'}
                </p>
              </div>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel Edit'}
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Devotee quick select dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'আশ্রম ভক্ত তালিকা থেকে নির্বাচন (ঐচ্ছিক)' : 'Quick Select Devotee (Optional)'}
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => handleSelectDevotee(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="">-- {isBn ? 'তালিকা থেকে নাম বাছাই করুন' : 'Select from 12 Devotees'} --</option>
                  {INITIAL_DISCIPLINE_STUDENTS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.group})
                    </option>
                  ))}
                </select>
              </div>

              {/* Devotee Name input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'ভক্তের নাম *' : 'Devotee Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dipendranath Roy (Dipen P.)"
                  value={devoteeName}
                  onChange={e => setDevoteeName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Gmail address input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>{isBn ? 'নিবন্ধিত জিমেইল ঠিকানা *' : 'Official Gmail Address (Login Required) *'}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                  {isBn ? 'এই জিমেইল দিয়ে লগইন করতে হবে' : 'Must match devotee Google login'}
                </span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. devotee@gmail.com"
                  value={gmail}
                  onChange={e => setGmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white font-mono font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Role selection radio buttons / cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isBn ? 'নির্দিষ্ট দায়িত্ব ও ইনচার্জ রোল নির্ধারণ করুন *' : 'Assign Incharge Role *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DISCIPLINE_AUDITOR_ROLES.filter(r => r.key !== 'VIEWER').map(r => {
                  const isSelected = selectedRole === r.key;
                  return (
                    <div
                      key={r.key}
                      onClick={() => setSelectedRole(r.key)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/80 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="auditorRole"
                        checked={isSelected}
                        onChange={() => setSelectedRole(r.key)}
                        className="mt-0.5 text-amber-600 focus:ring-amber-500"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {isBn ? r.titleBn : r.titleEn}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          {isBn ? r.descriptionBn : r.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Switch & Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isBn ? 'অ্যাসাইনমেন্ট সক্রিয় (Active)' : 'Assignment Active (Can Edit)'}</span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <UserCheck size={15} />
                <span>{editingId ? (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes') : (isBn ? 'ইনচার্জ রোল বরাদ্দ নিশ্চিত করুন' : 'Assign Incharge Role')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Current Assigned Incharges List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {isBn ? 'বর্তমানে বরাদ্দকৃত ইনচার্জ তালিকা' : 'Active Assigned Incharges & Roles'}
              </h3>
            </div>
            <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
              {assignments.length} {isBn ? 'জন' : 'Assigned'}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              {isBn ? 'লোড হচ্ছে...' : 'Loading assignments...'}
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              {isBn ? 'কোনো ইনচার্জ বরাদ্দ করা নেই' : 'No incharge assignments yet.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {assignments.map(item => {
                const profile = DISCIPLINE_AUDITOR_ROLES.find(r => r.key === item.role);
                const isMaster = isMasterAdmin(item.email);

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.isActive
                        ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-black ${profile?.badgeColor || 'bg-slate-700 text-white'}`}>
                          {isBn ? profile?.titleBn : profile?.titleEn}
                        </span>
                        {isMaster && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                            👑 Master Admin
                          </span>
                        )}
                        {!item.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300">
                            {isBn ? 'নিষ্ক্রিয়' : 'Suspended'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span>✉️ {item.email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.email);
                            toast.success(isBn ? 'জিমেইল কপি হয়েছে!' : 'Gmail copied!');
                          }}
                          className="p-1 hover:text-amber-500 transition-colors cursor-pointer"
                          title="Copy Gmail"
                        >
                          <Copy size={12} />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                        {isBn ? profile?.descriptionBn : profile?.descriptionEn}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title={isBn ? 'রোল সম্পাদনা করুন' : 'Edit role assignment'}
                      >
                        <Edit size={14} className="text-amber-500" />
                        <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
                      </button>

                      {!isMaster && (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title={isBn ? 'অ্যাসাইনমেন্ট বাতিল করুন' : 'Revoke assignment'}
                        >
                          <Trash2 size={14} />
                          <span>{isBn ? 'বাতিল' : 'Revoke'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <AlertCircle size={22} />
              <h3 className="text-base font-black">
                {isBn ? 'ইনচার্জ পদ বাতিল নিশ্চিতকরণ' : 'Revoke Incharge Role?'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {isBn
                ? 'আপনি কি নিশ্চিত যে এই ভক্তের ইনচার্জ রোল বাতিল করতে চান? রোল বাতিল করলে তিনি শুধুমাত্র ভিউয়ার মোডে দেখতে পারবেন।'
                : 'Are you sure you want to revoke this devotee\'s incharge role? They will be relegated to read-only viewer mode.'}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 shadow-md transition-all cursor-pointer"
              >
                {isBn ? 'হ্যাঁ, বাতিল করুন' : 'Yes, Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DisciplineAuditorRolesManager;
