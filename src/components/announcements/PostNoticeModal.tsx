import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { addStoredNotice, type ManagerAnnouncement } from '../../utils/noticesStore';
import { 
  Send, X, AlertCircle, ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ROLE_OPTIONS = [
  { key: 'COORDINATOR', titleEn: 'Central Coordinator', titleBn: 'সার্বিক সমন্বয়ক (ওসি)', inchargeEn: 'Utpol Das Khocon', inchargeBn: 'উৎপল দাস খোকন' },
  { key: 'STUDY_CARE', titleEn: 'Study Care (Academic & Career)', titleBn: 'স্টাডি কেয়ার (শিক্ষা ও ক্যারিয়ার)', inchargeEn: 'Gian Juti Tripura + Pranto C Das', inchargeBn: 'জ্ঞান জ্যোতি ত্রিপুরা ও প্রান্ত চন্দ্র দাস' },
  { key: 'INTERNAL_MGR', titleEn: 'Internal Manager', titleBn: 'অভ্যন্তরীণ ব্যবস্থাপক', inchargeEn: 'Dipendranath Roy', inchargeBn: 'দীপেন্দ্রনাথ রায়' },
  { key: 'MORNING_PROG', titleEn: 'Morning Program Incharge', titleBn: 'মর্নিং প্রোগ্রাম ইনচার্জ', inchargeEn: 'Jaydev Sebamoy Das', inchargeBn: 'জয়দেব সেবাময় দাস' },
  { key: 'SECURITY_MGR', titleEn: 'Security Manager', titleBn: 'নিরাপত্তা ব্যবস্থাপক', inchargeEn: 'Bappa Mohury', inchargeBn: 'বাপ্পা মহুরী' },
  { key: 'KITCHEN_MGR', titleEn: 'Kitchen & Prasadam Incharge', titleBn: 'রান্না ও প্রসাদম ইনচার্জ', inchargeEn: 'Ramanath Shyam Das', inchargeBn: 'রমানাথ শ্যাম দাস' },
  { key: 'PREACHING', titleEn: 'Preaching & Youth Outreach', titleBn: 'প্রচার ও যুব উন্নয়ন', inchargeEn: 'Preaching Council', inchargeBn: 'প্রচার পরিষদ' },
  { key: 'LIBRARY', titleEn: 'Sebananda Library & Books', titleBn: 'সেবানন্দ গ্রন্থাগার ও গ্রন্থ বিতরণ', inchargeEn: 'Library Incharge', inchargeBn: 'গ্রন্থাগার ইনচার্জ' },
  { key: 'GENERAL', titleEn: 'General Management Notice', titleBn: 'সাধারণ ব্যবস্থাপনা নোটিশ', inchargeEn: 'Advaita VOICE Admin', inchargeBn: 'অদ্বৈত ভয়েস প্রশাসন' },
] as const;

interface PostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoleKey?: string;
  onNoticePosted?: (notice: ManagerAnnouncement) => void;
}

