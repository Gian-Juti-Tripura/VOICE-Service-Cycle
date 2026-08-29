import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Droplet, 
  Heart, 
  Sparkles, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  Share2, 
  ShieldCheck, 
  X, 
  Building,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_DEVOTEES_DATA, type DevoteeProfile, type NectarDrop } from '../../data/devoteeProfilesData';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'advaita_voice_devotees_profiles_v1';

export default function DevoteeProfilesPage() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Load Devotees from LocalStorage or Initial Seed Data
  const [devotees, setDevotees] = useState<DevoteeProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading devotees data from storage:', e);
    }
    return INITIAL_DEVOTEES_DATA;
  });

  // Save changes to LocalStorage whenever devotees change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devotees));
    } catch (e) {
      console.error('Error saving devotees data:', e);
    }
  }, [devotees]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedBlood, setSelectedBlood] = useState('ALL');

  // Modal State for Adding New Devotee
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDevotee, setNewDevotee] = useState<Partial<DevoteeProfile>>({
    name: '',
    spiritualName: '',
    phone: '',
    gmail: '',
    birthday: '',
    address: '',
    bloodGroup: 'O+',
    department: 'CSE',
    institute: 'University of Chittagong',
    serviceType: 'IYF',
    roleBadge: 'IYF Seva Member'
  });

  // Open Nectar Drop Input Form State (keyed by devotee id)
  const [openNectarFormId, setOpenNectarFormId] = useState<string | null>(null);
  const [nectarText, setNectarText] = useState('');
  const [nectarAuthor, setNectarAuthor] = useState('');
  const [nectarTag, setNectarTag] = useState('সাধনা নিষ্ঠা');

  // Predefined quick nectar tags
  const QUICK_TAGS = isBn
    ? ['নম্র স্বভাব', 'সময়নিষ্ঠ সেবা', 'সাধনা নিষ্ঠা', 'মধুর কীর্তনীয়া', 'উৎসাহী প্রচারক', 'প্রসাদ সেবা', 'শাস্ত্রীয় প্রজ্ঞা', 'শান্ত স্বভাব']
    : ['Humble Nature', 'Punctual Seva', 'Sadhana Dedication', 'Sweet Kirtan', 'Enthusiastic Preacher', 'Prasadam Seva', 'Scriptural Wisdom', 'Peaceful'];

  // Handle Photo Upload for specific devotee
  const handlePhotoUpload = (devoteeId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(isBn ? 'ছবির আকার ২ মেগাবাইটের কম হতে হবে!' : 'Image size must be less than 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Photo = reader.result as string;
        setDevotees(prev => prev.map(dev => dev.id === devoteeId ? { ...dev, photo: base64Photo } : dev));
        toast.success(isBn ? 'ভক্তের ছবি সফলভাবে আপলোড হয়েছে! 📷' : 'Photo uploaded successfully! 📷');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add Nectar Drop
  const handleAddNectarDrop = (devoteeId: string) => {
    if (!nectarText.trim()) {
      toast.error(isBn ? 'অনুগ্রহ করে সদ্গুণাবলী লিখুন!' : 'Please write the nectar drop description!');
      return;
    }
    const newDrop: NectarDrop = {
      id: 'nd_' + Date.now(),
      text: nectarText.trim(),
      author: nectarAuthor.trim() || (isBn ? 'বেনামী শুভাকাঙ্ক্ষী' : 'Well Wisher'),
      date: new Date().toISOString().split('T')[0],
      tag: nectarTag
    };

    setDevotees(prev => prev.map(dev => {
      if (dev.id === devoteeId) {
        return {
          ...dev,
          nectarDrops: [...(dev.nectarDrops || []), newDrop]
        };
      }
      return dev;
    }));

    setNectarText('');
    setNectarAuthor('');
    setOpenNectarFormId(null);
    toast.success(isBn ? 'ভক্তের সদ্গুণাবলী (অমৃতবিন্দু) যুক্ত হয়েছে! ✨' : 'Nectar drop added successfully! ✨');
  };

  // Handle Delete Nectar Drop
  const handleDeleteNectarDrop = (devoteeId: string, dropId: string) => {
    setDevotees(prev => prev.map(dev => {
      if (dev.id === devoteeId) {
        return {
          ...dev,
          nectarDrops: dev.nectarDrops.filter(nd => nd.id !== dropId)
        };
      }
      return dev;
    }));
    toast.success(isBn ? 'অমৃতবিন্দু অপসারিত হয়েছে।' : 'Nectar drop removed.');
  };

  // Handle Create New Devotee Profile
  const handleCreateDevotee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevotee.name || !newDevotee.phone) {
      toast.error(isBn ? 'নাম ও ফোন নম্বর বাধ্যতামূলক!' : 'Name and Phone are mandatory!');
      return;
    }

    const created: DevoteeProfile = {
      id: 'dev_' + Date.now(),
      sl: devotees.length + 1,
      name: newDevotee.name!,
      spiritualName: newDevotee.spiritualName,
      phone: newDevotee.phone!,
      gmail: newDevotee.gmail || `${newDevotee.name?.toLowerCase().replace(/\\s+/g, '')}@gmail.com`,
      birthday: newDevotee.birthday || '2002-01-01',
      address: newDevotee.address || 'Chittagong',
      bloodGroup: newDevotee.bloodGroup || 'O+',
      department: newDevotee.department || 'General',
      institute: newDevotee.institute || 'University of Chittagong',
      serviceType: newDevotee.serviceType || 'IYF',
      roleBadge: newDevotee.roleBadge || 'IYF Seva Member',
      guardianNumber: newDevotee.guardianNumber,
      nationalId: newDevotee.nationalId,
      photo: newDevotee.photo,
      nectarDrops: []
    };

    setDevotees(prev => [...prev, created]);
    setIsAddModalOpen(false);
    setNewDevotee({
      name: '',
      spiritualName: '',
      phone: '',
      gmail: '',
      birthday: '',
      address: '',
      bloodGroup: 'O+',
      department: 'CSE',
      institute: 'University of Chittagong',
      serviceType: 'IYF',
      roleBadge: 'IYF Seva Member'
    });
    toast.success(isBn ? 'নতুন ভক্তের প্রোফাইল তৈরি হয়েছে! 🎉' : 'New devotee profile created! 🎉');
  };

  // Filter Logic
  const filteredDevotees = devotees.filter(dev => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.spiritualName && dev.spiritualName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dev.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.phone.includes(searchQuery) ||
      dev.gmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || dev.department.includes(selectedDept);
    const matchesBlood = selectedBlood === 'ALL' || dev.bloodGroup === selectedBlood;

    return matchesSearch && matchesDept && matchesBlood;
  });

  // Extract unique departments and blood groups for filters
  const departments = ['ALL', 'CSE', 'Sanskrit', 'Sociology', 'ACCE', 'Chemistry', 'Philosophy'];
  const bloodGroups = ['ALL', 'O+', 'A+', 'B+', 'AB+'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors duration-300">
      
      {/* ================= TOP HERO BANNER ================= */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white py-8 px-4 sm:px-8 shadow-xl">
        <div className="max-w-6xl mx-auto space-y-4">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-black/30 text-amber-200 text-xs font-mono font-bold">
              BD All VOICE Devotees Information Directory
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              {devotees.length} {isBn ? 'জন নিবেদিত ভক্ত' : 'Dedicated Devotees'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {isBn ? 'অদ্বৈত ভয়েস ভক্ত প্রোফাইল ও সদ্গুণাবলী ডিরেক্টরি' : 'Advaita VOICE Devotee Profiles & Nectar Drops'}
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1">
                "Rekindling Wisdom, Reviving Love" • {isBn ? 'বৈষ্ণব সেবা, পারস্পরিক গুণগান ও ভক্ত পরিচয়' : 'Vaishnava Profiles, Mutual Appreciation & Seva Records'}
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Plus size={16} />
              <span>{isBn ? 'নতুন ভক্ত প্রোফাইল যোগ করুন' : 'Add Devotee Profile'}</span>
            </button>
          </div>

          {/* Official Center & Leadership Reference Card */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Building size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? 'আশ্রম ও কেন্দ্র' : 'Ashram & Center'}</div>
                <div className="font-bold text-white leading-tight">Radhamadhav Temple & Gour Nitai Ashram</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? 'ভয়েস ক্যাম্পাস ঠিকানা' : 'VOICE Campus Address'}</div>
                <div className="font-bold text-white leading-tight">Forestry Garage, South Campus, CU</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? 'কেয়ারটেকার' : 'VOICE Caretaker'}</div>
                <div className="font-bold text-white leading-tight">HG Rasvihari Krishna Chandra Das</div>
                <a href="tel:01875835986" className="text-[11px] text-amber-200 underline font-mono">01875835986</a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <UserCheck size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? 'কো-অর্ডিনেটর' : 'VOICE Coordinator'}</div>
                <div className="font-bold text-white leading-tight">Utpol Das Khocon (ACCE)</div>
                <a href="tel:01790839891" className="text-[11px] text-amber-200 underline font-mono">01790839891</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROL BAR ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? 'নাম, বিভাগ, জেলা, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by name, department, district, email or phone...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <Filter size={14} className="text-slate-400 shrink-0 ml-1" />
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Blood Group Filter */}
            <div className="flex items-center gap-1 shrink-0">
              <Droplet size={14} className="text-rose-500" />
              <select
                value={selectedBlood}
                onChange={(e) => setSelectedBlood(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>Blood: {bg}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* ================= DEVOTEES PROFILES GRID (SEPARATE BOXES) ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {filteredDevotees.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <User size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-500">
              {isBn ? 'কোনো ভক্তের প্রোফাইল পাওয়া যায়নি।' : 'No devotee profiles found matching your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDevotees.map((devotee) => (
              <div
                key={devotee.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6"
              >
                
                {/* Top Accent Stripe */}
                <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />

                <div className="space-y-4">
                  
                  {/* Header Row: Photo + Names + Role Badge */}
                  <div className="flex items-start gap-4">
                    
                    {/* Photo Container with Live Upload Button */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md">
                        {devotee.photo ? (
                          <img 
                            src={devotee.photo} 
                            alt={devotee.name} 
                            className="w-full h-full object-cover rounded-2xl bg-white dark:bg-slate-800"
                          />
                        ) : (
                          <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-xl sm:text-2xl">
                            {devotee.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Hidden File Input for Instant Photo Upload */}
                      <label 
                        title={isBn ? 'ছবি পরিবর্তন / আপলোড করুন' : 'Change / Upload Photo'}
                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all border border-white dark:border-slate-800"
                      >
                        <Upload size={11} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handlePhotoUpload(devotee.id, e)}
                        />
                      </label>
                    </div>

                    {/* Name & Academic Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                          SL #{devotee.sl.toString().padStart(2, '0')}
                        </span>
                        
                        {devotee.roleBadge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50">
                            {devotee.roleBadge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-1 truncate">
                        {devotee.name}
                      </h3>
                      
                      {devotee.spiritualName && devotee.spiritualName !== devotee.name && (
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 truncate">
                          📿 {devotee.spiritualName}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex-wrap">
                        <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                          <GraduationCap size={13} className="text-indigo-500" />
                          {devotee.department}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-rose-500" />
                          {devotee.address}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Devotee Info Matrix (Birthday, Gmail, Phone, Blood Group) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    
                    {/* Birthday Column */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center shrink-0">
                        <Calendar size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{isBn ? 'জন্মদিন / আবির্ভাব' : 'Birthday'}</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                          {devotee.birthday || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Blood Group Column */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                        <Droplet size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</div>
                        <div className="font-extrabold text-rose-600 dark:text-rose-400 text-[11px]">
                          {devotee.bloodGroup || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Gmail Column */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                        <Mail size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{isBn ? 'জিমেইল' : 'Gmail'}</div>
                        <a 
                          href={`mailto:${devotee.gmail}`} 
                          title={devotee.gmail}
                          className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] truncate block hover:underline"
                        >
                          {devotee.gmail || '—'}
                        </a>
                      </div>
                    </div>

                    {/* Phone Column */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                        <Phone size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{isBn ? 'ফোন নম্বর' : 'Phone'}</div>
                        <a 
                          href={`tel:${devotee.phone}`} 
                          className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px] hover:underline"
                        >
                          {devotee.phone}
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* ================= NECTAR DROPS (ভক্তের সদ্গুণাবলী) SECTION ================= */}
                  <div className="pt-2 space-y-2">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>{isBn ? 'ভক্তের সদ্গুণাবলী (অমৃতবিন্দু)' : 'Nectar Drops of Devotee'}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {devotee.nectarDrops?.length || 0}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setOpenNectarFormId(openNectarFormId === devotee.id ? null : devotee.id);
                          setNectarText('');
                        }}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>{isBn ? 'গুণাবলী যোগ করুন' : 'Add Nectar'}</span>
                      </button>
                    </div>

                    {/* Nectar Drops List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {devotee.nectarDrops && devotee.nectarDrops.length > 0 ? (
                        devotee.nectarDrops.map((drop) => (
                          <div 
                            key={drop.id}
                            className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1 relative group/drop"
                          >
                            <div className="flex items-center justify-between gap-1">
                              {drop.tag && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                                  ✨ {drop.tag}
                                </span>
                              )}
                              <div className="text-[10px] text-slate-400 font-mono">
                                {drop.author} • {drop.date}
                              </div>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                              "{drop.text}"
                            </p>
                            
                            {/* Delete Drop Button */}
                            <button
                              onClick={() => handleDeleteNectarDrop(devotee.id, drop.id)}
                              className="absolute top-2 right-2 opacity-0 group-hover/drop:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                              title="Delete this appreciation"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                          {isBn ? 'এখনো কোনো অমৃতবিন্দু যোগ করা হয়নি। নিচে যোগ করুন!' : 'No nectar drops added yet. Add one below!'}
                        </div>
                      )}
                    </div>

                    {/* Inline Nectar Form */}
                    {openNectarFormId === devotee.id && (
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-amber-800 space-y-2.5 mt-2 animate-fadeIn">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Heart size={12} className="text-rose-500" />
                          <span>{isBn ? 'ভক্তের সদ্গুণাবলী বা সেবা অবদান লিখুন' : 'Add Devotee Good Quality / Seva Nectar'}</span>
                        </div>

                        {/* Quick Tag Pills */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {QUICK_TAGS.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setNectarTag(tag)}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                nectarTag === tag
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        <textarea
                          placeholder={isBn ? 'ভক্তের গুণাবলী, সেবামূলক আচরণ বা কোনো মধুর স্মৃতি লিখুন...' : 'Write devotional qualities, seva attitude or nectar notes...'}
                          value={nectarText}
                          onChange={(e) => setNectarText(e.target.value)}
                          rows={2}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={isBn ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
                            value={nectarAuthor}
                            onChange={(e) => setNectarAuthor(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddNectarDrop(devotee.id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
                          >
                            {isBn ? 'যুক্ত করুন' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                {/* Footer Quick Action Buttons */}
                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {devotee.institute}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/88${devotee.phone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Share2 size={11} />
                      <span>WhatsApp</span>
                    </a>
                    
                    <a
                      href={`tel:${devotee.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Phone size={11} />
                      <span>{isBn ? 'কল করুন' : 'Call'}</span>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= MODAL: ADD NEW DEVOTEE PROFILE ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-amber-500" />
                <span>{isBn ? 'নতুন ভক্ত প্রোফাইল যুক্ত করুন' : 'Add New Devotee Profile'}</span>
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDevotee} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'ভক্তের পুরো নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDevotee.name}
                    onChange={(e) => setNewDevotee({...newDevotee, name: e.target.value})}
                    placeholder="e.g. Akash Paul"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'দীক্ষা / আধ্যাত্মিক নাম' : 'Spiritual Name'}
                  </label>
                  <input
                    type="text"
                    value={newDevotee.spiritualName}
                    onChange={(e) => setNewDevotee({...newDevotee, spiritualName: e.target.value})}
                    placeholder="e.g. Akash Das"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'ফোন নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDevotee.phone}
                    onChange={(e) => setNewDevotee({...newDevotee, phone: e.target.value})}
                    placeholder="01799100306"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'জিমেইল ঠিকানা' : 'Gmail Address'}
                  </label>
                  <input
                    type="email"
                    value={newDevotee.gmail}
                    onChange={(e) => setNewDevotee({...newDevotee, gmail: e.target.value})}
                    placeholder="name@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'জন্মদিন / আবির্ভাব তারিখ' : 'Birthday Date'}
                  </label>
                  <input
                    type="date"
                    value={newDevotee.birthday}
                    onChange={(e) => setNewDevotee({...newDevotee, birthday: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </label>
                  <select
                    value={newDevotee.bloodGroup}
                    onChange={(e) => setNewDevotee({...newDevotee, bloodGroup: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'বিভাগ / বিষয়' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={newDevotee.department}
                    onChange={(e) => setNewDevotee({...newDevotee, department: e.target.value})}
                    placeholder="e.g. CSE / Sanskrit / Sociology"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'নিজ জেলা / ঠিকানা' : 'Home District / Address'}
                  </label>
                  <input
                    type="text"
                    value={newDevotee.address}
                    onChange={(e) => setNewDevotee({...newDevotee, address: e.target.value})}
                    placeholder="e.g. Feni / Chittagong"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md cursor-pointer"
                >
                  {isBn ? 'প্রোফাইল সংরক্ষণ করুন' : 'Save Profile'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
