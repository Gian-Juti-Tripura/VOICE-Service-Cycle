export interface CourseItem {
  id: string;
  titleEn: string;
  titleBn: string;
  durationEn: string;
  durationBn: string;
  descEn: string;
  descBn: string;
  badgeEn: string;
  badgeBn: string;
  topicsCount: number;
}

export interface CampItem {
  id: string;
  titleEn: string;
  titleBn: string;
  locationEn: string;
  locationBn: string;
  durationEn: string;
  durationBn: string;
  descEn: string;
  descBn: string;
  highlightsEn: string[];
  highlightsBn: string[];
}

export const ALL_COURSES_DATA: CourseItem[] = [
  {
    id: 'dys',
    titleEn: 'Discover Your Self (DYS)',
    titleBn: 'ডিসকভার ইয়োর সেলফ (ডিওয়াইএস)',
    durationEn: '6 Weeks (1 session/week)',
    durationBn: '৬ সপ্তাহ (সাপ্তাহিক ১টি সেশন)',
    descEn: 'Foundational Vedic wisdom course exploring the science of soul, mind control, existence of God, and karma.',
    descBn: 'আত্মার বিজ্ঞান, মন নিয়ন্ত্রণ, ঈশ্বরের অস্তিত্ব ও কর্মফলের রহস্য বিষয়ক ৬ সপ্তাহের ভিত্তিপ্রস্তর কোর্স।',
    badgeEn: 'Level 1 Foundation',
    badgeBn: 'লেভেল ১ ভিত্তিপ্রস্তর',
    topicsCount: 6
  },
  {
    id: 'ebg',
    titleEn: 'Essence of Bhagavad-gita (EBG)',
    titleBn: 'এসেন্স অব ভগবদ্গীতা (ইবিজি)',
    durationEn: '12 Weeks Thematic Course',
    durationBn: '১২ সপ্তাহের বিষয়ভিত্তিক কোর্স',
    descEn: 'Systematic thematic study of Bhagavad Gita As It Is, covering Jiva, Prakriti, Kala, Karma, and Isvara.',
    descBn: 'জীব, প্রকৃতি, কাল, কর্ম ও ঈশ্বর—শ্রীমদ্ভগবদ্গীতা যথার্থ-এর ৫টি মূল তত্ত্বের সার্বিক ও ধারাবাহিক অধ্যয়ন।',
    badgeEn: 'Level 2 Intermediate',
    badgeBn: 'লেভেল ২ ইন্টারমিডিয়েট',
    topicsCount: 12
  },
  {
    id: 'vvs',
    titleEn: 'Victorious Youth & Vedic Secrets (VVS)',
    titleBn: 'ভিক্টোরিয়াস ইয়ুথ অ্যান্ড বৈদিক সিক্রেটস (ভিভিএস)',
    durationEn: '8 Weeks Practical Training',
    durationBn: '৮ সপ্তাহের প্রায়োগিক প্রশিক্ষণ',
    descEn: 'Character excellence, brahmacharya principles, overcoming habits, dynamic time management & focus for university students.',
    descBn: 'ব্রহ্মচর্য পালন, চারিত্রিক দৃঢ়তা, ডিজিটাল আসক্তি দূরীকরণ ও বিশ্ববিদ্যালয় জীবনে সফলতার বৈদিক সূত্র।',
    badgeEn: 'Level 3 Mastery',
    badgeBn: 'লেভেল ৩ মাস্টারি',
    topicsCount: 8
  },
  {
    id: 'bbs',
    titleEn: 'Bhagavat Bhakti Shastri (BBS)',
    titleBn: 'ভাগবত ভক্তি শাস্ত্রী (বিবিএস)',
    durationEn: '1 Year Academic Curriculum',
    durationBn: '১ বছরের প্রাতিষ্ঠানিক কোর্স',
    descEn: 'In-depth study of Bhagavad Gita, Nectar of Devotion (Bhakti-rasamrita-sindhu), Sri Isopanisad & Nectar of Instruction.',
    descBn: 'ভগবদ্গীতা, ভক্তিসিন্ধু, ঈশোপনিষদ ও উপদেশামৃতের গভীর ও প্রমাণভিত্তিক শাস্ত্রীয় বিশ্লেষণ।',
    badgeEn: 'Diploma Degree',
    badgeBn: 'শাস্ত্রী ডিপ্লোমা',
    topicsCount: 48
  },
  {
    id: 'ptc',
    titleEn: 'Preacher’s Training Course (PTC)',
    titleBn: 'প্রচারক প্রশিক্ষণ কোর্স (পিটিসি)',
    durationEn: '8 Weeks Intensive',
    durationBn: '৮ সপ্তাহের নিবিড় প্রশিক্ষণ',
    descEn: 'Public speaking, presenting PPT slide seminars, addressing scientific challenges, campus counseling & Vaishnava etiquette.',
    descBn: 'পাবলিক স্পিকিং, প্রেজেন্টেশন প্রদান, বিজ্ঞানের প্রশ্নের উত্তরদান ও বৈষ্ণব সদাচার প্রশিক্ষণ।',
    badgeEn: 'Leadership',
    badgeBn: 'নেতৃত্ব প্রশিক্ষণ',
    topicsCount: 16
  }
];

