export interface LibraryResource {
  id: string;
  titleEn: string;
  titleBn: string;
  authorEn: string;
  authorBn: string;
  category: 'PRABHUPADA_BOOKS' | 'VOICE_COURSES' | 'CAMPS_GUIDES' | 'ACADEMICS_BCS' | 'SONGS_PRAYERS';
  categoryLabelEn: string;
  categoryLabelBn: string;
  format: 'PDF' | 'EPUB' | 'DOCX' | 'PPT' | 'AUDIO';
  pagesOrDuration: string;
  fileSize: string;
  descEn: string;
  descBn: string;
  downloadUrl?: string;
  readOnlineUrl?: string;
  featured?: boolean;
}

export const SEBANANDA_LIBRARY_RESOURCES: LibraryResource[] = [
  // 1. Srila Prabhupada Classic Literature
  {
    id: 'bg_as_it_is',
    titleEn: 'Bhagavad-gita As It Is (Complete 18 Chapters)',
    titleBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ (১৮টি অধ্যায় সম্পূর্ণ)',
    authorEn: 'HDG A.C. Bhaktivedanta Swami Prabhupada',
    authorBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    category: 'PRABHUPADA_BOOKS',
    categoryLabelEn: 'Srila Prabhupada Books',
    categoryLabelBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ',
    format: 'PDF',
    pagesOrDuration: '700 Pages',
    fileSize: '14.2 MB',
    descEn: 'The definitive English & Bengali edition with original Sanskrit verses, Roman transliteration, word-for-word meanings, translation, and elaborate purports.',
    descBn: 'মূল সংস্কৃত শ্লোক, অন্বয়, শব্দার্থ, বঙ্গানুবাদ এবং প্রামাণিক তাৎপর্য সহ আন্তর্জাতিক সর্বাধিক পঠিত গীতা সংস্করণ।',
    readOnlineUrl: 'https://vedabase.io/bn/library/bg/',
    downloadUrl: 'https://vedabase.io/bn/library/bg/',
    featured: true
  },
  {
    id: 'ssr_book',
    titleEn: 'The Science of Self-Realization (SSR)',
    titleBn: 'আত্মোপলব্ধির বিজ্ঞান',
    authorEn: 'HDG A.C. Bhaktivedanta Swami Prabhupada',
    authorBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    category: 'PRABHUPADA_BOOKS',
    categoryLabelEn: 'Srila Prabhupada Books',
    categoryLabelBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ',
    format: 'PDF',
    pagesOrDuration: '360 Pages',
    fileSize: '8.5 MB',
    descEn: 'Foundational interviews, essays, and lectures explaining the soul, modern science, yoga, spiritual masters, and the path of transcendence.',
    descBn: 'আত্মার বিজ্ঞান, আধুনিক বিজ্ঞান ও বৈদিক দর্শনের তুলনামূলক বিচার এবং পারমার্থিক জীবনের অনন্য নির্দেশিকা।',
    readOnlineUrl: 'https://vedabase.io/bn/library/ssr/',
    downloadUrl: 'https://vedabase.io/bn/library/ssr/',
    featured: true
  },
  {
    id: 'iso_book',
    titleEn: 'Sri Isopanisad (18 Sacred Mantras)',
    titleBn: 'শ্রী ঈশোপনিষদ (১৮টি দিব্য মন্ত্র)',
    authorEn: 'HDG A.C. Bhaktivedanta Swami Prabhupada',
    authorBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    category: 'PRABHUPADA_BOOKS',
    categoryLabelEn: 'Srila Prabhupada Books',
    categoryLabelBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ',
    format: 'PDF',
    pagesOrDuration: '140 Pages',
    fileSize: '3.8 MB',
    descEn: 'The foremost of the 108 principal Upanisads establishing the Isavasya principle—that everything belongs to the Supreme Lord.',
    descBn: '১০৮টি প্রধান উপনিষদের অন্যতম শ্রেষ্ঠ উপনিষদ—ঈশাবাস্য তত্ত্ব ও সর্বেশ্বরবাদের প্রামাণ্য শাস্ত্র।',
    readOnlineUrl: 'https://vedabase.io/bn/library/iso/',
    featured: false
  },
  {
    id: 'noi_book',
    titleEn: 'The Nectar of Instruction (Upadesamrta)',
    titleBn: 'শ্রী উপদেশামৃত (১১টি নির্দেশনামূলক শ্লোক)',
    authorEn: 'Srila Rupa Goswami / Purport by Srila Prabhupada',
    authorBn: 'শ্রীল রূপ গোস্বামী / তাৎপর্য: শ্রীল প্রভুপাদ',
    category: 'PRABHUPADA_BOOKS',
    categoryLabelEn: 'Srila Prabhupada Books',
    categoryLabelBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ',
    format: 'PDF',
    pagesOrDuration: '110 Pages',
    fileSize: '2.9 MB',
    descEn: '11 foundational instructions by Srila Rupa Goswami on mind control, overcoming anarthas, Vaishnava relationships, and residence in Radha-kunda.',
    descBn: 'মন নিয়ন্ত্রণ, জিহ্বা সংযম, ভক্তির অনুকূল ও প্রতিকূল বিষয় এবং বৈষ্ণব সদাচারের ১১টি সোনার উপদেশ।',
    readOnlineUrl: 'https://vedabase.io/bn/library/noi/',
    featured: true
  },
  {
    id: 'easy_journey_book',
    titleEn: 'Easy Journey to Other Planets (EJOP)',
    titleBn: 'অন্যান্য গ্রহে সুগম যাত্রা',
    authorEn: 'HDG A.C. Bhaktivedanta Swami Prabhupada',
    authorBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    category: 'PRABHUPADA_BOOKS',
    categoryLabelEn: 'Srila Prabhupada Books',
    categoryLabelBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ',
    format: 'PDF',
    pagesOrDuration: '95 Pages',
    fileSize: '2.1 MB',
    descEn: 'Antimatter, space travel, subtle body physics, and entering the eternal spiritual realm via anti-material technology.',
    descBn: 'এন্টিম্যাটার, মহাকাশ অভিযান এবং ভক্তিযোগের দ্বারা নিত্য চিন্ময় জগত বৈকুণ্ঠে গমনের বৈজ্ঞানিক রূপরেখা।',
    readOnlineUrl: 'https://vedabase.io/bn/library/ejop/'
  },
  {
    id: 'life_comes_from_life',
    titleEn: 'Life Comes From Life',
    titleBn: 'জীবন হতে জীবনের উৎপত্তি',
    authorEn: 'HDG A.C. Bhaktivedanta Swami Prabhupada',
    authorBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    category: 'PRABHUPADA_BOOKS',
    categoryLabelEn: 'Srila Prabhupada Books',
    categoryLabelBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ',
    format: 'PDF',
    pagesOrDuration: '180 Pages',
    fileSize: '4.5 MB',
    descEn: 'Morning walk discussions demolishing chemical evolution and neo-Darwinian assumptions through razor-sharp logic.',
    descBn: 'বিজ্ঞানীদের সাথে প্রাতঃভ্রমণ কথোপকথন—অন্ধ ডারউইনবাদ ও জড় রাসায়নিক বিবর্তনের যৌক্তিক খণ্ডন।',
    readOnlineUrl: 'https://vedabase.io/bn/library/lcfl/'
  },

  // 2. VOICE Course Modules & PPT Slides
  {
    id: 'dys_slides_pack',
    titleEn: 'DYS Complete 6-Session Slide Deck & Facilitator Notes',
    titleBn: 'ডিওয়াইএস ৬টি সেশনের পূর্ণাঙ্গ স্লাইড ডেক ও টিচার নোটস',
    authorEn: 'Advaita VOICE Youth Training Board',
    authorBn: 'অদ্বৈত ভয়েস যুব প্রশিক্ষণ পর্ষদ',
    category: 'VOICE_COURSES',
    categoryLabelEn: 'VOICE Courses & PPTs',
    categoryLabelBn: 'ভয়েস কোর্স স্লাইড ও নোট',
    format: 'PPT',
    pagesOrDuration: '6 Slide Sets (180 Slides)',
    fileSize: '35.0 MB',
    descEn: 'Official high-definition PowerPoint presentations for all 6 DYS sessions (Mastermind Universe, 4 Defects, Vedic Solutions, Soul, Substance & Shadow, ABCD Guru).',
    descBn: 'ডিওয়াইএস কোর্সের ৬টি সেশনের অফিসিয়াল পাওয়ারপয়েন্ট স্লাইড—রহস্যময় জগত, ৪ ত্রুটি, বৈদিক সমাধান, আত্মা, বাস্তব ও ছায়া, ABCD সূত্র।',
    featured: true
  },
  {
    id: 'dys_workbook_pdf',
    titleEn: 'DYS Student Workbook & Daily Practical Log',
    titleBn: 'ডিওয়াইএস স্টুডেন্ট ওয়ার্কবুক ও দৈনন্দিন ডায়রি',
    authorEn: 'HG Radheshyam Das / VOICE Publications',
    authorBn: 'শ্রীল রাধেশ্যাম দাস / ভয়েস পাবলিকেশন',
    category: 'VOICE_COURSES',
    categoryLabelEn: 'VOICE Courses & PPTs',
    categoryLabelBn: 'ভয়েস কোর্স স্লাইড ও নোট',
    format: 'PDF',
    pagesOrDuration: '88 Pages',
    fileSize: '6.2 MB',
    descEn: 'Student reflection questions, home assignment sheets, and daily habit tracker for the 6-week DYS curriculum.',
    descBn: 'শিক্ষার্থীদের জন্য প্রতি সেশনের প্রশ্নব্যাংক, হোমওয়ার্ক শিট এবং সাপ্তাহিক অভ্যাস পর্যবেক্ষণ ডায়রি।',
    featured: true
  },
  {
    id: 'ss_compendium',
    titleEn: 'Spiritual Scientist (SS) Compendium & Research Papers',
    titleBn: 'স্পিরিচুয়াল সায়েন্টিস্ট (এসএস) রিসার্চ পেপার্স ও হ্যান্ডবুক',
    authorEn: 'Bhaktivedanta Institute & VOICE',
    authorBn: 'ভক্তিবেদান্ত ইনস্টিটিউট ও ভয়েস',
    category: 'VOICE_COURSES',
    categoryLabelEn: 'VOICE Courses & PPTs',
    categoryLabelBn: 'ভয়েস কোর্স স্লাইড ও নোট',
    format: 'PDF',
    pagesOrDuration: '160 Pages',
    fileSize: '9.8 MB',
    descEn: 'Scientific apologetics addressing intelligent design, fine-tuning of cosmological constants, consciousness, and origin of genetic code.',
    descBn: 'মহাজাগতিক সূক্ষ্ম ভারসাম্য, ডিএনএ কোড এবং কোয়ান্টাম চেতনার ওপর বৈজ্ঞানিক প্রবন্ধ সংকলন।'
  },
  {
    id: 'utkarsha_book',
    titleEn: 'Utkarsha Book — Character & Sadhana Excellence Manual',
    titleBn: 'উৎকর্ষ বুক — চরিত্র গঠন ও সাধনার উৎকর্ষ ম্যানুয়াল',
    authorEn: 'Advaita VOICE Ashram Publications',
    authorBn: 'অদ্বৈত ভয়েস আশ্রম পাবলিকেশন',
    category: 'VOICE_COURSES',
    categoryLabelEn: 'VOICE Courses & PPTs',
    categoryLabelBn: 'ভয়েস কোর্স স্লাইড ও নোট',
    format: 'PDF',
    pagesOrDuration: '124 Pages',
    fileSize: '7.4 MB',
    descEn: 'The essential ashram resident guidebook for character mastery, early morning discipline, time mastery, and anartha-nivritti.',
    descBn: 'আশ্রমবাসী শিক্ষার্থীদের চরিত্র গঠন, ভোরে জাগরণ, অনর্থ নিবৃত্তি ও সাধনার মানোন্নয়নের মূল পাঠ্যবই।',
    featured: true
  },

  // 3. Camp Handbooks & Japa Trackers
  {
    id: 'sankalpa_camp_guide',
    titleEn: 'Sankalpa Camp Vow Sheet & Handbook',
    titleBn: 'সঙ্কল্প ক্যাম্প ব্রতপত্র ও সহায়িকা বুকলেট',
    authorEn: 'Advaita VOICE Camp Organization Dept',
    authorBn: 'অদ্বৈত ভয়েস ক্যাম্প পরিচালনা বিভাগ',
    category: 'CAMPS_GUIDES',
    categoryLabelEn: 'Camp Handbooks',
    categoryLabelBn: 'ক্যাম্প হ্যান্ডবুক ও গাইড',
    format: 'PDF',
    pagesOrDuration: '32 Pages',
    fileSize: '2.5 MB',
    descEn: 'Sadhana vow declarations, overcoming bad habits guide, and 16-rounds japa commitment format for Step 1 Sankalpa Camp attendees.',
    descBn: 'সঙ্কল্প ক্যাম্পের ব্রতনামা, কুভ্যাস ত্যাগের উপায় এবং ১৬ মালা জপ প্রতিজ্ঞা ফর্ম্যাট।'
  },
  {
    id: 'japa_64_tracker',
    titleEn: '64-Rounds (Laksha-Nama) Japa Marathon Tracking Sheet',
    titleBn: '৬৪ মালা (লক্ষ নাম) জপ ম্যারাথন ট্র্যাকিং শিট',
    authorEn: 'Advaita VOICE Japa Immersion Wing',
    authorBn: 'অদ্বৈত ভয়েস জপ উইং',
    category: 'CAMPS_GUIDES',
    categoryLabelEn: 'Camp Handbooks',
    categoryLabelBn: 'ক্যাম্প হ্যান্ডবুক ও গাইড',
    format: 'PDF',
    pagesOrDuration: '4 Pages',
    fileSize: '850 KB',
    descEn: 'Hour-by-hour 64-round logging matrix with concentration tips, avoiding 10 offenses, and maintaining deep meditation.',
    descBn: 'ঘণ্টাভিত্তিক ৬৪ মালা জপ লগ শিট, ১০ নামাপরাধ বর্জন নির্দেশিকা ও গভীর একাগ্রতার সূত্র।'
  },
  {
    id: 'ashroy_saranagati_guide',
    titleEn: 'Ashroy & Saranagati Diksha Preparation Workbook',
    titleBn: 'আশ্রয় ও শরণাগতি দীক্ষা প্রস্তুতি নির্দেশিকা',
    authorEn: 'Advaita VOICE Counselor Board',
    authorBn: 'অদ্বৈত ভয়েস কাউন্সেলর বোর্ড',
    category: 'CAMPS_GUIDES',
    categoryLabelEn: 'Camp Handbooks',
    categoryLabelBn: 'ক্যাম্প হ্যান্ডবুক ও গাইড',
    format: 'PDF',
    pagesOrDuration: '64 Pages',
    fileSize: '4.1 MB',
    descEn: 'Comprehensive questionnaire, guru-parampara chart, interview checklist, and vows format for candidates preparing for Ashroy and Harinama Diksha.',
    descBn: 'আশ্রয় ও দীক্ষা প্রার্থীদের সাক্ষাৎকার প্রস্তুতি প্রশ্নব্যাংক, গুরুপরম্পরা তালিকা ও ব্রতপত্র।'
  },

  // 4. University Academic & BCS Resources
  {
    id: 'bcs_gk_digest',
    titleEn: 'Study Care BCS & Job Preparation General Knowledge Compendium',
    titleBn: 'স্টাডি কেয়ার বিসিএস ও জব প্রস্তুতি সাধারণ জ্ঞান ডাইজেস্ট',
    authorEn: 'Gian Juti & Pranto C Das (Study Care Board)',
    authorBn: 'জ্ঞান জ্যোতি ও প্রান্ত চন্দ্র দাস (স্টাডি কেয়ার বোর্ড)',
    category: 'ACADEMICS_BCS',
    categoryLabelEn: 'University & BCS Care',
    categoryLabelBn: 'বিশ্ববিদ্যালয় ও বিসিএস প্রস্তুতি',
    format: 'PDF',
    pagesOrDuration: '210 Pages',
    fileSize: '11.5 MB',
    descEn: 'Curated high-yield notes for Bangladesh Affairs, International Affairs, General Science, and Math shortcuts for university and competitive exams.',
    descBn: 'বাংলাদেশ বিষয়াবলি, আন্তর্জাতিক বিষয়াবলি, বিজ্ঞান ও গণিত শর্টকাট নোটসের সমৃদ্ধ সংকলন।'
  },
  {
    id: 'cu_exam_revision_planner',
    titleEn: 'University of Chittagong Semester Exam 30-Day Revision Tracker',
    titleBn: 'চবি সেমিস্টার ফাইনাল ৩০ দিনের রিভিশন ট্র্যাকার ও পড়ার রুটিন',
    authorEn: 'Advaita VOICE Academic Care Wing',
    authorBn: 'অদ্বৈত ভয়েস একাডেমিক কেয়ার উইং',
    category: 'ACADEMICS_BCS',
    categoryLabelEn: 'University & BCS Care',
    categoryLabelBn: 'বিশ্ববিদ্যালয় ও বিসিএস প্রস্তুতি',
    format: 'DOCX',
    pagesOrDuration: '12 Pages',
    fileSize: '1.2 MB',
    descEn: 'Dynamic weekly study time blocking template, syllabus coverage checkboxes, and past question analysis framework.',
    descBn: 'সাপ্তাহিক রুটিন টেমপ্লেট, সিলেবাস কভারেজ চেকলিস্ট এবং বিগত বছরের প্রশ্ন বিশ্লেষণ শিট।'
  },

  // 5. Vaishnava Songs & Shloka Memorizers
  {
    id: 'vaishnava_songbook',
    titleEn: 'Sri Gaudiya Giti-Guccha (Complete Vaishnava Songbook)',
    titleBn: 'শ্রী গৌড়ীয় গীতি-গুচ্ছ (পূর্ণাঙ্গ বৈষ্ণব পদাবলী ও আরতি সংকলন)',
    authorEn: 'Sri Saccidananda Bhaktivinoda Thakura & Narottama Dasa Thakura',
    authorBn: 'শ্রীল ভক্তিবিনোদ ঠাকুর ও শ্রীল নরোত্তম দাস ঠাকুর',
    category: 'SONGS_PRAYERS',
    categoryLabelEn: 'Songs & Prayers',
    categoryLabelBn: 'বৈষ্ণব পদাবলী ও স্তোত্র',
    format: 'PDF',
    pagesOrDuration: '280 Pages',
    fileSize: '6.8 MB',
    descEn: 'Complete lyrics, Bengali verses, and English translations of Mangalarati, Gaura Arati, Damodarashtakam, Saranagati songs, and Gitavali.',
    descBn: 'মঙ্গল আরতি, গৌর আরতি, দামোদরাষ্টকম, শরণাগতি ও গীতাবলীর সকল বিখ্যাত বৈষ্ণব পদের বঙ্গানুবাদ সহ পূর্ণ সংকলন।'
  },
  {
    id: 'essential_108_shlokas',
    titleEn: '108 Essential Preaching Shlokas with Word-by-Word Meaning',
    titleBn: '১০৮টি মৌলিক প্রচার শ্লোক ও শব্দার্থ সংকলন',
    authorEn: 'Advaita VOICE Preachers Board',
    authorBn: 'অদ্বৈত ভয়েস প্রচারক পর্ষদ',
    category: 'SONGS_PRAYERS',
    categoryLabelEn: 'Songs & Prayers',
    categoryLabelBn: 'বৈষ্ণব পদাবলী ও স্তোত্র',
    format: 'PDF',
    pagesOrDuration: '76 Pages',
    fileSize: '3.4 MB',
    descEn: 'The core memory verses from Bhagavad-gita, Srimad-Bhagavatam, and Chaitanya-Charitamrita for campus debates and personal realization.',
    descBn: 'গীতা, ভাগবতম ও চৈতন্যচরিতামৃত থেকে ১০৮টি মুখস্থ করার মতো শক্তিশালী প্রমাণ শ্লোক।'
  }
];
