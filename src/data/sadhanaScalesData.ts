export interface ScaleRubric {
  scaleId: 1 | 2 | 3 | 4;
  titleEn: string;
  titleBn: string;
  targetAudienceEn: string;
  targetAudienceBn: string;
  
  toBed: Array<{ cutoff: string; marks: number; label: string }>;
  wakeUp: Array<{ cutoff: string; marks: number; label: string }>;
  daySleep: Array<{ cutoff: string; marks: number; label: string; penaltyNote?: string }>;
  
  japa: Array<{ cutoff: string; marks: number; label: string }>;
  spBookDailyMarks: number; // 25
  prescribedHearing: {
    spWeeklyQuotaMin?: number;
    guruWeeklyQuotaMin?: number;
    otherWeeklyQuotaMin?: number;
    standardHoursDaily?: number;
    marks: number;
    noteEn?: string;
    noteBn?: string;
  };
  
  studyAcademics: Array<{ cutoff: string; marks: number; label: string }>;
  cleaningMarks: number;
  followUpMarks: number;
  btgMarks: number;
  
  morningClassMarks: number; // 25 (5 for late)
  sadhanaCardMarks: number;  // 25
  slokaMarks: number;        // 25
  bhajanGayatriMarks: number;// 25
}

export const SADHANA_SCALES: Record<number, ScaleRubric> = {
  1: {
    scaleId: 1,
    titleEn: 'Scale One: Newcomer',
    titleBn: 'স্কেল এক: নবীন ভক্ত (১-৬ মাস)',
    targetAudienceEn: 'Newcomer in Krishna Consciousness (1–2 months or at best 6 months)',
    targetAudienceBn: 'কৃষ্ণভাবনায় নবীন (১-২ মাস বা সর্বোচ্চ ৬ মাস)',
    toBed: [
      { cutoff: '22:00', marks: 25, label: '10:00 PM or before' },
      { cutoff: '22:15', marks: 20, label: 'Before 10:15 PM' },
      { cutoff: '22:30', marks: 15, label: 'Before 10:30 PM' },
      { cutoff: '22:45', marks: 10, label: 'Before 10:45 PM' },
      { cutoff: '23:00', marks: 5, label: 'Before 11:00 PM' },
      { cutoff: '23:30', marks: 0, label: 'Before 11:30 PM' },
      { cutoff: '24:00', marks: -5, label: 'After 11:30 PM' }
    ],
    wakeUp: [
      { cutoff: '04:30', marks: 25, label: '4:30 AM or before' },
      { cutoff: '04:35', marks: 20, label: 'Before 4:35 AM' },
      { cutoff: '04:45', marks: 15, label: 'Before 4:45 AM' },
      { cutoff: '04:50', marks: 10, label: 'Before 4:50 AM' },
      { cutoff: '04:55', marks: 5, label: 'Before 4:55 AM' },
      { cutoff: '05:00', marks: 0, label: 'Before 5:00 AM' },
      { cutoff: '06:00', marks: -5, label: 'After 5:00 AM' }
    ],
    daySleep: [
      { cutoff: '30', marks: 25, label: '30 min or less' },
      { cutoff: '60', marks: 20, label: '60 min' },
      { cutoff: '70', marks: 15, label: '70 min' },
      { cutoff: '80', marks: 10, label: '80 min' },
      { cutoff: '90', marks: 5, label: '90 min' },
      { cutoff: '100', marks: 0, label: '100 min' },
      { cutoff: '120', marks: -5, label: 'Beyond 100 min (-5 per 10m)' }
    ],
    japa: [
      { cutoff: '08:00', marks: 25, label: 'Before 8:00 AM' },
      { cutoff: '09:00', marks: 20, label: 'Before 9:00 AM' },
      { cutoff: '13:00', marks: 15, label: 'Before 1:00 PM' },
      { cutoff: '15:00', marks: 10, label: 'Before 3:00 PM' },
      { cutoff: '18:00', marks: 5, label: 'Before 6:00 PM' },
      { cutoff: '21:00', marks: 0, label: 'Before 9:00 PM' },
      { cutoff: '24:00', marks: -5, label: 'After 9:00 PM / Before 12 AM' }
    ],
    spBookDailyMarks: 25,
    prescribedHearing: {
      standardHoursDaily: 1,
      marks: 25,
      noteEn: 'Prescribed Lecture Hearing: 1 hour daily',
      noteBn: 'ধারাবাহিক প্রবচন শ্রবণ: দৈনিক ১ ঘণ্টা'
    },
    studyAcademics: [
      { cutoff: '120', marks: 25, label: '2 hours or more' },
      { cutoff: '105', marks: 20, label: '1 hour 45 min' },
      { cutoff: '90', marks: 15, label: '1 hour 30 min' },
      { cutoff: '60', marks: 10, label: '1 hour' },
      { cutoff: '30', marks: 5, label: '30 minutes' },
      { cutoff: '0', marks: 0, label: 'Less than 30 min' }
    ],
    cleaningMarks: 25,
    followUpMarks: 25,
    btgMarks: 25,
    morningClassMarks: 25,
    sadhanaCardMarks: 25,
    slokaMarks: 25,
    bhajanGayatriMarks: 25
  },
  2: {
    scaleId: 2,
    titleEn: 'Scale Two: Student Level 1',
    titleBn: 'স্কেল দুই: সাধারণ ছাত্র ভক্ত',
    targetAudienceEn: 'VOICE Regular Student',
    targetAudienceBn: 'ভয়েসের নিয়মিত ছাত্র ভক্ত',
    toBed: [
      { cutoff: '22:00', marks: 25, label: '10:00 PM or before' },
      { cutoff: '22:15', marks: 20, label: 'Before 10:15 PM' },
      { cutoff: '22:30', marks: 15, label: 'Before 10:30 PM' },
      { cutoff: '22:45', marks: 10, label: 'Before 10:45 PM' },
      { cutoff: '23:00', marks: 5, label: 'Before 11:00 PM' },
      { cutoff: '23:30', marks: 0, label: 'Before 11:30 PM' },
      { cutoff: '24:00', marks: -5, label: 'After 11:30 PM' }
    ],
    wakeUp: [
      { cutoff: '04:00', marks: 25, label: '4:00 AM or before' },
      { cutoff: '04:10', marks: 20, label: 'Before 4:10 AM' },
      { cutoff: '04:15', marks: 15, label: 'Before 4:15 AM' },
      { cutoff: '04:20', marks: 10, label: 'Before 4:20 AM' },
      { cutoff: '04:25', marks: 5, label: 'Before 4:25 AM' },
      { cutoff: '04:30', marks: 0, label: '4:30 AM' },
      { cutoff: '05:00', marks: -5, label: 'After 4:30 AM' }
    ],
    daySleep: [
      { cutoff: '30', marks: 25, label: '30 min or less' },
      { cutoff: '60', marks: 20, label: '60 min' },
      { cutoff: '70', marks: 15, label: '70 min' },
      { cutoff: '80', marks: 10, label: '80 min' },
      { cutoff: '90', marks: 5, label: '90 min' },
      { cutoff: '100', marks: 0, label: '100 min' },
      { cutoff: '120', marks: -5, label: 'Beyond 100 min (-5 per 10m)' }
    ],
    japa: [
      { cutoff: '08:00', marks: 25, label: 'Before 8:00 AM' },
      { cutoff: '09:00', marks: 20, label: 'Before 9:00 AM' },
      { cutoff: '13:00', marks: 15, label: 'Before 1:00 PM' },
      { cutoff: '15:00', marks: 10, label: 'Before 3:00 PM' },
      { cutoff: '18:00', marks: 5, label: 'Before 6:00 PM' },
      { cutoff: '21:00', marks: 0, label: 'Before 9:00 PM' },
      { cutoff: '24:00', marks: -5, label: 'After 9:00 PM' }
    ],
    spBookDailyMarks: 25,
    prescribedHearing: {
      standardHoursDaily: 1,
      marks: 25,
      noteEn: 'Prescribed Lecture Hearing: 1 hour daily',
      noteBn: 'ধারাবাহিক প্রবচন শ্রবণ: দৈনিক ১ ঘণ্টা'
    },
    studyAcademics: [
      { cutoff: '120', marks: 25, label: '2 hours or more' },
      { cutoff: '105', marks: 20, label: '1 hour 45 min' },
      { cutoff: '90', marks: 15, label: '1 hour 30 min' },
      { cutoff: '60', marks: 10, label: '1 hour' },
      { cutoff: '30', marks: 5, label: '30 minutes' },
      { cutoff: '0', marks: 0, label: 'Less than 30 min' }
    ],
    cleaningMarks: 25,
    followUpMarks: 25,
    btgMarks: 25,
    morningClassMarks: 25,
    sadhanaCardMarks: 25,
    slokaMarks: 25,
    bhajanGayatriMarks: 25
  },
  3: {
    scaleId: 3,
    titleEn: 'Scale Three: Advanced Student',
    titleBn: 'স্কেল তিন: অগ্রসর ছাত্র ভক্ত',
    targetAudienceEn: 'Senior student balancing strong sadhana & university study',
    targetAudienceBn: 'উচ্চতর সাধনা ও বিশ্ববিদ্যালয় পড়াশোনা ভারসাম্যকারী ভক্ত',
    toBed: [
      { cutoff: '21:45', marks: 25, label: '9:45 PM or before' },
      { cutoff: '22:00', marks: 20, label: 'Before 10:00 PM' },
      { cutoff: '22:15', marks: 15, label: 'Before 10:15 PM' },
      { cutoff: '22:30', marks: 10, label: 'Before 10:30 PM' },
      { cutoff: '22:45', marks: 5, label: 'Before 10:45 PM' },
      { cutoff: '23:00', marks: 0, label: 'Before 11:00 PM' },
      { cutoff: '23:15', marks: -5, label: 'After 11:15 PM' }
    ],
    wakeUp: [
      { cutoff: '03:45', marks: 25, label: '3:45 AM or before' },
      { cutoff: '04:00', marks: 20, label: 'Before 4:00 AM' },
      { cutoff: '04:15', marks: 15, label: 'Before 4:15 AM' },
      { cutoff: '04:20', marks: 10, label: 'Before 4:20 AM' },
      { cutoff: '04:25', marks: 5, label: 'Before 4:25 AM' },
      { cutoff: '04:30', marks: 0, label: 'Before 4:30 AM' },
      { cutoff: '05:00', marks: -5, label: 'After 4:30 AM' }
    ],
    daySleep: [
      { cutoff: '30', marks: 25, label: '30 min or less' },
      { cutoff: '45', marks: 20, label: '45 min' },
      { cutoff: '60', marks: 15, label: '60 min' },
      { cutoff: '75', marks: 0, label: 'Beyond 60 min (-1 mark/min)' }
    ],
    japa: [
      { cutoff: '08:00', marks: 25, label: 'Before 8:00 AM' },
      { cutoff: '09:00', marks: 20, label: 'Before 9:00 AM' },
      { cutoff: '13:00', marks: 15, label: 'Before 1:00 PM' },
      { cutoff: '15:00', marks: 10, label: 'Before 3:00 PM' },
      { cutoff: '18:00', marks: 5, label: 'Before 6:00 PM' },
      { cutoff: '21:00', marks: 0, label: 'Before 9:00 PM' },
      { cutoff: '24:00', marks: -5, label: 'After 9:00 PM' }
    ],
    spBookDailyMarks: 25,
    prescribedHearing: {
      marks: 25,
      noteEn: 'Prescribed Hearing: 1 Srila Prabhupada & 1 Gurumaharaj lecture per week',
      noteBn: 'সাপ্তাহিক প্রবচন শ্রবণ: ১টি শ্রীল প্রভুপাদ ও ১টি গুরুমহারাজের প্রবচন'
    },
    studyAcademics: [
      { cutoff: '120', marks: 25, label: '2 hours or more' },
      { cutoff: '105', marks: 20, label: '1 hour 45 min' },
      { cutoff: '90', marks: 15, label: '1 hour 30 min' },
      { cutoff: '60', marks: 10, label: '1 hour' },
      { cutoff: '30', marks: 5, label: '30 minutes' },
      { cutoff: '0', marks: 0, label: 'Less than 30 min' }
    ],
    cleaningMarks: 25,
    followUpMarks: 25,
    btgMarks: 25,
    morningClassMarks: 25,
    sadhanaCardMarks: 25,
    slokaMarks: 25,
    bhajanGayatriMarks: 25
  },
  4: {
    scaleId: 4,
    titleEn: 'Scale Four: Senior / Ashramite',
    titleBn: 'স্কেল চার: সিনিয়র / পূর্ণকালীন আশ্রমী',
    targetAudienceEn: 'Senior student, leader, counselor or full-time brahmachari candidate',
    targetAudienceBn: 'সিনিয়র ভক্ত, লিডার, কাউন্সেলর বা পূর্ণকালীন ব্রহ্মচারী প্রত্যাশী',
    toBed: [
      { cutoff: '21:30', marks: 25, label: '9:30 PM or before' },
      { cutoff: '22:00', marks: 15, label: 'Before 10:00 PM' },
      { cutoff: '22:15', marks: 10, label: 'Before 10:15 PM' },
      { cutoff: '22:30', marks: 5, label: 'Before 10:30 PM' },
      { cutoff: '22:45', marks: 0, label: 'Before 10:45 PM' },
      { cutoff: '23:30', marks: -5, label: 'After 10:45 PM' }
    ],
    wakeUp: [
      { cutoff: '03:30', marks: 25, label: '3:30 AM or before' },
      { cutoff: '03:45', marks: 20, label: 'Before 3:45 AM' },
      { cutoff: '04:00', marks: 15, label: 'Before 4:00 AM' },
      { cutoff: '04:15', marks: 10, label: 'Before 4:15 AM' },
      { cutoff: '04:20', marks: 5, label: 'Before 4:20 AM' },
      { cutoff: '04:30', marks: 0, label: 'Before 4:30 AM' },
      { cutoff: '05:00', marks: -5, label: 'After 4:30 AM' }
    ],
    daySleep: [
      { cutoff: '30', marks: 25, label: '30 min or less' },
      { cutoff: '45', marks: 20, label: '45 min' },
      { cutoff: '60', marks: 15, label: '60 min' },
      { cutoff: '75', marks: 0, label: 'Beyond 60 min (-1 mark/min)' }
    ],
    japa: [
      { cutoff: '08:00', marks: 25, label: 'Before 8:00 AM' },
      { cutoff: '09:00', marks: 20, label: 'Before 9:00 AM' },
      { cutoff: '13:00', marks: 15, label: 'Before 1:00 PM' },
      { cutoff: '15:00', marks: 10, label: 'Before 3:00 PM' },
      { cutoff: '18:00', marks: 5, label: 'Before 6:00 PM' },
      { cutoff: '21:00', marks: 0, label: 'Before 9:00 PM' },
      { cutoff: '24:00', marks: -5, label: 'After 9:00 PM' }
    ],
    spBookDailyMarks: 25,
    prescribedHearing: {
      spWeeklyQuotaMin: 100,
      guruWeeklyQuotaMin: 100,
      otherWeeklyQuotaMin: 50,
      marks: 25,
      noteEn: 'Weekly Sravan: Guru Mah 100+ min, SP 100+ min, Other 50+ min',
      noteBn: 'সাপ্তাহিক শ্রবণ: গুরুমহারাজ ১০০+ মিনিট, প্রভুপাদ ১০০+ মিনিট, অন্যান্য ৫০+ মিনিট'
    },
    studyAcademics: [
      { cutoff: '120', marks: 25, label: '2 hours or more' },
      { cutoff: '105', marks: 20, label: '1 hour 45 min' },
      { cutoff: '90', marks: 15, label: '1 hour 30 min' },
      { cutoff: '60', marks: 10, label: '1 hour' },
      { cutoff: '30', marks: 5, label: '30 minutes' },
      { cutoff: '0', marks: 0, label: 'Less than 30 min' }
    ],
    cleaningMarks: 25,
    followUpMarks: 25,
    btgMarks: 25,
    morningClassMarks: 25,
    sadhanaCardMarks: 25,
    slokaMarks: 25,
    bhajanGayatriMarks: 25
  }
};