export const ALL_CAMPS_DATA: CampItem[] = [
  {
    id: 'camp_annual',
    titleEn: 'Annual Advaita VOICE Youth Retreat',
    titleBn: 'বার্ষিক অদ্বৈত ভয়েস যুব রিট্রিট ও মহা শিবির',
    locationEn: 'Chittagong Hill Tracts & Bandarban Valley',
    locationBn: 'বান্দরবান উপত্যকা ও পাহাড়ি প্রাকৃতিক পরিবেশ',
    durationEn: '3 Days, 2 Nights (Residential)',
    durationBn: '৩ দিন ২ রাত (অনাবাসিক ও আবাসিক)',
    descEn: 'Intensive spiritual retreat with morning Japa walks in nature, interactive seminars, dynamic debates, and blissful campfires.',
    descBn: 'প্রকৃতির মাঝে প্রাতঃকালীন জপ পরিক্রমা, যুব সেমিনার, বিতর্ক প্রতিযোগিতা ও ক্যাম্পফায়ার ভজন সন্ধ্যা।',
    highlightsEn: ['64-Rounds Japa Challenge', 'Youth Leadership Workshop', 'Nature Parikrama', 'Campfire Sankirtan'],
    highlightsBn: ['৬৪ মালা জপ চ্যালেঞ্জ', 'নেতৃত্ব কর্মশালা', 'প্রকৃতি পরিক্রমা', 'ক্যাম্পফায়ার সংকীর্তন']
  },
  {
    id: 'camp_udgosh',
    titleEn: 'Mega Youth Fest "UDGOSH"',
    titleBn: 'মেগা ইয়ুথ ফেস্ট "উদ্ঘোষ"',
    locationEn: 'University of Chittagong Central Auditorium',
    locationBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় মিলনায়তন',
    durationEn: 'Full Day Campus Convention',
    durationBn: 'দিনব্যাপী ক্যাম্পাস কনভেনশন',
    descEn: 'Grand university students convention with keynote lectures by senior ISKCON sannyasis, drama, musical mantra rock, and festivity.',
    descBn: 'বরেণ্য বৈষ্ণব সন্ন্যাসীদের দিকনির্দেশনামূলক বক্তব্য, নাটক, বৈদিক সঙ্গীত ও ১০০০+ শিক্ষার্থীর মহাপ্রসাদ উৎসব।',
    highlightsEn: ['1000+ Students Participation', 'Spiritual Drama & Dance', 'Inter-University Quiz', 'Grand Feast'],
    highlightsBn: ['১০০০+ শিক্ষার্থীর অংশগ্রহণ', 'আধ্যাত্মিক নাটক', 'আন্তঃবিশ্ববিদ্যালয় কুইজ', 'মহা প্রীতিভোজ']
  },
  {
    id: 'camp_yatra',
    titleEn: 'Annual Mayapur & Vraja Mandala Parikrama Yatra',
    titleBn: 'বার্ষিক শ্রীমায়াপুর ও ব্রজমণ্ডল পরিক্রমা যাত্রা',
    locationEn: 'Sri Mayapur Dham & Sri Vrindavan Dham',
    locationBn: 'শ্রীধাম মায়াপুর ও শ্রীল বৃন্দাবন ধাম',
    durationEn: '7 Days Sacred Pilgrimage',
    durationBn: '৭ দিনের পবিত্র তীর্থযাত্রা ও পরিক্রমা',
    descEn: 'Sacred parikrama visiting the holy pastime places of Sri Chaitanya Mahaprabhu and Sri Sri Radha Krishna with senior acharyas.',
    descBn: 'শ্রীচৈতন্য মহাপ্রভু ও রাধাকৃষ্ণের অপ্রাকৃত লীলাভূমি দর্শন, যমুনা স্নান ও ধাম পরিক্রমা।',
    highlightsEn: ['Govardhana Parikrama', 'Yamuna Snana', 'Mayapur Temple of Vedic Planetarium', 'Kathāmṛta'],
    highlightsBn: ['গোবর্ধন পরিক্রমা', 'যমুনা স্নান', 'টিওভিপি দর্শন', 'অমৃতময় ভাগবত কথা']
  },
  {
    id: 'camp_padayatra',
    titleEn: 'Campus Padayatra & Book Marathon Camp',
    titleBn: 'ক্যাম্পাস পদযাত্রা ও গীতা বিতরণ ক্যাম্প',
    locationEn: 'CU Campus & Chattogram District Villages',
    locationBn: 'চবি ক্যাম্পাস ও সংলগ্ন উপশহর',
    durationEn: 'Weekend Outreach Camp',
    durationBn: 'সাপ্তাহিক প্রচার ক্যাম্প',
    descEn: 'Door-to-door book distribution, village Harinama Sankirtana processions, and distribution of sanctified Vedic literature.',
    descBn: 'দ্বারে দ্বারে গিয়ে শ্রীল প্রভুপাদের গ্রন্থ বিতরণ, নগর কীর্তন ও গ্রাম্য ধর্মসভা।',
    highlightsEn: ['Harinama Procession', 'Book Marathon', 'Free Prasad Distribution', 'Village Preaching'],
    highlightsBn: ['নগর সংকীর্তন', 'বই বিতরণ', 'অন্নদান সেবা', 'গ্রাম্য প্রচার']
  }
];