export const PostNoticeModal: React.FC<PostNoticeModalProps> = ({
  isOpen,
  onClose,
  initialRoleKey = 'COORDINATOR',
  onNoticePosted
}) => {
  const { language } = useLanguage();
  const [roleKey, setRoleKey] = useState<any>(initialRoleKey);
  const [inchargeNameEn, setInchargeNameEn] = useState('');
  const [inchargeNameBn, setInchargeNameBn] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'NORMAL'>('HIGH');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descBn, setDescBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [actionRequiredBn, setActionRequiredBn] = useState('');
  const [actionRequiredEn, setActionRequiredEn] = useState('');

  // Sync role defaults when initialRoleKey changes or roleKey is selected
  useEffect(() => {
    const selectedRole = ROLE_OPTIONS.find(r => r.key === (initialRoleKey || roleKey)) || ROLE_OPTIONS[0];
    setRoleKey(selectedRole.key);
    setInchargeNameEn(selectedRole.inchargeEn);
    setInchargeNameBn(selectedRole.inchargeBn);
  }, [initialRoleKey, isOpen]);

  const handleRoleChange = (key: string) => {
    setRoleKey(key);
    const selectedRole = ROLE_OPTIONS.find(r => r.key === key);
    if (selectedRole) {
      setInchargeNameEn(selectedRole.inchargeEn);
      setInchargeNameBn(selectedRole.inchargeBn);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() && !titleEn.trim()) {
      toast.error(language === 'bn' ? 'অনুগ্রহ করে নোটিশের শিরোনাম দিন' : 'Please enter notice title');
      return;
    }
    if (!descBn.trim() && !descEn.trim()) {
      toast.error(language === 'bn' ? 'অনুগ্রহ করে নোটিশের বিস্তারিত বিবরণ দিন' : 'Please enter notice description');
      return;
    }

    const selectedRole = ROLE_OPTIONS.find(r => r.key === roleKey) || ROLE_OPTIONS[0];

    const finalTitleBn = titleBn.trim() || titleEn.trim();
    const finalTitleEn = titleEn.trim() || titleBn.trim();
    const finalDescBn = descBn.trim() || descEn.trim();
    const finalDescEn = descEn.trim() || descBn.trim();

    const created = addStoredNotice({
      roleKey,
      roleTitleEn: selectedRole.titleEn,
      roleTitleBn: selectedRole.titleBn,
      inchargeNameEn: inchargeNameEn || selectedRole.inchargeEn,
      inchargeNameBn: inchargeNameBn || selectedRole.inchargeBn,
      priority,
      titleEn: finalTitleEn,
      titleBn: finalTitleBn,
      descEn: finalDescEn,
      descBn: finalDescBn,
      actionRequiredBn: actionRequiredBn.trim() || undefined,
      actionRequiredEn: actionRequiredEn.trim() || undefined,
    });

    toast.success(language === 'bn' ? '📢 নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!' : '📢 Notice published successfully!');
    if (onNoticePosted) onNoticePosted(created);
    
    // Reset inputs & close
    setTitleBn('');
    setTitleEn('');
    setDescBn('');
    setDescEn('');
    setActionRequiredBn('');
    setActionRequiredEn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600/15 text-rose-600 dark:text-rose-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'bn' ? '📢 নতুন ব্যবস্থাপনা নোটিশ পোস্ট করুন' : '📢 Post Official Manager Notice'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'সকল আশ্রমবাসী ও শিক্ষার্থীদের জন্য জরুরি নির্দেশনা প্রকাশ' : 'Broadcast official directives & SOPs to all residents'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Department / Manager Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'বিভাগ / ম্যানেজারের ভূমিকা নির্বাচন করুন *' : 'Select Department / Manager Section *'}
            </label>
            <select
              value={roleKey}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {language === 'bn' ? `${opt.titleBn} (${opt.inchargeBn})` : `${opt.titleEn} (${opt.inchargeEn})`}
                </option>
              ))}
            </select>
          </div>

          {/* Incharge Name & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'ইনচার্জের নাম (বাংলা)' : 'Incharge Name (Bangla)'}
              </label>
              <input
                type="text"
                value={inchargeNameBn}
                onChange={(e) => setInchargeNameBn(e.target.value)}
                placeholder="যেমন: জ্ঞান জ্যোতি ত্রিপুরা"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'অগ্রাধিকার (Priority) *' : 'Notice Priority *'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['HIGH', 'MEDIUM', 'NORMAL'] as const).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                      priority === p
                        ? p === 'HIGH' ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : p === 'MEDIUM' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notice Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'নোটিশের শিরোনাম (বাংলা) *' : 'Notice Title (Bangla) *'}
            </label>
            <input
              type="text"
              required
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="যেমন: আগামী শুক্রবারের বিশেষ স্টাডি কেয়ার ও রিভিশন মিটিং"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Notice Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'বিস্তারিত নোটিশ বিবরণ ও নির্দেশনা *' : 'Detailed Notice Description & Instructions *'}
            </label>
            <textarea
              required
              rows={4}
              value={descBn}
              onChange={(e) => setDescBn(e.target.value)}
              placeholder="সকল আশ্রমবাসী ও শিক্ষার্থীদের উদ্দেশ্যে প্রয়োজনীয় নির্দেশনা ও সময়সূচি লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-normal text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Action Required */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-amber-500" />
              <span>{language === 'bn' ? 'বাধ্যতামূলক করণীয় (Action Required)' : 'Action Required / Deadline'}</span>
            </label>
            <input
              type="text"
              value={actionRequiredBn}
              onChange={(e) => setActionRequiredBn(e.target.value)}
              placeholder="যেমন: রাত ৮:০০ টার মধ্যে উপস্থিতি নিশ্চিত করুন"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>{language === 'bn' ? '📢 এখনই নোটিশ প্রকাশ করুন' : '📢 Publish Notice Now'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default PostNoticeModal;