export const SADHANA_PHILOSOPHY = {
  whySadhanaCard: {
    titleEn: 'Why Sadhana Card?',
    titleBn: 'কেন সাধনা কার্ড?',
    verse: 'যুক্তাহারবিহারস্য যুক্তচেষ্টস্য কর্মসু । যুক্তস্বপ্নাববোধস্য যোগো ভবতি দুঃখহা ॥ (ভগবদ্গীতা ৬.১৭)',
    pointsEn: [
      'Bhakti is a systematic science. Following the authorized process awakens pure Krishna Prema.',
      'Based on Srila Bhaktivinod Thakur\'s Bhakti Pyramid: Health -> Sadhana -> Seva.',
      'Spiritual Medical Report: Just as medical tests uncover hidden diseases, the sadhana card diagnoses spiritual anomalies before falldowns happen.',
      'Pleasing Guru & Vaishnavas: As HH Jayapataka Swami explains, advancement is granted when spiritual masters are pleased seeing our sincere sadhana.',
      'Protection from Anarthas: Fulfilling sadhana commitments leaves no vacant time for prajalpa, gramya-katha, or lethargy.'
    ],
    pointsBn: [
      'ভক্তি হচ্ছে একটি বিজ্ঞান। নির্দিষ্ট শাস্ত্রীয় প্রক্রিয়া অনুসরণ করলে ফলস্বরূপ কৃষ্ণপ্রেম লাভ করা যায়।',
      'শ্রীল ভক্তিবিনোদ ঠাকুরের ভক্তি পিরামিড অনুসারে তৈরি: স্বাস্থ্য -> সাধনা -> সেবা।',
      'আধ্যাত্মিক মেডিকেল রিপোর্ট: যেমনি মেডিকেল রিপোর্ট লুকানো ব্যাধি ধরা ফেলে, তেমনি সাধনাপত্র ভবরোগের সার্বিক পরিস্থিতি তুলে ধরে।',
      'গুরু-বৈষ্ণবের সন্তুষ্টি: শ্রীল জয়পতাকা স্বামী বলেন, "আমাদের সাধনা দেখে যখন গুরু-বৈষ্ণব সন্তুষ্ট হন তখনই আমাদের প্রকৃত উন্নতি হয়।"',
      'অনর্থ থেকে সুরক্ষা: সাধনাপত্র পূরণ করতে গিয়ে প্রজল্প, বৈষ্ণব নিন্দা, অতিরিক্ত ঘুমের সুযোগ থাকে না, ফলে ভক্তি সুরক্ষিত থাকে।'
    ]
  },
  counselorResponsibilities: {
    titleEn: 'Counselor\'s 10 Core Responsibilities',
    titleBn: 'কাউন্সেলরের ১০টি পবিত্র দায়িত্ব',
    rulesEn: [
      '1. Be exemplary in your own personal sadhana and show your card to your counselor regularly.',
      '2. Action speaks louder than words — pure practice effortlessly influences counselees.',
      '3. Rest early to ensure active, focused morning program participation.',
      '4. Inspect counselee cards weekly and provide clear, practical, and inspiring advice.',
      '5. Encourage rather than coerce — inspiration builds long-term affection; force ruins relationships.',
      '6. Verify reading notes and listen to personal realizations with vigilance.',
      '7. Follow the Care Hierarchy strictly: 1. Health -> 2. Academics/Job -> 3. Sadhana -> 4. Seva.',
      '8. Never compare counselees unfairly ("Why can\'t you do what he does?"). Respect individual capacity.',
      '9. Use the Sandwich Feedback Method: Praise good qualities first, then gently correct, then encourage.',
      '10. Pray daily at the altar of Sri Sri Radha-Madhav for the spiritual welfare of your counselees.'
    ],
    rulesBn: [
      '১. সর্বপ্রথমে নিজের সাধনায় যত্নবান হউন এবং নিয়মিত নিজের কাউন্সেলরকে সাধনাপত্র দেখান।',
      '২. কথার চেয়ে কাজের জোর বেশি — আমাদের আদর্শ আচরণ অধীনস্থদের উপর গভীর রেখাপাত করে।',
      '৩. প্রচারের প্রয়োজন ছাড়া অধিক রাত জাগবেন না, যাতে সকালের কার্যক্রমে প্রাণবন্ত থাকা যায়।',
      '৪. প্রতি সপ্তাহে অধীনস্থ ভক্তদের সাধনাপত্র দেখুন এবং সুস্পষ্ট পালনীয় পরামর্শ দিন।',
      '৫. জোর করবেন না বরং উৎসাহ দিন — উৎসাহে কঠিন বিষয়ও সহজ হয়, জবরদস্তিতে সম্পর্ক নষ্ট হয়।',
      '৬. গ্রন্থ অধ্যয়ন ও প্রবচন শ্রবণের ক্ষেত্রে নোট দেখুন, স্বাক্ষর করুন ও উপলব্ধি শ্রবণ করুন।',
      '৭. যত্ন নেয়ার সঠিক ক্রম: ১) স্বাস্থ্য ২) লেখাপড়া/চাকরি ৩) সাধনা ৪) সেবা।',
      '৮. প্রত্যেকের যোগ্যতা ও ব্যস্ততা বিবেচনা করে সেবায় নিযুক্ত করুন, বিষাক্ত তুলনা পরিহার করুন।',
      '৯. স্যান্ডউইচ ফিডব্যাক নীতি ব্যবহার করুন: প্রশংসার মাধ্যমে অধিকার সৃষ্টি করে তবেই সংশোধন করুন।',
      '১০. অধীনস্থ ভক্তদের কৃষ্ণভাবনাময় অগ্রগতির জন্য প্রতিদিন শ্রীবিগ্রহের পাদপদ্মে আন্তরিক প্রার্থনা করুন।'
    ]
  },
  counseleeResponsibilities: {
    titleEn: 'Counselee\'s 8 Core Principles',
    titleBn: 'কাউন্সেলির ৮টি মূল শিক্ষা ও দায়িত্ব',
    rulesEn: [
      '1. Realize this card is solely for your own spiritual advancement — fill it self-initiatively.',
      '2. Fill nightly before resting; avoid the toxic habit of filling hurriedly at week\'s end.',
      '3. Strive for constant dynamic growth — like flowing river water, not a stagnant pond.',
      '4. Eagerly accept corrective feedback to purify shortcomings.',
      '5. Study diligently for university exams, BCS, Bank jobs, and professional excellence.',
      '6. Take active, thoughtful notes during SP book reading and lecture hearing.',
      '7. Remember the 4 Classes of Disciples — strive sincerely to be at least Class 2 (enthusiastic execution).',
      '8. "One who does not preach cannot advance in Krishna Consciousness" — endeavor sincerely in preaching.'
    ],
    rulesBn: [
      '১. অনুধাবন করুন সাধনাপত্র কেবল নিজের উন্নতির জন্য, স্বউদ্যোগে প্রতিদিন পূরণ করুন ও রিপোর্ট দিন।',
      '২. প্রতিদিন রাতে ঘুমানোর পূর্বে পূরণ করুন, সপ্তাহ শেষে এসে তড়িঘড়ি পূরণের মানসিকতা বর্জন করুন।',
      '৩. ডোবার বদ্ধ জল নষ্ট হয়, নদীর গতিশীল জল নয় — সর্বদা সাধনার মান উন্নয়নের চেষ্টা করুন।',
      '৪. যেভাবে সংশোধন দেয়া হোক না কেন, তা বিনম্রভাবে গ্রহণ করে নিজেকে উন্নত করুন।',
      '৫. বিশ্ববিদ্যালয়ের লেখাপড়া, বিসিএস ও চাকরির জন্য নিষ্ঠার সাথে প্রস্তুতি নিন।',
      '৬. গ্রন্থ অধ্যয়ন ও প্রবচন শ্রবণের সময় নিয়মিত নোট তৈরি করে বিষয়বস্তু আত্মস্থ করুন।',
      '৭. চার ধরনের শিষ্যের কথা স্মরণ রাখুন — অন্ততপক্ষে দ্বিতীয় শ্রেণীর শিষ্য হওয়ার আন্তরিক প্রচেষ্টা করুন।',
      '৮. "যে প্রচার করে না সে কৃষ্ণভাবনায় উন্নত হতে পারে না" — সাধ্যের মধ্যে প্রচার সেবায় যুক্ত থাকুন।'
    ]
  }
};
