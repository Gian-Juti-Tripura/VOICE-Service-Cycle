import React, { useState } from 'react';
import { SEBANANDA_LIBRARY_RESOURCES, type LibraryResource } from '../../data/libraryData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Search, ExternalLink, ArrowLeft, 
  FileText, Check, Copy, Share2, 
  GraduationCap, Tent, Music, BookMarked,
  UploadCloud
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const SebanandaLibrary: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [, setSelectedResource] = useState<LibraryResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', labelEn: 'All Resources', labelBn: 'সকল সামগ্রী', icon: BookOpen },
    { key: 'PRABHUPADA_BOOKS', labelEn: 'Srila Prabhupada Books', labelBn: 'শ্রীল প্রভুপাদের গ্রন্থ', icon: BookMarked },
    { key: 'VOICE_COURSES', labelEn: 'VOICE Course PPTs & Notes', labelBn: 'ভয়েস কোর্স স্লাইড ও নোট', icon: GraduationCap },
    { key: 'CAMPS_GUIDES', labelEn: 'Camp Handbooks & Japa Trackers', labelBn: 'ক্যাম্প গাইড ও জপ শিট', icon: Tent },
    { key: 'ACADEMICS_BCS', labelEn: 'University & BCS Care', labelBn: 'বিশ্ববিদ্যালয় ও বিসিএস', icon: FileText },
    { key: 'SONGS_PRAYERS', labelEn: 'Songbook & 108 Shlokas', labelBn: 'বৈষ্ণব গীতি ও ১০৮ শ্লোক', icon: Music }
  ];

  const filteredResources = SEBANANDA_LIBRARY_RESOURCES.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = item.titleEn.toLowerCase().includes(query) ||
      item.titleBn.toLowerCase().includes(query) ||
      item.authorEn.toLowerCase().includes(query) ||
      item.authorBn.toLowerCase().includes(query) ||
      item.descEn.toLowerCase().includes(query) ||
      item.descBn.toLowerCase().includes(query);
    
    return matchesCategory && matchesSearch;
  });

  const handleCopyLink = (item: LibraryResource) => {
    const url = item.readOnlineUrl || item.downloadUrl || window.location.href;
    navigator.clipboard.writeText(`${item.titleEn} - Read at: ${url}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success(language === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Resource link copied!');
  };

  const handleShareWhatsApp = (item: LibraryResource) => {
    const url = item.readOnlineUrl || item.downloadUrl || 'https://vedabase.io/bn/';
    const msg = `*সেবানন্দ গ্রন্থাগার (Sebananda E-Library Resource)*\n` +
      `📖 *Title:* ${item.titleEn} (${item.titleBn})\n` +
      `✍️ *Author:* ${item.authorEn}\n` +
      `📂 *Category:* ${item.categoryLabelEn}\n` +
      `🔗 *Access Link:* ${url}\n\n` +
      `Shared from Advaita VOICE University Ashram Library. 🙏`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSuggestBookWhatsApp = () => {
    const msg = `Hare Krishna! I would like to request/contribute a new E-book or PDF to the Sebananda Library (সেবানন্দ গ্রন্থাগার). Here are the details... 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-xs hover:shadow-md transition-all duration-200 group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              {language === 'bn' ? 'সেবানন্দ গ্রন্থাগার • চট্টগ্রাম বিশ্ববিদ্যালয়' : 'Sebananda Library • CU Ashram'}
            </span>
          </div>
        </div>

        {/* Hero Header with Physical Ashram Banner Style */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md inline-flex items-center gap-1.5">
                <BookOpen size={13} />
                <span>সেবানন্দ গ্রন্থাগার (Sebananda E-Library)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase tracking-wide">
                Please Speak in English
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'ডিজিটাল সেবানন্দ গ্রন্থাগার ও জ্ঞানভাণ্ডার' : 'Sebananda Digital Library & Resources Vault'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'শ্রীল প্রভুপাদের মূল গ্রন্থাবলি, ডিওয়াইএস স্লাইড ও ওয়ার্কবুক, ক্যাম্প হ্যান্ডবুক, চবি সেমিস্টার ও বিসিএস পরীক্ষার নোটস এবং বৈষ্ণব পদাবলীর ডিজিটাল সংগ্রহশালা।'
                : 'Free authentic E-books, high-definition course slide decks, camp handbooks, university exam guides, and Vaishnava songbooks.'}
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap text-xs font-bold">
              <button
                onClick={handleSuggestBookWhatsApp}
                className="px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
              >
                <UploadCloud size={14} className="text-emerald-700" />
                <span>{language === 'bn' ? 'নতুন গ্রন্থ / PDF যুক্ত করতে অনুরোধ পাঠান' : 'Contribute / Request Book via WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Quick Filter Bar */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'গ্রন্থের নাম, লেখক বা বিষয় দিয়ে খুঁজুন (যেমন: গীতা, DYS, বিসিএস)...' : 'Search by title, author, keyword (e.g. Gita, DYS, BCS, 64-rounds)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon size={14} />
                  <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Resources Counter & Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {filteredResources.length} {language === 'bn' ? 'টি সামগ্রী পাওয়া গেছে' : 'Resources Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                
                {/* Top Meta Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-mono">
                      {resource.format} • {resource.pagesOrDuration}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {resource.fileSize}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-snug">
                    {language === 'bn' ? resource.titleBn : resource.titleEn}
                  </h3>

                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✍️ {language === 'bn' ? resource.authorBn : resource.authorEn}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal">
                    {language === 'bn' ? resource.descBn : resource.descEn}
                  </p>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  
                  {resource.readOnlineUrl ? (
                    <a
                      href={resource.readOnlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <ExternalLink size={13} />
                      <span>{language === 'bn' ? 'অনলাইনে পড়ুন' : 'Read Online'}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedResource(resource)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer"
                    >
                      <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyLink(resource)}
                      title="Copy Resource Link"
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      {copiedId === resource.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(resource)}
                      title="Share to WhatsApp"
                      className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default SebanandaLibrary;
