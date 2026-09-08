import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, Upload, Check, Pencil, Sparkles, 
  User, LogOut, ShieldCheck, RefreshCw, 
  Heart, ArrowRight, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getUserProfile, 
  saveUserProfile, 
  compressImageFile, 
  FLOWER_PRESETS, 
  PROFILE_UPDATED_EVENT,
  DEFAULT_AVATAR_URI,
  type UserProfileState,
  type FlowerPreset 
} from '../../utils/userProfile';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const fallbackName = user?.user_metadata?.full_name || 
                       user?.email?.split('@')[0] || 
                       (language === 'bn' ? 'জ্ঞান জ্যোতি ত্রিপুরা' : 'Gian Juti Tripura');

  const [profile, setProfile] = useState<UserProfileState>(() => getUserProfile(fallbackName));
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [activeTab, setActiveTab] = useState<'preset' | 'upload'>('preset');
  const [isCompressing, setIsCompressing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile when opened or when external updates happen
  useEffect(() => {
    if (isOpen) {
      const current = getUserProfile(fallbackName);
      setProfile(current);
      setNameInput(current.displayName);
      setStatusMessage(null);
      setIsEditingName(false);
    }
  }, [isOpen, fallbackName]);

  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfileState>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      }
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
  }, []);

  if (!isOpen) return null;

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      showStatus(
        language === 'bn' ? 'নাম খালি রাখা যাবে না।' : 'Name cannot be empty.',
        'error'
      );
      return;
    }

    const updated = saveUserProfile({ displayName: trimmed });
    setProfile(updated);
    setIsEditingName(false);
    showStatus(
      language === 'bn' ? 'নাম সফলভাবে হালনাগাদ করা হয়েছে!' : 'Display name updated successfully!'
    );
  };

  const handleSelectPreset = (preset: FlowerPreset) => {
    const updated = saveUserProfile({
      avatarUrl: preset.dataUri,
      presetId: preset.id
    });
    setProfile(updated);
    showStatus(
      language === 'bn' 
        ? `${preset.nameBn} অবতার হিসেবে নির্বাচিত হয়েছে!` 
        : `${preset.nameEn} set as profile avatar!`
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      showStatus(
        language === 'bn' ? 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।' : 'Please select an image file.',
        'error'
      );
      return;
    }

    // Limit initial file size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      showStatus(
        language === 'bn' ? 'ছবির সাইজ ১৫ মেগাবাইট এর কম হতে হবে।' : 'Image size must be under 15MB.',
        'error'
      );
      return;
    }

    setIsCompressing(true);
    try {
      // Compress client-side to 256x256 max web-optimized data URL (<35KB)
      const compressedDataUrl = await compressImageFile(file, 256, 0.88);
      const updated = saveUserProfile({
        avatarUrl: compressedDataUrl,
        presetId: 'custom_upload'
      });
      setProfile(updated);
      showStatus(
        language === 'bn' ? 'আপনার ছবি সফলভাবে আপলোড হয়েছে!' : 'Photo uploaded and saved successfully!'
      );
    } catch (err) {
      console.error('Photo upload error:', err);
      showStatus(
        language === 'bn' ? 'ছবি আপলোড করতে ব্যর্থ হয়েছে।' : 'Failed to process and upload image.',
        'error'
      );
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetToDefaultLotus = () => {
    const defaultPreset = FLOWER_PRESETS[0];
    const updated = saveUserProfile({
      avatarUrl: defaultPreset.dataUri,
      presetId: defaultPreset.id
    });
    setProfile(updated);
    showStatus(
      language === 'bn' ? 'ডিফল্ট পদ্ম অবতার পুনঃস্থাপন করা হয়েছে।' : 'Reset to default Sacred Lotus avatar.'
    );
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Gradient Accent */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Top Control Bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-4 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 border border-white/20">
                <Sparkles size={11} className="text-amber-300" />
                <span>Advaita VOICE Hub</span>
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-all cursor-pointer"
              title="Close"
              aria-label="Close Profile"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          
          {/* Avatar Positioning (Overlaps Banner) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 gap-3 mb-4">
            <div className="relative group self-center sm:self-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img 
                  src={profile.avatarUrl || DEFAULT_AVATAR_URI} 
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Instant Camera Trigger on Avatar */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="absolute bottom-1 right-1 p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                title={language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload photo'}
                aria-label="Upload photo"
              >
                {isCompressing ? <RefreshCw size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
            </div>

            {/* Devotee Role & ID Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                <ShieldCheck size={13} className="text-amber-500" />
                <span>
                  {role === 'ADMIN' 
                    ? (language === 'bn' ? 'অ্যাডমিন' : 'Ashram Admin')
                    : role === 'INTERNAL_MANAGER'
                    ? (language === 'bn' ? 'ম্যানেজার' : 'Internal Manager')
                    : (language === 'bn' ? 'ভক্ত সদস্য' : 'Devotee Member')}
                </span>
              </span>
              
              {user?.email && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                  {user.email}
                </span>
              )}
            </div>
          </div>

          {/* Name & Quick Status Bar */}
          <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            {isEditingName ? (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'আপনার নাম পরিবর্তন করুন' : 'Edit Your Devotional Name'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    placeholder={language === 'bn' ? 'নাম লিখুন...' : 'Enter your name...'}
                    maxLength={40}
                    className="flex-1 px-3.5 py-2 text-sm font-bold rounded-xl border border-amber-500/50 dark:border-amber-400/50 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-xs cursor-pointer"
                  >
                    {language === 'bn' ? 'সংরক্ষণ' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setNameInput(profile.displayName);
                      setIsEditingName(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{profile.displayName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Heart size={11} className="text-rose-500 fill-rose-500" />
                    <span>
                      {profile.presetId && profile.presetId !== 'custom_upload'
                        ? (language === 'bn' ? 'পবিত্র ফুল অবতার সক্রিয়' : 'Spiritual Flower Avatar Active')
                        : (language === 'bn' ? 'কাস্টম ছবি সক্রিয়' : 'Custom Photo Active')}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  title={language === 'bn' ? 'নাম পরিবর্তন' : 'Edit name'}
                >
                  <Pencil size={12} className="text-amber-500" />
                  <span>{language === 'bn' ? 'নাম এডিট' : 'Edit Name'}</span>
                </button>
              </div>
            )}

            {/* Notification / Feedback Banner */}
            {statusMessage && (
              <div 
                className={`mt-3 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
                  statusMessage.type === 'error'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {statusMessage.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>

          {/* Avatar Customization Tabs */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {language === 'bn' ? 'প্রোফাইল ফটো নির্বাচন করুন' : 'Select Profile Photo'}
              </span>

              {/* Reset to Lotus if not default */}
              {profile.presetId !== 'lotus' && (
                <button
                  onClick={handleResetToDefaultLotus}
                  className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} />
                  <span>{language === 'bn' ? 'ডিফল্ট পদ্ম সেট করুন' : 'Reset to Default Lotus'}</span>
                </button>
              )}
            </div>

            {/* Tab Pills */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/70 p-1 border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setActiveTab('preset')}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'preset'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <span>🪷</span>
                <span>{language === 'bn' ? 'ফুল অবতার (ডিফল্ট)' : 'Flower Avatars (Default)'}</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Upload size={12} className="text-amber-500" />
                <span>{language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Photo'}</span>
              </button>
            </div>

            {/* Tab 1: Spiritual Flower Avatars Grid */}
            {activeTab === 'preset' && (
              <div className="space-y-2 animate-fade-in">
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {FLOWER_PRESETS.map((preset) => {
                    const isSelected = profile.presetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`relative p-2 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/50'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-amber-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}

                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                          <img 
                            src={preset.dataUri} 
                            alt={preset.nameEn} 
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 line-clamp-1">
                          {language === 'bn' ? preset.nameBn : preset.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic pt-1">
                  {language === 'bn' 
                    ? 'পবিত্র পদ্ম, গোলাপ ও পুষ্পাবলি ভয়েস পরিবারের সার্বক্ষণিক প্রতীক হিসেবে ডিফল্ট সংরক্ষিত।' 
                    : 'Spiritual flowers represent eternal devotion and are set as default avatars.'}
                </p>
              </div>
            )}

            {/* Tab 2: Custom Photo Upload Box */}
            {activeTab === 'upload' && (
              <div className="space-y-3 animate-fade-in">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-amber-500/5 rounded-2xl p-5 text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    {isCompressing ? (
                      <RefreshCw size={22} className="animate-spin" />
                    ) : (
                      <Upload size={22} />
                    )}
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {language === 'bn' 
                      ? 'ডিভাইস বা গ্যালারি থেকে ছবি নির্বাচন করুন' 
                      : 'Choose Photo from Device / Gallery'}
                  </h4>
                  
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'bn'
                      ? 'JPG, PNG, WebP সমর্থিত • অটো অপ্টিমাইজ ও কম্প্রেসড হবে'
                      : 'JPG, PNG, WebP supported • Automatically compressed (<40KB)'}
                  </p>

                  <button
                    type="button"
                    disabled={isCompressing}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-extrabold shadow-sm hover:opacity-95 transition-all"
                  >
                    <Camera size={13} />
                    <span>{isCompressing ? (language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...') : (language === 'bn' ? 'ফাইল ব্রাউজ করুন' : 'Browse File')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Devotee Portal Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/member');
                }}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 border border-slate-200/70 dark:border-slate-700/60 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {language === 'bn' ? 'সেবা ও নোটিফিকেশন' : 'Service & Alerts'}
                  </div>
                </div>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/sadhana');
                }}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 border border-slate-200/70 dark:border-slate-700/60 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                    {language === 'bn' ? 'সাধনা ট্র্যাকার' : 'Sadhana Tracker'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {language === 'bn' ? 'জপ ও শাস্ত্র অধ্যয়ন' : 'Japa & Reading'}
                  </div>
                </div>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-rose-500 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Logout / Login Action */}
            <div className="pt-2 flex items-center justify-between">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-500/20"
                >
                  <LogOut size={13} />
                  <span>{language === 'bn' ? 'লগআউট করুন' : 'Log Out Account'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer"
                >
                  <User size={13} />
                  <span>{language === 'bn' ? 'সাইন ইন / লগইন করুন' : 'Sign In / Login'}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
