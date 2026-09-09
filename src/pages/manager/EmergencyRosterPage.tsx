import React, { useState, useEffect, useMemo } from 'react';
import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../utils/localDb';
import type { Member, ServiceDefinition } from '../../types';
import { 
  calculateEmergencyAssignments, 
  generateEmergencyWhatsAppMessage,
  getServiceDifficultyMeta
} from '../../utils/emergencyCycleEngine';
import { 
  ShieldAlert, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Briefcase, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRightLeft
} from 'lucide-react';

const STORAGE_KEY_PREFIX = 'advaita_emergency_roster_';

export const EmergencyRosterPage: React.FC = () => {
  const { language } = useLanguage();
  const { role } = useAuth();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allServices, setAllServices] = useState<ServiceDefinition[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Devotee presence IDs for selected date
  const [presentMemberIds, setPresentMemberIds] = useState<string[]>([]);
  
  // Active service IDs for emergency
  const [activeServiceIds, setActiveServiceIds] = useState<string[]>([]);
  
  // Custom single-day service assignments (serviceId -> memberId)
  const [customAssignments, setCustomAssignments] = useState<Record<string, string>>({});
  
  // UI views and states
  const [viewMode, setViewMode] = useState<'devotee' | 'service'>('devotee');
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [swappingServiceId, setSwappingServiceId] = useState<string | null>(null);

  const selectedDateIso = selectedDate.toISOString().split('T')[0];
  const selectedDateStr = selectedDate.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Load initial members and services from localDb
  const loadBaseData = async () => {
    setLoading(true);
    try {
      const [membersData, servicesData, overridesData] = await Promise.all([
        localDb.getMembers(),
        localDb.getServices(),
        localDb.getOverridesByDate(selectedDateIso)
      ]);

      const sortedM = [...membersData].sort((a, b) => a.cycleOrder - b.cycleOrder);
      const sortedS = [...servicesData].sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

      setAllMembers(sortedM);
      setAllServices(sortedS);

      // Try loading stored configuration for this date
      const savedConfigStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}${selectedDateIso}`);
      if (savedConfigStr) {
        try {
          const parsed = JSON.parse(savedConfigStr);
          if (Array.isArray(parsed.presentMemberIds) && parsed.presentMemberIds.length > 0) {
            setPresentMemberIds(parsed.presentMemberIds);
          } else {
            initializeDefaults(sortedM, sortedS, overridesData);
          }
          if (Array.isArray(parsed.activeServiceIds) && parsed.activeServiceIds.length > 0) {
            setActiveServiceIds(parsed.activeServiceIds);
          } else {
            setActiveServiceIds(sortedS.filter(s => s.isActive).map(s => s.id));
          }
          if (parsed.customAssignments && typeof parsed.customAssignments === 'object') {
            setCustomAssignments(parsed.customAssignments);
          } else {
            setCustomAssignments({});
          }
        } catch {
          initializeDefaults(sortedM, sortedS, overridesData);
        }
      } else {
        initializeDefaults(sortedM, sortedS, overridesData);
      }
    } catch (err) {
      console.error('Failed to load emergency data:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaults = (mList: Member[], sList: ServiceDefinition[], oList: any[] = []) => {
    // Exclude members marked ABSENT for this date
    const absentIds = oList
      .filter(o => (o.dateStr === selectedDateIso || o.dateStr === 'CONTINUOUS') && (o.status === 'ABSENT' || o.status === 'REPLACED'))
      .map(o => o.memberId);

    const activePresentM = mList.filter(m => m.isActive && !absentIds.includes(m.id));
    const defaultPresent = (activePresentM.length <= 6 ? activePresentM : activePresentM.slice(0, 6)).map(m => m.id);
    setPresentMemberIds(defaultPresent);
    setActiveServiceIds(sList.filter(s => s.isActive).map(s => s.id));
    setCustomAssignments({});
  };

  useEffect(() => {
    loadBaseData();
  }, [selectedDateIso]);

  // Persist config to localStorage whenever modified
  const saveCurrentConfig = (
    newPresentIds: string[], 
    newServiceIds: string[], 
    newCustomMap: Record<string, string>
  ) => {
    try {
      const config = {
        dateStr: selectedDateIso,
        presentMemberIds: newPresentIds,
        activeServiceIds: newServiceIds,
        customAssignments: newCustomMap
      };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${selectedDateIso}`, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to persist emergency config', e);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Toggle devotee presence
  const toggleMemberPresence = (memberId: string) => {
    let next: string[];
    if (presentMemberIds.includes(memberId)) {
      next = presentMemberIds.filter(id => id !== memberId);
    } else {
      next = [...presentMemberIds, memberId];
    }
    setPresentMemberIds(next);
    // Remove custom assignments pointing to unselected member
    const updatedCustom = { ...customAssignments };
    Object.keys(updatedCustom).forEach(sId => {
      if (updatedCustom[sId] === memberId) {
        delete updatedCustom[sId];
      }
    });
    setCustomAssignments(updatedCustom);
    saveCurrentConfig(next, activeServiceIds, updatedCustom);
  };

  // Quick preset helper
  const applyPreset = (count: number) => {
    const activeM = allMembers.filter(m => m.isActive);
    const next = activeM.slice(0, count).map(m => m.id);
    setPresentMemberIds(next);
    saveCurrentConfig(next, activeServiceIds, customAssignments);
  };

  // Toggle service inclusion
  const toggleServiceInclusion = (serviceId: string) => {
    let next: string[];
    if (activeServiceIds.includes(serviceId)) {
      next = activeServiceIds.filter(id => id !== serviceId);
    } else {
      next = [...activeServiceIds, serviceId];
    }
    setActiveServiceIds(next);
    const updatedCustom = { ...customAssignments };
    delete updatedCustom[serviceId];
    setCustomAssignments(updatedCustom);
    saveCurrentConfig(presentMemberIds, next, updatedCustom);
  };

  // Handle manual duty swap
  const handleAssignServiceToDevotee = (serviceId: string, memberId: string) => {
    const updatedCustom = { ...customAssignments, [serviceId]: memberId };
    setCustomAssignments(updatedCustom);
    saveCurrentConfig(presentMemberIds, activeServiceIds, updatedCustom);
    setSwappingServiceId(null);
  };

  // Reset custom assignments to pure round-robin
  const handleResetToAuto = () => {
    setCustomAssignments({});
    saveCurrentConfig(presentMemberIds, activeServiceIds, {});
  };

  // Filter objects based on active IDs
  const presentMembers = useMemo(() => {
    return allMembers.filter(m => presentMemberIds.includes(m.id));
  }, [allMembers, presentMemberIds]);

  const includedServices = useMemo(() => {
    return allServices.filter(s => activeServiceIds.includes(s.id));
  }, [allServices, activeServiceIds]);

  // Compute calculation result using isolated engine
  const calculationResult = useMemo(() => {
    return calculateEmergencyAssignments(
      selectedDate,
      presentMembers,
      includedServices,
      customAssignments
    );
  }, [selectedDate, presentMembers, includedServices, customAssignments]);

  const { assignments, devoteeSchedules, summary } = calculationResult;

  // Copy WhatsApp formatted announcement
  const handleCopyWhatsApp = async () => {
    const text = generateEmergencyWhatsAppMessage(selectedDate, devoteeSchedules, language);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Direct WhatsApp share url
  const handleOpenWhatsApp = () => {
    const text = generateEmergencyWhatsAppMessage(selectedDate, devoteeSchedules, language);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6">
        <ServiceCycleHeader 
          title={isBn ? 'জরুরী সেবা চার্ট (≤৬ জন সদস্য)' : 'Emergency Service Chart (≤6 Members)'} 
          subtitle={isBn ? 'সদস্য সংখ্যা ৬ বা তার কম হলে সকল সক্রিয় সেবা ভক্তদের মাঝে সমানভাবে বণ্টন' : 'Equal service distribution among available members during limited ashram presence'}
        />
        <div className="flex flex-col items-center justify-center min-h-[45vh] gap-3">
          <div className="w-9 h-9 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse">
            {isBn ? 'জরুরী সেবা চার্ট লোড হচ্ছে...' : 'Loading Emergency Service Chart...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6">
      <ServiceCycleHeader 
        title={isBn ? 'জরুরী সেবা চার্ট (≤৬ জন সদস্য)' : 'Emergency Service Chart (≤6 Members)'} 
        subtitle={isBn ? 'সদস্য সংখ্যা ৬ বা তার কম হলে সকল সক্রিয় সেবা ভক্তদের মাঝে সমানভাবে বণ্টন' : 'Equal service distribution among available members during limited ashram presence'}
      />

      {/* Emergency Context Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-primary-500/10 border border-amber-500/30 dark:border-amber-400/20 backdrop-blur-md shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-amber-400/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
              <ShieldAlert size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  {isBn ? 'সুষম জরুরী সেবা রোস্টার মোড' : 'Balanced Emergency Seva Mode'}
                </h2>
                <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-white uppercase tracking-wider">
                  {presentMembers.length <= 6 ? (isBn ? 'জরুরী মোড সক্রিয়' : 'Active ≤6') : (isBn ? 'সাধারণ মোড' : 'Normal')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                {isBn 
                  ? 'উপস্থিত ভক্তদের মাঝে সেবাগুলি সম্পূর্ণ সমানভাবে বণ্টন করা হয়েছে। প্রতিদিন তারিখ অনুযায়ী সেবা স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়।' 
                  : 'Services are distributed completely equally across present devotees. Duties rotate smoothly daily based on date offset.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setShowConfigPanel(!showConfigPanel)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              <SlidersHorizontal size={14} className="text-amber-600 dark:text-amber-400" />
              <span>{isBn ? 'উপস্থিতি ও সেবা নিয়ন্ত্রণ' : 'Presence & Services'}</span>
              {showConfigPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigation & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 sm:gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={() => changeDate(-1)} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors shrink-0" 
            title={isBn ? 'পূর্ববর্তী দিন' : 'Previous Day'}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-2 sm:px-4 py-1">
            <Calendar size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              {selectedDateStr}
            </span>
          </div>
          <button 
            onClick={() => changeDate(1)} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors shrink-0" 
            title={isBn ? 'পরবর্তী দিন' : 'Next Day'}
          >
            <ChevronRight size={20} />
          </button>
          <button 
            onClick={() => setSelectedDate(new Date())} 
            className="ml-1 sm:ml-2 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-colors border border-amber-200 dark:border-amber-800/50 shrink-0"
          >
            {isBn ? 'আজ' : 'Today'}
          </button>
        </div>

        {/* Action Buttons: Export & View Switch */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold">
            <button
              onClick={() => setViewMode('devotee')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'devotee' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-black' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isBn ? 'ভক্তভিত্তিক' : 'By Devotee'}
            </button>
            <button
              onClick={() => setViewMode('service')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'service' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-black' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isBn ? 'সেবাভিত্তিক' : 'By Service'}
            </button>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyWhatsApp} 
              className="inline-flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] dark:text-[#25D366] px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#25D366]/30 shadow-2xs"
              title="Copy WhatsApp Summary"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              <span>{copied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'হোয়াটসঅ্যাপ বার্তা' : 'Copy Message')}</span>
            </button>
            <button 
              onClick={handleOpenWhatsApp} 
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Share to WhatsApp"
            >
              <Share2 size={15} />
              <span className="hidden sm:inline">{isBn ? 'শেয়ার' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ashram Devotee Presence & Scope Config Drawer (Collapsible) */}
      {showConfigPanel && (
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-amber-500/20 dark:border-amber-400/20 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users size={17} className="text-amber-600 dark:text-amber-400" />
                <span>{isBn ? 'আশ্রমে উপস্থিত ভক্তবৃন্দ নির্বাচন করুন (সাধারণত ≤৬ জন)' : 'Select Present Devotees in Ashram (Typically ≤6)'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn ? 'যে সকল ভক্ত বর্তমানে আশ্রমে উপস্থিত আছেন তাদের নামের উপর ক্লিক করে নির্বাচন করুন।' : 'Click to toggle presence. Emergency duties will be distributed equally among selected devotees.'}
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 mr-1">{isBn ? 'প্রিসেট:' : 'Presets:'}</span>
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => applyPreset(num)}
                  className={`px-2 py-1 text-[11px] font-black rounded-lg border transition-all ${
                    presentMemberIds.length === num
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {num} {isBn ? 'জন' : 'Dev'}
                </button>
              ))}
              <button
                onClick={() => applyPreset(allMembers.length)}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400"
              >
                {isBn ? 'সকল' : 'All'}
              </button>
            </div>
          </div>

          {/* Devotee Presence Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {allMembers.map(member => {
              const isSelected = presentMemberIds.includes(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => toggleMemberPresence(member.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-400/10 border-amber-500 dark:border-amber-400 text-slate-900 dark:text-slate-100 font-bold shadow-2xs'
                      : 'bg-white/40 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 text-slate-400 dark:text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="text-xs truncate block">{member.fullName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Rank #{member.cycleOrder + 1}</span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Services Scope */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase size={14} className="text-amber-600 dark:text-amber-400" />
                <span>{isBn ? 'সক্রিয় সেবাসমূহ (প্রয়োজনে যে কোন সেবা সাময়িক বন্ধ করতে পারেন):' : 'Active Services Scope (Toggle off any non-essential services):'}</span>
              </h4>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {includedServices.length} / {allServices.length} {isBn ? 'সেবা অন্তর্ভুক্ত' : 'Services Selected'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allServices.map(service => {
                const isIncluded = activeServiceIds.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleServiceInclusion(service.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isIncluded
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through opacity-60'
                    }`}
                  >
                    #{service.id} {isBn ? service.nameBn.split(' (+ ')[0] : service.nameEn.split(' (+ ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {summary.totalMembers}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {isBn ? 'উপস্থিত ভক্ত' : 'Present Devotees'}
          </span>
          {summary.totalMembers <= 6 && (
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 mt-1 bg-amber-500/10 px-2 py-0.5 rounded-md">
              {isBn ? 'জরুরী পরিসর (≤৬)' : 'Emergency Range (≤6)'}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black text-primary-600 dark:text-primary-400">
            {summary.totalServices}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {isBn ? 'সক্রিয় সেবা' : 'Active Services'}
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-1">
            {isBn ? 'মোট আশ্রমে নির্ধারিত' : 'Total in Ashram'}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
            {summary.minPointsPerMember === summary.maxPointsPerMember
              ? summary.minPointsPerMember.toFixed(1)
              : `${summary.minPointsPerMember.toFixed(1)}-${summary.maxPointsPerMember.toFixed(1)}`}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {isBn ? 'শ্রম স্কোর / ভক্ত' : 'Workload Pts / Devotee'}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {summary.isBalanced ? (isBn ? 'কাঠিন্য অনুযায়ী সুষম' : 'Difficulty Balanced') : (isBn ? 'কাস্টম' : 'Custom')}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            {assignments.filter(a => a.isCustomAssigned).length}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {isBn ? 'কাস্টম পুনর্বণ্টন' : 'Manual Overrides'}
          </span>
          {assignments.filter(a => a.isCustomAssigned).length > 0 && (
            <button
              onClick={handleResetToAuto}
              className="text-[10px] font-bold text-rose-500 hover:underline mt-1 inline-flex items-center gap-1"
            >
              <RefreshCw size={10} />
              <span>{isBn ? 'রিসেট করুন' : 'Reset Auto'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {presentMembers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <Users size={36} className="mx-auto text-slate-400 mb-2 opacity-60" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {isBn ? 'কোন ভক্ত নির্বাচিত নেই' : 'No Devotees Selected'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {isBn ? 'দয়া করে আশ্রমে উপস্থিত ভক্তবৃন্দ নির্বাচন করুন।' : 'Please select the devotees currently present in the ashram.'}
          </p>
          <button
            onClick={() => applyPreset(6)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            {isBn ? 'প্রথম ৬ জন নির্বাচন করুন' : 'Select First 6 Devotees'}
          </button>
        </div>
      ) : viewMode === 'devotee' ? (
        /* Devotee View Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {devoteeSchedules.map((schedule, idx) => {
            const member = schedule.member;
            return (
              <div 
                key={member.id}
                className="group p-5 rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 hover:border-amber-500/40 dark:hover:border-amber-400/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-primary-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/20 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                          {member.fullName}
                        </h3>
                        <span className="text-[11px] font-bold text-slate-400">
                          {isBn ? `সদস্য ক্রম #${member.cycleOrder + 1}` : `Rank #${member.cycleOrder + 1}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-0.5 rounded-xl text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {schedule.totalDuties} {isBn ? 'সেবা' : 'Duties'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                        {schedule.totalPoints.toFixed(1)} {isBn ? 'পয়েন্ট' : 'pts load'}
                      </span>
                    </div>
                  </div>

                  {/* Duty List for Devotee */}
                  <div className="space-y-2.5">
                    {schedule.services.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2 text-center">
                        {isBn ? 'আজকের জন্য কোন সেবা নেই' : 'No duties assigned for today'}
                      </p>
                    ) : (
                      schedule.services.map(service => {
                        const isCustom = customAssignments[service.id] === member.id;
                        const meta = getServiceDifficultyMeta(service.id);
                        
                        // Badge color styles
                        const diffBadgeStyle = meta.difficulty === 'HEAVY'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                          : meta.difficulty === 'MEDIUM_HIGH'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                          : meta.difficulty === 'MEDIUM'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';

                        return (
                          <div 
                            key={service.id}
                            className={`p-3 rounded-xl border transition-all ${
                              isCustom
                                ? 'bg-amber-500/10 dark:bg-amber-400/10 border-amber-500/30'
                                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs shrink-0 mt-0.5">
                                  #{service.id}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    {isBn ? service.nameBn.split(' (+ ')[0] : service.nameEn.split(' (+ ')[0]}
                                  </h4>
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded border mt-1 ${diffBadgeStyle}`}>
                                    {meta.difficulty === 'HEAVY' ? '🔴' : meta.difficulty === 'MEDIUM_HIGH' ? '🟠' : meta.difficulty === 'MEDIUM' ? '🟡' : '🟢'}
                                    <span>{isBn ? meta.labelBn : meta.labelEn}</span>
                                  </span>
                                </div>
                              </div>

                              {(role === 'INTERNAL_MANAGER' || role === 'ADMIN') && (
                                <button
                                  onClick={() => setSwappingServiceId(swappingServiceId === service.id ? null : service.id)}
                                  className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                  title={isBn ? 'অন্য ভক্তকে অর্পণ করুন' : 'Reassign to another devotee'}
                                >
                                  <ArrowRightLeft size={13} />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                              <span>{service.timing}</span>
                              {isCustom && (
                                <span className="ml-auto text-[9px] font-black uppercase text-amber-600 bg-amber-500/20 px-1.5 py-0.5 rounded">
                                  Custom
                                </span>
                              )}
                            </div>

                            {/* Devotee Reassignment Dropdown */}
                            {swappingServiceId === service.id && (
                              <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 block">
                                  {isBn ? 'এই সেবাটি কাকে দিতে চান?' : 'Reassign this service to:'}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {presentMembers.map(m => (
                                    <button
                                      key={m.id}
                                      onClick={() => handleAssignServiceToDevotee(service.id, m.id)}
                                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                                        m.id === member.id
                                          ? 'bg-amber-500 text-white border-amber-500'
                                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                                      }`}
                                    >
                                      {m.fullName.split(' ')[0]}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>{isBn ? 'নিয়মিত সেবক' : 'Active Devotee'}</span>
                  </span>
                  <span>{member.phone || ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Service View Table / List */
        <div className="p-4 sm:p-6 rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase size={17} className="text-amber-600 dark:text-amber-400" />
              <span>{isBn ? 'সেবাভিত্তিক সম্পূর্ণ তালিকা (১ থেকে ১২)' : 'Complete Service-Wise Matrix (1 to 12)'}</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {assignments.length} {isBn ? 'সেবা নির্ধারিত' : 'Assignments'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {assignments.map(assignment => {
              const service = assignment.service;
              const assignedDevotee = assignment.member;
              return (
                <div 
                  key={service.id}
                  className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-amber-500/20">
                      #{service.id}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {isBn ? service.nameBn : service.nameEn}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                        <Clock size={11} className="text-amber-600 dark:text-amber-400" />
                        <span>{service.timing}</span>
                        {(() => {
                          const meta = getServiceDifficultyMeta(service.id);
                          return (
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1">
                              • {isBn ? meta.labelBn : meta.labelEn}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <UserCheck size={14} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {assignedDevotee.fullName}
                      </span>
                    </div>

                    {(role === 'INTERNAL_MANAGER' || role === 'ADMIN') && (
                      <select
                        value={assignedDevotee.id}
                        onChange={(e) => handleAssignServiceToDevotee(service.id, e.target.value)}
                        className="text-xs font-bold py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:border-amber-500"
                      >
                        {presentMembers.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyRosterPage;
