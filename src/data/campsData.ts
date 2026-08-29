export interface CourseSession {
  sessionNo: number;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  keyTopicsEn: string[];
  keyTopicsBn: string[];
}

export interface CourseDetailItem {
  id: string;
  code: string;
  titleEn: string;
  titleBn: string;
  levelEn: string;
  levelBn: string;
  durationEn: string;
  durationBn: string;
  descEn: string;
  descBn: string;
  targetAudienceEn: string;
  targetAudienceBn: string;
  prerequisitesEn: string;
  prerequisitesBn: string;
  certificationEn: string;
  certificationBn: string;
  examFormatEn: string;
  examFormatBn: string;
  materialsEn: string[];
  materialsBn: string[];
  sessions: CourseSession[];
}

export interface CampTimelineEntry {
  time: string;
  activityEn: string;
  activityBn: string;
}

export interface CampDaySchedule {
  dayTitleEn: string;
  dayTitleBn: string;
  timeline: CampTimelineEntry[];
}

export interface CampDetailItem {
  id: string;
  titleEn: string;
  titleBn: string;
  categoryEn: string;
  categoryBn: string;
  locationEn: string;
  locationBn: string;
  durationEn: string;
  durationBn: string;
  descEn: string;
  descBn: string;
  visionEn: string;
  visionBn: string;
  highlightsEn: string[];
  highlightsBn: string[];
  packingListEn: string[];
  packingListBn: string[];
  guidelinesEn: string[];
  guidelinesBn: string[];
  coordinatorEn: string;
  coordinatorBn: string;
  schedule: CampDaySchedule[];
}

// -------------------------------------------------------------
// 1. DETAILED COURSES DATA (6 Major Courses with Sub-sections)
// -------------------------------------------------------------
export const DETAILED_COURSES_DATA: CourseDetailItem[] = [
  {
    id: 'dys',
    code: 'DYS',
    titleEn: 'Discover Your Self (DYS)',
    titleBn: 'ডিসকভার ইয়োর সেলফ (ডিওয়াইএস)',
    levelEn: 'Level 1 Foundation',
    levelBn: 'লেভেল ১ ভিত্তিপ্রস্তর',
    durationEn: '6 Weeks (1 Session / Week, 2 Hours each)',
    durationBn: '৬ সপ্তাহ (সাপ্তাহিক ১টি সেশন, ২ ঘণ্টা)',
    descEn: 'The flagship foundation course designed for college and university students to systematically understand spirituality, logic, science, and the purpose of human life.',
    descBn: 'বিশ্ববিদ্যালয় ও কলেজ শিক্ষার্থীদের জন্য বৈজ্ঞানিক যুক্তি ও দার্শনিক প্রমাণের ভিত্তিতে মানব জীবনের উদ্দেশ্য ও আধ্যাত্মিকতার ভিত্তিপ্রস্তর কোর্স।',
    targetAudienceEn: 'Open to all university students, beginners, and truth seekers.',
    targetAudienceBn: 'সকল বিশ্ববিদ্যালয় শিক্ষার্থী, নতুন শিক্ষার্থী ও সত্যানুসন্ধানীদের জন্য উন্মুক্ত।',
    prerequisitesEn: 'No prior spiritual knowledge required; an open and questioning mind.',
    prerequisitesBn: 'পূর্ব কোনো শাস্ত্রীয় জ্ঞানের প্রয়োজন নেই; সত্যানুসন্ধিৎসু মনই যথেষ্ট।',
    certificationEn: 'Advaita VOICE Certificate of Foundation in Vedic Science & Mind Control.',
    certificationBn: 'বৈদিক বিজ্ঞান ও মন নিয়ন্ত্রণ বিষয়ে অদ্বৈত ভয়েস ফাউন্ডেশন সার্টিফিকেট।',
    examFormatEn: 'Multiple-Choice Questionnaire (MCQ) + Short Analytical Essay + Viva.',
    examFormatBn: 'বহুনির্বাচনী প্রশ্ন (MCQ) + সংক্ষিপ্ত বিশ্লেষণধর্মী রচনা + মৌখিক মূল্যায়ন।',
    materialsEn: [
      'DYS Course Workbook & Practical Diary',
      'Science of Self-Realization by Srila Prabhupada',
      'Japa Mala & Bead Bag for Meditation Practice',
      'Weekly Slide Summaries & Audio Lectures'
    ],
    materialsBn: [
      'ডিওয়াইএস কোর্স ওয়ার্কবুক ও দৈনন্দিন ডায়রি',
      'শ্রীল প্রভুপাদের "আত্মোপলব্ধির বিজ্ঞান" গ্রন্থ',
      'জপমালা ও জপ থলি',
      'সাপ্তাহিক স্লাইড সারাংশ ও অডিও লেকচার'
    ],
    sessions: [
      {
        sessionNo: 1,
        titleEn: 'Session 1: Can a Scientist Believe in God?',
        titleBn: 'সেশন ১: একজন বিজ্ঞানী কি ঈশ্বরে বিশ্বাস করতে পারেন?',
        summaryEn: 'Exploring intelligent design, scientific limitations, fine-tuning of the universe, and Vedic perspective on creation.',
        summaryBn: 'সৃষ্টির নিখুঁত নকশা, বিজ্ঞানের সীমাবদ্ধতা ও সৃষ্টির পশ্চাতে পরম চেতনার যৌক্তিক বিশ্লেষণ।',
        keyTopicsEn: ['Limitations of 4 human senses', 'Fine-tuning of physical constants', 'Vedas as axiomatic manual'],
        keyTopicsBn: ['ইন্দ্রিয়ের ৪টি ত্রুটি', 'মহাজাগতিক সূক্ষ্ম ভারসাম্য', 'বেদ অপৌরুষেয় প্রমাণ']
      },
      {
        sessionNo: 2,
        titleEn: 'Session 2: Science of the Soul — Who Am I?',
        titleBn: 'সেশন ২: আত্মার বিজ্ঞান — আমি কে?',
        summaryEn: 'Difference between living body and dead matter, consciousness symptoms, transmigration of the soul, and near-death experiences.',
        summaryBn: 'দেহ ও আত্মার পার্থক্য, চেতনার লক্ষণ, জন্মান্তরবাদ ও মৃত্যুর প্রামাণ্য বিশ্লেষণ।',
        keyTopicsEn: ['Matter vs Spirit', 'Consciousness as symptom of soul', 'Reincarnation evidence'],
        keyTopicsBn: ['জড় ও চেতনের পার্থক্য', 'চেতনা আত্মার লক্ষণ', 'জন্মান্তরের বৈজ্ঞানিক প্রমাণ']
      },
      {
        sessionNo: 3,
        titleEn: 'Session 3: Why Do Bad Things Happen to Good People?',
        titleBn: 'সেশন ৩: ভালো মানুষের সাথে কেন খারাপ ঘটে? (কর্মফল তত্ত্ব)',
        summaryEn: 'The inexorable laws of Karma, destiny vs free will, 3 types of karma (Karma, Akarma, Vikarma), and suffering elimination.',
        summaryBn: 'কর্মের অমোঘ নিয়ম, ভাগ্য বনাম স্বাধীন ইচ্ছা, কর্মের ৩ প্রকারভেদ ও দুঃখ নিরসনের উপায়।',
        keyTopicsEn: ['Law of Action & Reaction', 'Prarabdha & Aprarabdha Karma', 'Overcoming karmic bondage'],
        keyTopicsBn: ['ক্রিয়া ও প্রতিক্রিয়ার নীতি', 'প্রারব্ধ ও অপ্রারব্ধ কর্ম', 'কর্মবন্ধন থেকে মুক্তি']
      },
      {
        sessionNo: 4,
        titleEn: 'Session 4: The Art of Mind Control & Positive Habits',
        titleBn: 'সেশন ৪: মন নিয়ন্ত্রণের শিল্প ও ইতিবাচক অভ্যাস গঠন',
        summaryEn: 'Anatomy of the mind, senses, intelligence, and soul; practical techniques to conquer digital distraction and develop laser focus.',
        summaryBn: 'মন, বুদ্ধি ও ইন্দ্রিয়ের গঠন, মনকে বশ করার ব্যবহারিক সূত্র ও ডিজিটাল আসক্তি জয়।',
        keyTopicsEn: ['Chariot analogy of human body', 'Role of higher intelligence', 'Mantra meditation science'],
        keyTopicsBn: ['দেহরথ উপমা', 'বুদ্ধির নিয়ন্ত্রণ প্রতিষ্ঠা', 'মন্ত্র মেডিটেশন বিজ্ঞান']
      },
      {
        sessionNo: 5,
        titleEn: 'Session 5: Yoga for the Modern Age — The Topmost System',
        titleBn: 'সেশন ৫: কলিযুগের শ্রেষ্ঠ যোগপদ্ধতি (ভক্তিযোগ)',
        summaryEn: 'Comparative study of Karma-yoga, Jnana-yoga, Astanga-yoga, and Bhakti-yoga; the science of Mahamantra chanting.',
        summaryBn: 'কর্ম, জ্ঞান, অষ্টাঙ্গ ও ভক্তিযোগের তুলনামূলক বিচার এবং মহামন্ত্র জপের বৈজ্ঞানিক প্রভাব।',
        keyTopicsEn: ['The Yoga Ladder (Gita Ch. 6)', 'Kaliyuga Yuga-dharma', 'Sound vibration efficacy'],
        keyTopicsBn: ['যোগ সোপান', 'কলিযুগের যুগধর্ম', 'শব্দব্রহ্মের কার্যকারিতা']
      },
      {
        sessionNo: 6,
        titleEn: 'Session 6: Finding True Guidance — Guru & Shastra',
        titleBn: 'সেশন ৬: সৎসঙ্গ ও প্রামাণিক পথপ্রদর্শক নির্বাচন',
        summaryEn: 'Qualities of an authentic Guru, disciplic succession (parampara), applying spiritual knowledge to career & campus life.',
        summaryBn: 'সদ্গুরুর লক্ষণ, গুরুপরম্পরা ধারা এবং ক্যাম্পাস ও কর্মজীবনে আধ্যাত্মিকতার প্রায়োগিক প্রয়োগ।',
        keyTopicsEn: ['Tattva-darshi Guru (BG 4.34)', '4 Authorized Sampradayas', 'Graduation & Next Steps'],
        keyTopicsBn: ['তত্ত্বদর্শী গুরু (গীতা ৪.৩৪)', '৪টি প্রামাণিক সম্প্রদায়', 'কোর্স সমাপনী ও দীক্ষা প্রস্তুতি']
      }
    ]
  },
  {
    id: 'ebg',
    code: 'EBG',
    titleEn: 'Essence of Bhagavad-gita (EBG)',
    titleBn: 'এসেন্স অব ভগবদ্গীতা (ইবিজি)',
    levelEn: 'Level 2 Intermediate',
    levelBn: 'লেভেল ২ ইন্টারমিডিয়েট',
    durationEn: '12 Weeks (12 Thematic Modules)',
    durationBn: '১২ সপ্তাহ (১২টি বিষয়ভিত্তিক অধ্যায়)',
    descEn: 'Comprehensive thematic exploration of Srimad Bhagavad-gita As It Is, mastering the 5 fundamental truths: Isvara, Jiva, Prakriti, Kala, and Karma.',
    descBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ-এর ৫টি মূল তত্ত্ব—ঈশ্বর, জীব, প্রকৃতি, কাল ও কর্মের পুঙ্খানুপুঙ্খ ও ধারাবাহিক অধ্যয়ন।',
    targetAudienceEn: 'Graduates of DYS and sincere Gita practitioners.',
    targetAudienceBn: 'ডিওয়াইএস উত্তীর্ণ শিক্ষার্থী ও গীতার গভীর ভাবানুধাবনে আগ্রহী ভক্তবৃন্দ।',
    prerequisitesEn: 'Completion of DYS or basic familiarity with Bhagavad Gita chapters.',
    prerequisitesBn: 'ডিওয়াইএস সম্পন্নকরণ অথবা গীতার মৌলিক পরিচিতি।',
    certificationEn: 'Advaita VOICE Intermediate Diploma in Bhagavad Gita Studies.',
    certificationBn: 'শ্রীমদ্ভগবদ্গীতা অধ্যায়ন ইন্টারমিডিয়েট ডিপ্লোমা সার্টিফিকেট।',
    examFormatEn: 'Mid-term written exam (50 marks) + Shloka Recitation (25 marks) + Final Project (25 marks).',
    examFormatBn: 'মধ্যবর্তী লিখিত পরীক্ষা (৫০ নম্বর) + শ্লোক আবৃত্তি (২৫ নম্বর) + চূড়ান্ত প্রজেক্ট (২৫ নম্বর)।',
    materialsEn: [
      'Bhagavad-gita As It Is by HDG A.C. Bhaktivedanta Swami Prabhupada',
      'EBG Student Workbook with Shloka Index',
      'Daily Sadhana Chart & Verse Memorizer Cards'
    ],
    materialsBn: [
      'শ্রীল প্রভুপাদ প্রণীত "শ্রীমদ্ভগবদ্গীতা যথার্থ"',
      'ইবিজি স্টুডেন্ট ওয়ার্কবুক ও শ্লোক তালিকা',
      'দৈনিক সাধনাপত্র ও শ্লোক ফ্ল্যাশ কার্ড'
    ],
    sessions: [
      {
        sessionNo: 1,
        titleEn: 'Module 1: Overview of Gita & Arjuna’s 5 Doubts',
        titleBn: 'মডিউল ১: গীতার ভূমিকা ও অর্জুনের বিষাদের ৫টি কারণ',
        summaryEn: 'Context of Kurukshetra, the setting of the battlefield, and understanding Arjuna’s 5 reasons for refusing to fight.',
        summaryBn: 'কুরুক্ষেত্রের পটভূমি এবং যুদ্ধ না করার জন্য অর্জুনের ৫টি মানসিক ও সামাজিক যুক্তি।',
        keyTopicsEn: ['Compassion, Enjoyment, Fear of Sin, Family Destruction, Indecision', 'BG 1.1 - 2.10'],
        keyTopicsBn: ['অর্জুনের ৫টি দ্বিধা', 'গীতা ১ম অধ্যায় পর্যালোচনা']
      },
      {
        sessionNo: 2,
        titleEn: 'Module 2: Sankhya Yoga & The Eternal Soul',
        titleBn: 'মডিউল ২: সাংখ্য যোগ ও নিত্য আত্মা তত্ত্ব',
        summaryEn: 'Analysis of Chapter 2 verses 11–30; characteristics of soul and unchanging spiritual identity.',
        summaryBn: 'গীতার ২য় অধ্যায় শ্লোক ১১-৩০; আত্মার অবিনশ্বরতা ও নিত্য পরিচয়।',
        keyTopicsEn: ['Dehino asmin yatha dehe (BG 2.13)', 'Na jayate mriyate va (BG 2.20)', 'Sthita-prajna qualities'],
        keyTopicsBn: ['দেহান্তর প্রাপ্তি', 'আত্মার সনাতন স্বভাব', 'স্থিতপ্রজ্ঞের লক্ষণ']
      },
      {
        sessionNo: 3,
        titleEn: 'Module 3: Karma Yoga — Action in Krishna Consciousness',
        titleBn: 'মডিউল ৩: কর্মযোগ — নিষ্কাম কর্মের বিজ্ঞান',
        summaryEn: 'Renunciation of fruits vs renunciation of action; working as an offering without selfish desire (Ch. 3 & 5).',
        summaryBn: 'কর্মের ফল ত্যাগ বনাম কর্মত্যাগ; অহংকারমুক্ত হয়ে শ্রীকৃষ্ণের প্রীতির উদ্দেশ্যে কর্ম সম্পাদন।',
        keyTopicsEn: ['Karmany evadhikaras te (BG 2.47)', 'Yajnarthat karmano nyatra (BG 3.9)', 'Conquering Lust (BG 3.37-43)'],
        keyTopicsBn: ['নিষ্কাম কর্মযোগ', 'যজ্ঞার্থে কর্ম', 'কাম ও ক্রোধের উৎপত্তি']
      },
      {
        sessionNo: 4,
        titleEn: 'Module 4: Transcendental Knowledge & Guru-Parampara',
        titleBn: 'মডিউল ৪: দিব্য জ্ঞান ও গুরুপরম্পরা',
        summaryEn: 'Transmission of spiritual knowledge across ages, divine appearance of Krishna, and surrender to a bonafide spiritual master (Ch. 4).',
        summaryBn: 'শ্রীকৃষ্ণের অপ্রাকৃত আবির্ভাব ও কর্মের রহস্য এবং তত্ত্বদর্শী সদ্গুরুর আনুগত্য স্বীকার।',
        keyTopicsEn: ['Yada yada hi dharmasya (BG 4.7-8)', 'Janma karma ca me divyam (BG 4.9)', 'Tad viddhi pranipatena (BG 4.34)'],
        keyTopicsBn: ['অবতারের উদ্দেশ্য', 'ভগবানের দিব্য জন্ম ও কর্ম', 'গুরুপরম্পরা বিজ্ঞান']
      },
      {
        sessionNo: 5,
        titleEn: 'Module 5: Dhyana Yoga & Mind Regulation',
        titleBn: 'মডিউল ৫: ধ্যানযোগ ও অষ্টযোগের বাস্তবতা',
        summaryEn: 'Chapter 6 analysis; controlling the restless mind through practice (Abhyasa) and detachment (Vairagya).',
        summaryBn: 'মনকে মিত্র ও শত্রুতে রূপান্তরের প্রক্রিয়া, অভ্যাস ও বৈরাগ্যের মাধ্যমে মন জয়।',
        keyTopicsEn: ['Bandhur atmatmanas tasya (BG 6.5-6)', 'Abhyasena tu kaunteya (BG 6.35)', 'Topmost Yogi (BG 6.47)'],
        keyTopicsBn: ['মন নিয়ন্ত্রণ সূত্র', 'অভ্যাস ও বৈরাগ্য', 'সর্বশ্রেষ্ঠ যোগীর লক্ষণ']
      },
      {
        sessionNo: 6,
        titleEn: 'Module 6: Knowledge of the Absolute & Opulences',
        titleBn: 'মডিউল ৬: পরমেশ্বর ভগবান ও তাঁর অনন্ত বিভূতি',
        summaryEn: 'Understanding Krishna as the Supreme Source, the 3 modes of material nature, and the universal form (Ch. 7, 9, 10 & 11).',
        summaryBn: 'শ্রীকৃষ্ণের পরম আধিপত্য, অনন্ত বিভূতি এবং ভক্তের প্রতি পরমেশ্বর ভগবানের অহৈতুকী কৃপা।',
        keyTopicsEn: ['Mattah parataram nanyat (BG 7.7)', 'Raja-vidya Raja-guhyam (BG 9.2)', 'Aham sarvasya prabhavo (BG 10.8)'],
        keyTopicsBn: ['সর্বকারণকারণ পরমেশ্বর', 'রাজবিদ্যা রাজগুহ্য যোগ', 'চতুঃশ্লোক গীতা']
      }
    ]
  },
  {
    id: 'vvs',
    code: 'VVS',
    titleEn: 'Victorious Youth & Vedic Secrets (VVS)',
    titleBn: 'ভিক্টোরিয়াস ইয়ুথ অ্যান্ড বৈদিক সিক্রেটস (ভিভিএস)',
    levelEn: 'Level 3 Mastery',
    levelBn: 'লেভেল ৩ মাস্টারি',
    durationEn: '8 Weeks Practical Ashram Training',
    durationBn: '৮ সপ্তাহের প্রায়োগিক প্রশিক্ষণ',
    descEn: 'Advanced character development, Brahmacharya, spiritual self-defense against modern vices, time mastery, and leadership principles.',
    descBn: 'ব্রহ্মচর্য পালন, ইন্দ্রিয় সংযম, ডিজিটাল মোহমুক্তি, সময় সচেতনতা এবং আত্মনিয়ন্ত্রণের বিশেষ প্রশিক্ষণ।',
    targetAudienceEn: 'University youths seeking high discipline and spiritual leadership.',
    targetAudienceBn: 'উচ্চ চারিত্রিক দৃঢ়তা ও আত্মনিয়ন্ত্রণে আগ্রহী শিক্ষার্থী ও যুবসমাজ।',
    prerequisitesEn: 'Completion of DYS and basic chanting commitment.',
    prerequisitesBn: 'ডিওয়াইএস সমাপ্তি ও নিয়মিত জপ অনুশীলন।',
    certificationEn: 'Advaita VOICE Youth Leadership & Vedic Character Mastery Award.',
    certificationBn: 'অদ্বৈত ভয়েস যুব নেতৃত্ব ও বৈদিক চারিত্রিক দৃঢ়তা সম্মাননা সনদ।',
    examFormatEn: 'Practical Sadhana Audit (40%) + Leadership Case Studies (30%) + Oral Defense (30%).',
    examFormatBn: 'ব্যবহারিক সাধনা অডিট (৪০%) + কেস স্টাডি বিশ্লেষণ (৩০%) + মৌখিক উপস্থাপনা (৩০%)।',
    materialsEn: [
      'Brahmacharya in Krishna Consciousness by Bhakti Vikasa Swami',
      'VVS Practical Student Action Manual',
      'Daily 2-Hour Academic & Spiritual Focus Planner'
    ],
    materialsBn: [
      'শ্রীল ভক্তি বিকাশ স্বামী প্রণীত "কৃষ্ণভাবনামৃত ও ব্রহ্মচর্য"',
      'ভিভিএস ব্যবহারিক ম্যানুয়াল',
      'দৈনিক ২ ঘণ্টা প্রাতিষ্ঠানিক ও সাধনা প্ল্যানার'
    ],
    sessions: [
      {
        sessionNo: 1,
        titleEn: 'Session 1: The Power of Brahmacharya & Purity',
        titleBn: 'সেশন ১: ব্রহ্মচর্যের শক্তি ও শারীরিক-মানসিক শুচিতা',
        summaryEn: 'Preserving vital energy (Ojas), cultivating sharp intellect, emotional stability, and spiritual radiance.',
        summaryBn: 'ওজঃ শক্তির সংরক্ষণ, মেধা বৃদ্ধি, মানসিক স্থিরতা ও আত্মনিয়ন্ত্রণের বৈজ্ঞানিক সূত্র।',
        keyTopicsEn: ['Science of Ojas preservation', 'Sublimation of lower drives', 'Vedic hygiene principles'],
        keyTopicsBn: ['ওজঃ শক্তি রূপান্তর', 'নিম্ন প্রবৃত্তির ঊর্ধ্বে ওঠা', 'বৈদিক স্বাস্থ্যবিধি']
      },
      {
        sessionNo: 2,
        titleEn: 'Session 2: Digital Detox & Conquering Senses',
        titleBn: 'সেশন ২: ডিজিটাল বিষমুক্তি ও ইন্দ্রিয় সংযম',
        summaryEn: 'Overcoming social media addiction, dopamine hacking, regulating visual inputs, and establishing mental serenity.',
        summaryBn: 'সোশ্যাল মিডিয়া আসক্তি দূরীকরণ, ডোপামিন নিয়ন্ত্রণ ও দৃষ্টিনিয়ন্ত্রণ পদ্ধতি।',
        keyTopicsEn: ['Dopamine reset techniques', 'Sight & Hearing regulation', 'Creating distraction-free study zones'],
        keyTopicsBn: ['ডোপামিন ভারসাম্য', 'দৃষ্টি ও শ্রবণ সংযম', 'বিঘ্নহীন অধ্যয়ন পরিবেশ তৈরি']
      },
      {
        sessionNo: 3,
        titleEn: 'Session 3: Time Mastery & 2-Hour Daily Deep Work',
        titleBn: 'সেশন ৩: সময় ব্যবস্থাপনা ও দৈনিক ২ ঘণ্টা গভীর অধ্যয়ন',
        summaryEn: 'Balancing university academic brilliance with 16 rounds of japa; the Pareto 80/20 rule in spiritual student life.',
        summaryBn: 'বিশ্ববিদ্যালয় প্রাতিষ্ঠানিক সাফল্য ও ১৬ মালা জপের মেলবন্ধন; প্যারোটো নীতি প্রয়োগ।',
        keyTopicsEn: ['Eisenhower Matrix for devotees', 'Deep work blocks', 'Overcoming procrastination'],
        keyTopicsBn: ['আইজেনহাওয়ার ম্যাট্রিক্স', 'গভীর অধ্যয়ন সেশন', 'দীর্ঘসূত্রতা পরিহার']
      },
      {
        sessionNo: 4,
        titleEn: 'Session 4: Vaishnava Etiquette & Speech Control',
        titleBn: 'সেশন ৪: বৈষ্ণব সদাচার ও বাক্যের তপস্যা',
        summaryEn: 'Cultivating humility, avoiding offenses (aparadha), honoring seniors, and speaking pleasing, truthful words.',
        summaryBn: 'নম্রতা অর্জন, অপরাধ বর্জন, জ্যেষ্ঠ বৈষ্ণবদের সম্মান ও অনুদ্বেগকর সত্য বাক্য বলা।',
        keyTopicsEn: ['Vaco-vegam manasa-vegam (NOI Verse 1)', 'Trnad api sunicena mood', 'Ashram living harmony'],
        keyTopicsBn: ['বাক্যের বেগ নিয়ন্ত্রণ (উপদেশামৃত ১)', 'তৃণাদপি সুনীচেন ভাব', 'আশ্রমিক সম্প্রীতি']
      }
    ]
  },
  {
    id: 'bbs',
    code: 'BBS',
    titleEn: 'Bhagavat Bhakti Shastri (BBS)',
    titleBn: 'ভাগবত ভক্তি শাস্ত্রী ডিপ্লোমা (বিবিএস)',
    levelEn: 'Diploma Degree',
    levelBn: 'শাস্ত্রী ডিপ্লোমা',
    durationEn: '1 Year Comprehensive Academic Curriculum (4 Semesters)',
    durationBn: '১ বছর মেয়াদী প্রাতিষ্ঠানিক পাঠ্যক্রম (৪টি সেমিস্টার)',
    descEn: 'Authoritative ISKCON Bhakti Shastri certification covering 4 fundamental canonical shastras: Bhagavad-gita As It Is, Nectar of Devotion, Sri Isopanisad, and Nectar of Instruction.',
    descBn: 'শ্রীমদ্ভগবদ্গীতা, ভক্তিসিন্ধু, ঈশোপনিষদ ও উপদেশামৃত—এই ৪টি মূল শাস্ত্রের প্রমাণভিত্তিক বিশ্লেষণ, ৪৫টি শ্লোক মুখস্থ ও ডিপ্লোমা পরীক্ষা।',
    targetAudienceEn: 'Serious practitioners, ashramites, and future preachers seeking academic shastric mastery.',
    targetAudienceBn: 'শাস্ত্রের প্রামাণিক শিক্ষক ও প্রচারক হতে আগ্রহী একনিষ্ঠ সাধক ও আশ্রমবাসী।',
    prerequisitesEn: 'Strict adherence to 4 regulative principles, daily 16 rounds japa & recommendation by counselor.',
    prerequisitesBn: '৪টি নিয়ম পালন, নিয়মিত ১৬ মালা জপ এবং কাউন্সেলর প্রভুর সুপারিশ।',
    certificationEn: 'Official ISKCON / Advaita VOICE Bhakti Shastri Degree Diploma.',
    certificationBn: 'আন্তর্জাতিক ইসকন / অদ্বৈত ভয়েস অনুমোদিত "ভক্তি শাস্ত্রী" উপাধি সনদ।',
    examFormatEn: 'Closed Book Shastra Exams (40%) + Open Book Essays (40%) + 45 Shloka Recitation (20%).',
    examFormatBn: 'ক্লোজড বুক পরীক্ষা (৪০%) + ওপেন বুক প্রবন্ধ (৪০%) + ৪৫টি শ্লোক আবৃত্তি (২০%)।',
    materialsEn: [
      'Bhagavad-gita As It Is (Complete 18 Chapters)',
      'The Nectar of Devotion (Bhakti-rasamrta-sindhu Part 1)',
      'Sri Isopanisad (18 Mantras)',
      'The Nectar of Instruction (Upadesamrta 11 Verses)',
      'BBS Official Study Guide & Question Bank'
    ],
    materialsBn: [
      'শ্রীমদ্ভগবদ্গীতা যথার্থ (১৮টি অধ্যায়)',
      'ভক্তিরসামৃতসিন্ধু (১ম ভাগ)',
      'শ্রী ঈশোপনিষদ (১৮টি মন্ত্র)',
      'উপদেশামৃত (১১টি শ্লোক)',
      'ভক্তি শাস্ত্রী প্রশ্নব্যাংক ও গাইড'
    ],
    sessions: [
      {
        sessionNo: 1,
        titleEn: 'Semester 1: Bhagavad-gita Chapters 1 to 6 (Karma-Yoga & Soul)',
        titleBn: 'সেমিস্টার ১: ভগবদ্গীতা ১ম থেকে ৬ষ্ঠ অধ্যায় (কর্মযোগ ও আত্মা)',
        summaryEn: 'Deep structural analysis of first 6 chapters, soul philosophy, duty, sacrifice, and ashtanga-yoga culmination in Bhakti.',
        summaryBn: 'গীতার প্রথম ৬টি অধ্যায়ের গভীর শ্লোক বিশ্লেষণ, কর্মযোগের উৎকর্ষ ও ধ্যানযোগ।',
        keyTopicsEn: ['19 Key Memory Shlokas', 'Flowchart of chapter arguments', 'Sankhya to Dhyana progression'],
        keyTopicsBn: ['১৯টি মেমোরি শ্লোক', 'অধ্যায়ভিত্তিক যুক্তিপ্রবাহ', 'সাংখ্য থেকে ধ্যানযোগ']
      },
      {
        sessionNo: 2,
        titleEn: 'Semester 2: Bhagavad-gita Chapters 7 to 12 (Bhakti-Yoga Core)',
        titleBn: 'সেমিস্টার ২: ভগবদ্গীতা ৭ম থেকে ১২শ অধ্যায় (ভক্তিযোগের মর্মবাণী)',
        summaryEn: 'The hidden treasure of Gita: Pure devotional service, universal form, opulences, and direct loving surrender to Krishna.',
        summaryBn: 'গীতার মধ্যম ৬টি অধ্যায়ের বিশ্লেষণ: শুদ্ধ ভক্তি, চতুঃশ্লোকী গীতা, বিশ্বরূপ ও অচিন্ত্য ভেদাভেদ তত্ত্ব।',
        keyTopicsEn: ['15 Key Memory Shlokas', 'Chatur-shloki Gita (10.8-11)', 'Bhakti vs other paths'],
        keyTopicsBn: ['১৫টি মেমোরি শ্লোক', 'চতুঃশ্লোকী গীতা ব্যাখ্যা', 'ভক্তিযোগের অনন্য শ্রেষ্ঠত্ব']
      },
      {
        sessionNo: 3,
        titleEn: 'Semester 3: Bhagavad-gita Chapters 13 to 18 (Jnana-Yoga & Conclusion)',
        titleBn: 'সেমিস্টার ৩: ভগবদ্গীতা ১৩শ থেকে ১৮শ অধ্যায় (জ্ঞানযোগ ও উপসংহার)',
        summaryEn: '3 Modes of nature, Purusottama Yoga, divine and demonic natures, and final surrender verse (BG 18.66).',
        summaryBn: 'ত্রিগুণাতীত হওয়ার বিজ্ঞান, পুরুষোত্তম তত্ত্ব এবং শ্রীকৃষ্ণের চরণে চূড়ান্ত শরণাগতি।',
        keyTopicsEn: ['11 Key Memory Shlokas', 'Analysis of 3 Gunas', 'Sarva-dharman parityajya (18.66)'],
        keyTopicsBn: ['১১টি মেমোরি শ্লোক', 'ত্রিগুণ বিচার', 'সর্বধর্ম্মান পরিত্যজ্য শ্লোকার্থ']
      },
      {
        sessionNo: 4,
        titleEn: 'Semester 4: Sri Isopanisad, Nectar of Instruction & Nectar of Devotion',
        titleBn: 'সেমিস্টার ৪: ঈশোপনিষদ, উপদেশামৃত ও ভক্তিরসামৃতসিন্ধু',
        summaryEn: 'Isavasya principle, 6 favorable and unfavorable practices for bhakti, 64 items of sadhana-bhakti, and ragatmika-bhakti stages.',
        summaryBn: 'ঈশাবাস্য তত্ত্ব, ভক্তির ৬টি অনুকূল ও প্রতিকূল বিষয়, ৬৪ প্রকার ভক্তি অঙ্গ ও রাগানুগা ভক্তি।',
        keyTopicsEn: ['Isopanisad 18 Mantras', 'NOI 11 Verses Recitation', 'Anartha Nivritti to Prema progression'],
        keyTopicsBn: ['ঈশোপনিষদের ১৮টি মন্ত্র', 'উপদেশামৃতের ১১টি শ্লোক', 'অনর্থ নিবৃত্তি থেকে প্রেম স্তর']
      }
    ]
  },
  {
    id: 'ptc',
    code: 'PTC',
    titleEn: 'Preacher’s Training Course (PTC)',
    titleBn: 'প্রচারক প্রশিক্ষণ ও যুব মেন্টরশিপ (পিটিসি)',
    levelEn: 'Leadership Certification',
    levelBn: 'নেতৃত্ব ও প্রচার সনদ',
    durationEn: '8 Weeks Intensive Workshop',
    durationBn: '৮ সপ্তাহের নিবিড় কর্মশালা',
    descEn: 'Specialized training for university youth mentors in public speaking, PowerPoint presentation design, scientific apologetics, and campus outreach strategy.',
    descBn: 'বিশ্ববিদ্যালয় পর্যায়ে ধর্মতত্ত্ব উপস্থাপন, পাবলিক স্পিকিং, বৈজ্ঞানিক প্রশ্নের উত্তর প্রদান এবং যুব মেন্টরশিপের বিশেষ প্রশিক্ষণ।',
    targetAudienceEn: 'Graduates of EBG/VVS preparing to lead campus student groups.',
    targetAudienceBn: 'বিশ্ববিদ্যালয় ক্যাম্পাস প্রচার ও সেমিনার পরিচালনায় আগ্রহী অগ্রজ শিক্ষার্থী।',
    prerequisitesEn: 'Strong sadhana consistency and completion of EBG/VVS.',
    prerequisitesBn: 'দৃঢ় সাধনা মান এবং ইবিজি/ভিভিএস কোর্স সমাপ্তি।',
    certificationEn: 'Advaita VOICE Certified Campus Youth Preacher & Seminar Facilitator.',
    certificationBn: 'অদ্বৈত ভয়েস সনদপ্রাপ্ত ক্যাম্পাস প্রচারক ও সেমিনার ফ্যাসিলিটেটর।',
    examFormatEn: 'Live 30-Minute PPT Presentation Seminar + Q&A Defense Panel + Coursework.',
    examFormatBn: '৩০ মিনিটের লাইভ পাওয়ারপয়েন্ট সেমিনার উপস্থাপন + বিশেষজ্ঞ প্যানেলের প্রশ্নোত্তরী।',
    materialsEn: [
      'Preach! The Art of Delivering Vedic Wisdom by HG Radheshyam Das',
      'VOICE Campus Seminar Slide Deck (15 Standard PPTs)',
      'Scientific Apologetics Compendium (Addressing Darwinism, Big Bang, Atheism)'
    ],
    materialsBn: [
      'শ্রীল রাধেশ্যাম দাস প্রণীত "প্রচার প্রশিক্ষণ নির্দেশিকা"',
      'ভয়েস ক্যাম্পাস সেমিনার ১৫টি আদর্শ স্লাইড ডেক',
      'বিজ্ঞান ও আধ্যাত্মিকতা প্রশ্নোত্তর সংকলন'
    ],
    sessions: [
      {
        sessionNo: 1,
        titleEn: 'Session 1: The Mind of the Modern University Student',
        titleBn: 'সেশন ১: আধুনিক বিশ্ববিদ্যালয় শিক্ষার্থীর মনস্তত্ত্ব অনুধাবন',
        summaryEn: 'Understanding doubts, psychological pressures, rationalism, peer pressure, and tailoring the message to youth.',
        summaryBn: 'শিক্ষার্থীদের মানসিক চাপ, যুক্তিবাদের রূপরেখা এবং তাদের ভাষায় আধ্যাত্মিক সত্য উপস্থাপনা।',
        keyTopicsEn: ['Empathy in preaching', 'Identifying receptive seekers', 'Addressing existential crisis'],
        keyTopicsBn: ['প্রচারকের সহানুভূতি', 'আগ্রহী শিক্ষার্থী চিহ্নিতকরণ', 'মানসিক সংকটের সমাধান']
      },
      {
        sessionNo: 2,
        titleEn: 'Session 2: Public Speaking & PPT Slide Delivery Mastery',
        titleBn: 'সেশন ২: পাবলিক স্পিকিং ও স্লাইড সেমিনার উপস্থাপনা শৈলী',
        summaryEn: 'Voice modulation, storytelling, body language, humor without levity, and designing engaging visual presentations.',
        summaryBn: 'কণ্ঠস্বরের নিয়ন্ত্রণ, দৃষ্টান্ত ও গল্পের ব্যবহার, বডি ল্যাঙ্গুয়েজ এবং আকর্ষণীয় স্লাইড তৈরির কৌশল।',
        keyTopicsEn: ['Structuring a 45-min talk', 'Visual storytelling', 'Handling stage fear'],
        keyTopicsBn: ['৪৫ মিনিটের সেমিনার বিন্যাস', 'দৃষ্টান্তমূলক উপস্থাপন', 'মঞ্চভীতি দূরীকরণ']
      },
      {
        sessionNo: 3,
        titleEn: 'Session 3: Defending Truth — Refuting Materialistic Theories',
        titleBn: 'সেশন ৩: সত্যের প্রতিরক্ষা — নাস্তিক্যবাদ ও ডারউইনবাদের খণ্ডন',
        summaryEn: 'Logical refutation of Neo-Darwinism, abiogenesis, consciousness arising from matter, and secular moral relativism.',
        summaryBn: 'ডারউইনের বিবর্তনবাদ, অন্ধ জড়বাদ ও চেতনার জড়োৎপত্তির বৈজ্ঞানিক ও যৌক্তিক খণ্ডন।',
        keyTopicsEn: ['Information theory & DNA', 'Irreducible complexity', 'Vedic model of creation'],
        keyTopicsBn: ['ডিএনএ ও ইনফরমেশন থিওরি', 'জৈব জটিলতা প্রমাণ', 'বৈদিক সৃষ্টিতত্ত্ব']
      },
      {
        sessionNo: 4,
        titleEn: 'Session 4: Follow-up & Personal Student Mentoring',
        titleBn: 'সেশন ৪: শিক্ষার্থীদের ফলো-আপ ও ব্যক্তিগত কাউন্সেলিং',
        summaryEn: 'Establishing loving relationships, one-on-one hearing, solving personal crises, and integrating newcomers into ashram.',
        summaryBn: 'শিক্ষার্থীদের সাথে গভীর প্রীতির সম্পর্ক স্থাপন, সমস্যার সমাধান এবং ভক্তিসঙ্গে যুক্ত করার পদ্ধতি।',
        keyTopicsEn: ['The 6 Loving Exchanges (Rupanuga)', 'Confidential counseling', 'Preserving devotee care'],
        keyTopicsBn: ['৬টি প্রীতি লক্ষণ (উপদেশামৃত ৪)', 'গোপনীয় কাউন্সেলিং', 'ভক্ত সেবা ও যত্ন']
      }
    ]
  },
  {
    id: 'ves',
    code: 'VES',
    titleEn: 'Value Education & Life Skills (VES)',
    titleBn: 'মূল্যবোধ শিক্ষা ও জীবনদক্ষতা কোর্স (ভিইএস)',
    levelEn: 'Campus Workshop',
    levelBn: 'ক্যাম্পাস কর্মশালা',
    durationEn: '4 Weeks Weekend Series',
    durationBn: '৪ সপ্তাহ (সাপ্তাহিক ছুটির দিন)',
    descEn: 'Universal human values, emotional intelligence, stress resilience, conflict resolution, and ethics from Ramayana & Mahabharata.',
    descBn: 'রামায়ণ ও মহাভারত থেকে নেতৃত্ব শিক্ষা, মানসিক চাপ নিয়ন্ত্রণ, আবেগীয় পরিপক্বতা ও সার্বজনীন মানবিক মূল্যবোধ।',
    targetAudienceEn: 'All academic students, competitive exam / BCS candidates, and professionals.',
    targetAudienceBn: 'সাধারণ শিক্ষার্থী, বিসিএস ও চাকরির পরীক্ষার্থী এবং পেশাজীবীদের জন্য।',
    prerequisitesEn: 'Interest in character building and holistic success.',
    prerequisitesBn: 'ব্যক্তিত্ব বিকাশ ও সার্বিক সাফল্যে আগ্রহ।',
    certificationEn: 'Advaita VOICE Certificate in Universal Value Education & Soft Skills.',
    certificationBn: 'সার্বজনীন মূল্যবোধ শিক্ষা ও জীবনদক্ষতা সনদপত্র।',
    examFormatEn: 'Action Project Submission + Peer Presentation.',
    examFormatBn: 'বাস্তব প্রজেক্ট সাবমিশন + সহপাঠী মূল্যায়ন।',
    materialsEn: [
      'Values for Life Workbook',
      'Timeless Leadership Lessons from Mahabharata',
      'Practical Emotional Regulation Journal'
    ],
    materialsBn: [
      'ভ্যালুজ ফর লাইফ ওয়ার্কবুক',
      'মহাভারতের নেতৃত্ব শিক্ষা সংকলন',
      'মানসিক স্থিরতা ডায়রি'
    ],
    sessions: [
      {
        sessionNo: 1,
        titleEn: 'Session 1: Emotional Resilience & Handling Failure',
        titleBn: 'সেশন ১: আবেগীয় দৃঢ়তা ও ব্যর্থতাকে সাফল্যে রূপান্তর',
        summaryEn: 'Developing an unshakeable mindset during university exams, career rejections, and personal hardships.',
        summaryBn: 'পরীক্ষার চাপ, ব্যর্থতা ও মানসিক বিষাদ কাটিয়ে দৃঢ় আত্মপ্রত্যয় গড়ে তোলা।',
        keyTopicsEn: ['Growth mindset vs fixed mindset', 'Reframing setbacks', 'Inner spiritual anchor'],
        keyTopicsBn: ['ইতিবাচক মানসিকতা', 'ব্যর্থতাকে শিক্ষায় রূপান্তর', 'আধ্যাত্মিক আশ্রয়']
      },
      {
        sessionNo: 2,
        titleEn: 'Session 2: Integrity, Ethics & Leadership in Public Life',
        titleBn: 'সেশন ২: সততা, নৈতিকতা ও সমাজে আদর্শ নেতৃত্ব',
        summaryEn: 'Lessons from the leadership of Sri Rama, Bhishma, and Vidura on uncompromised integrity.',
        summaryBn: 'শ্রীরামচন্দ্র, ভীষ্ম ও বিদুরের চরিত্র থেকে নিঃস্বার্থ ও সত্যনিষ্ঠ নেতৃত্বের শিক্ষা।',
        keyTopicsEn: ['Dharma as ethical foundation', 'Servant leadership', 'Resisting corruption'],
        keyTopicsBn: ['ধর্মই নৈতিকতার ভিত্তি', 'সেবামূলক নেতৃত্ব', 'দুর্নীতিমুক্ত চরিত্র']
      }
    ]
  }
];

// -------------------------------------------------------------
// 2. DETAILED CAMPS DATA (5 Major Camps with Sub-sections)
// -------------------------------------------------------------
export const DETAILED_CAMPS_DATA: CampDetailItem[] = [
  {
    id: 'camp_annual',
    titleEn: 'Annual Advaita VOICE Youth Retreat',
    titleBn: 'বার্ষিক অদ্বৈত ভয়েস আবাসিক যুব রিট্রিট ও মহাসম্মেলন',
    categoryEn: 'Annual Residential Retreat',
    categoryBn: 'বার্ষিক আবাসিক যুব রিট্রিট',
    locationEn: 'Chittagong Hill Tracts & Bandarban Valley Spiritual Sanctuary',
    locationBn: 'বান্দরবান উপত্যকা ও পাহাড়ি প্রাকৃতিক মনোরম পরিবেশ',
    durationEn: '3 Days & 2 Nights (Full Residential)',
    durationBn: '৩ দিন ২ রাত (পূর্ণ আবাসিক)',
    descEn: 'The flagship annual 3-day spiritual retreat where university students step away from academic stress into deep nature, absorbing in japa meditation, dynamic workshops, bonfire kirtan, and profound association.',
    descBn: 'বিশ্ববিদ্যালয় জীবনের যান্ত্রিক ব্যস্ততা থেকে মুক্ত হয়ে প্রকৃতির কোলে ৩ দিনের নিবিড় সাধনা, ভজন, কর্মশালা, ক্যাম্পফায়ার ও বৈষ্ণব সঙ্গের মহা মিলনমেলা।',
    visionEn: 'Rejuvenating youth enthusiasm in Krishna Consciousness through pristine nature, deep hearing, and affectionate ashram brotherhood.',
    visionBn: 'প্রকৃতির সান্নিধ্যে গভীর শ্রবণ-কীর্তনের মাধ্যমে যুবকদের মাঝে কৃষ্ণভাবনার নতুন উদ্দীপনা ও প্রীতিপূর্ণ ভ্রাতৃত্ব জাগ্রত করা।',
    highlightsEn: [
      '64-Rounds Japa Marathon Challenge in Early Morning Mist',
      'Interactive Case-Study Workshops by Senior Sannyasis & Scholars',
      'Nature Parikrama through Pristine Mountain Forest Trails',
      'Ecstatic Nightly Campfire Harinama Sankirtana under Open Sky',
      'Vedic Leadership Games, Debates & Team Quizzes',
      'Sumptuous 100% Pure Sanctified Feasts (Mahaprasadam)'
    ],
    highlightsBn: [
      'ভোরের কুয়াশাচ্ছন্ন পাহাড়ে ৬৪ মালা জপ চ্যালেঞ্জ',
      'বরেণ্য সন্ন্যাসী ও পণ্ডিতদের অনুপ্রেরণামূলক কর্মশালা',
      'প্রাকৃতিক পাহাড়ি বনপথে নাম-সংকীর্তন পরিক্রমা',
      'উন্মুক্ত আকাশের নিচে ক্যাম্পফায়ার ভজন সন্ধ্যা',
      'বৈদিক নেতৃত্ব গেমস, বিতর্ক ও টিম কুইজ',
      'প্রতিদিন ৩ বেলা অমৃতময় মহাপ্রসাদ আস্বাদন'
    ],
    packingListEn: [
      'Dhoti-Kurta / Formal Vaishnava attire + Warm jacket for night',
      'Japa Mala, Bead Bag, Note Pad, Pen & Spiritual Reading Book',
      'Personal toiletries, towel, water bottle, torch light',
      'Comfortable walking shoes / sandals for forest trails',
      'Prescribed personal medications (if any)'
    ],
    packingListBn: [
      'ধুতি-পাঞ্জাবি / মার্জিত পোশাক + রাতের জন্য হালকা গরম কাপড়',
      'জপমালা, জপ থলি, নোটবুক, কলম ও একটি শাস্ত্রীয় গ্রন্থ',
      'ব্যক্তিগত প্রসাধন সামগ্রী, গামছা, পানির বোতল ও টর্চলাইট',
      'পাহাড়ি হাঁটার উপযোগী জুতো বা স্যান্ডেল',
      'ব্যক্তিগত প্রয়োজনীয় ওষুধপত্র'
    ],
    guidelinesEn: [
      'Full participation in morning Mangalarati (4:30 AM) is required.',
      'Strictly vegetarian/prasadam zone; external outside food not permitted.',
      'Digital curfew: Phones kept in silent focus mode during all sessions.',
      'Maintain affectionate ashram brotherhood and cooperative seva mood.'
    ],
    guidelinesBn: [
      'ভোর ৪:৩০টায় মঙ্গল আরতিতে সকলের উপস্থিতি বাধ্যতামূলক।',
      'সম্পূর্ণ অহিংস ও মহাপ্রসাদময় পরিবেশ; বাইরের খাবার সম্পূর্ণ নিষিদ্ধ।',
      'ডিজিটাল সংযম: সেশন চলাকালীন মোবাইল ফোন সাইলেন্ট রাখতে হবে।',
      'পারস্পরিক প্রীতি ও সেবামূলক মনোভাব বজায় রাখা।'
    ],
    coordinatorEn: 'HG Raghav Kirtan Das & HG Rashbihari KC Das (Advaita VOICE)',
    coordinatorBn: 'শ্রীল রাঘব কীর্তন দাস ও শ্রীল রাসবিহারী কেসি দাস (অদ্বৈত ভয়েস)',
    schedule: [
      {
        dayTitleEn: 'Day 1: Arrival, Inauguration & Campfire Sankirtan',
        dayTitleBn: '১ম দিন: আগমন, উদ্বোধন ও ক্যাম্পফায়ার সংকীর্তন',
        timeline: [
          { time: '02:00 PM', activityEn: 'Arrival, Room Check-in & Welcome Refreshments', activityBn: 'শিবিরে আগমন, কক্ষ বণ্টন ও স্বাগত মহাপ্রসাদ' },
          { time: '04:30 PM', activityEn: 'Inaugural Keynote Address: "Why Youth Need Spirituality"', activityBn: 'উদ্বোধনী বক্তব্য: "যুবসমাজের কেন আধ্যাত্মিকতা প্রয়োজন"' },
          { time: '06:30 PM', activityEn: 'Sandhya Arati & Heartfelt Gauranga Kirtan', activityBn: 'সন্ধ্যা আরতি ও গৌর আরতি কীর্তন' },
          { time: '08:00 PM', activityEn: 'Nightly Bonfire Vedic Katha & Mantra Rock', activityBn: 'ক্যাম্পফায়ার ভাগবত কথা ও মন্ত্র রক সংকীর্তন' },
          { time: '09:30 PM', activityEn: 'Night Rest (Brahma-Muhurta Preparation)', activityBn: 'নিদ্রা বিশ্রাম' }
        ]
      },
      {
        dayTitleEn: 'Day 2: 64-Rounds Japa Day & Mountain Forest Parikrama',
        dayTitleBn: '২য় দিন: ৬৪ মালা জপ দিবস ও পাহাড়ি বন পরিক্রমা',
        timeline: [
          { time: '04:30 AM', activityEn: 'Mangalarati, Nrsimha Prayers & Tulasi Puja', activityBn: 'মঙ্গল আরতি, নৃসিংহ স্তব ও তুলসী পরিক্রমা' },
          { time: '06:00 AM', activityEn: 'Morning Nature Japa Walk (64-Rounds Meditation)', activityBn: 'প্রকৃতির কোলে প্রাতঃকালীন জপ পরিক্রমা (৬৪ মালা)' },
          { time: '08:30 AM', activityEn: 'Grand Breakfast Mahaprasadam', activityBn: 'সকালের মহাপ্রসাদ গ্রহণ' },
          { time: '10:00 AM', activityEn: 'Workshop: "Mind Mastery & Overcoming Digital Maya"', activityBn: 'কর্মশালা: "মন নিয়ন্ত্রণ ও ডিজিটাল মায়ামুক্তি"' },
          { time: '01:30 PM', activityEn: 'Sumptuous Feast & Short Rest', activityBn: 'দুপুরের মহা ভোজ ও বিশ্রাম' },
          { time: '04:00 PM', activityEn: 'Mountain Forest Parikrama & Outdoor Team Games', activityBn: 'পাহাড় পরিক্রমা ও দলগত বৈদিক গেমস' },
          { time: '07:30 PM', activityEn: 'Cultural Drama: "The Transformation of Bilvamangala"', activityBn: 'নাটক: "বিল্বমঙ্গল ঠাকুরের রূপান্তর"' }
        ]
      },
      {
        dayTitleEn: 'Day 3: Resolution, Award Ceremony & Return Yatra',
        dayTitleBn: '৩য় দিন: সংকল্প গ্রহণ, সম্মাননা সনদ ও প্রত্যাবর্তন',
        timeline: [
          { time: '04:30 AM', activityEn: 'Mangalarati & Srimad Bhagavatam Discourse', activityBn: 'মঙ্গল আরতি ও শ্রীমদ্ভাগবত প্রবচন' },
          { time: '08:00 AM', activityEn: 'Breakfast Mahaprasadam', activityBn: 'প্রাতঃরাশ প্রসাদ' },
          { time: '09:30 AM', activityEn: 'Counselor Round-table: Personal Spiritual Action Plan', activityBn: 'কাউন্সেলরদের সাথে ব্যক্তিগত জীবন পরিকল্পনা' },
          { time: '11:30 AM', activityEn: 'Certificate Distribution & Camp Awards', activityBn: 'সনদপত্র বিতরণ ও শ্রেষ্ঠ সাধক সম্মাননা' },
          { time: '01:00 PM', activityEn: 'Grand Farewell Feast & Return Bus Departure', activityBn: 'বিদায়ী প্রীতিভোজ ও যাত্রা সমাপ্তি' }
        ]
      }
    ]
  },
  {
    id: 'camp_udgosh',
    titleEn: 'Mega Youth Fest "UDGOSH"',
    titleBn: 'মেগা ইয়ুথ ফেস্ট "উদ্ঘোষ" — আন্তঃবিশ্ববিদ্যালয় যুব সম্মেলন',
    categoryEn: 'Campus Convention',
    categoryBn: 'ক্যাম্পাস মহা সম্মেলন',
    locationEn: 'University of Chittagong Central Auditorium / City Convention Center',
    locationBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় মিলনায়তন / কনভেনশন সেন্টার',
    durationEn: '1 Full Day Convention (8:30 AM – 6:00 PM)',
    durationBn: '১ দিনব্যাপী মেগা উৎসব (সকাল ৮:৩০ – সন্ধ্যা ৬:০০)',
    descEn: 'The largest annual gathering of university student youth, featuring keynote discourses by renowned scholars, mind-blowing stage drama, musical mantra rock, Vedic quiz championship, and an enormous feast.',
    descBn: '১০০০+ বিশ্ববিদ্যালয়ের ছাত্রছাত্রীদের অংশগ্রহণে বার্ষিক মহা যুব সম্মেলন—দিকনির্দেশনামূলক বক্তব্য, আধ্যাত্মিক নাটক, কুইজ প্রতিযোগিতা ও মহা ভোজ।',
    visionEn: 'Inspiring modern educated youth to embrace eternal spiritual values alongside outstanding academic and career excellence.',
    visionBn: 'আধুনিক শিক্ষিত তরুণদের মাঝে মেধা, ক্যারিয়ার ও শাশ্বত বৈদিক মূল্যবোধের অপূর্ব মেলবন্ধন তৈরি করা।',
    highlightsEn: [
      '1,000+ University Students & Professors Attendance',
      'Keynote Lectures by Internationally Renowned Sannyasis',
      'Inter-University Vedic Quiz Championship with Prizes',
      'Spectacular Theatrical Drama by Advaita VOICE Youth Troupe',
      'Live Mantra Fusion Rock & Ecstatic Dancing Kirtan',
      'Free Multi-Course Sanctified Vegetarian Feast for All'
    ],
    highlightsBn: [
      '১০০০+ শিক্ষার্থী ও অধ্যাপকদের মিলনমেলা',
      'আন্তর্জাতিক খ্যাতিসম্পন্ন বক্তাদের সারগর্ভ বক্তব্য',
      'আকর্ষণীয় পুরস্কারসহ আন্তঃবিশ্ববিদ্যালয় কুইজ প্রতিযোগিতা',
      'অদ্বৈত ভয়েস ড্রামা দল কর্তৃক মনমুগ্ধকর নাটক পরিবেশনা',
      'মন্ত্র ফিউশন ও উদ্বেল নৃত্য-কীর্তন',
      'সবার জন্য বিনামূল্যে মহা প্রীতিভোজ'
    ],
    packingListEn: [
      'Fest Registration Pass / Digital QR Ticket',
      'Student ID Card & Notebook for taking notes',
      'Smart casual / formal marjita attire'
    ],
    packingListBn: [
      'ফেস্টের রেজিস্ট্রেশন পাস বা ডিজিটাল কিউআর কোড',
      'বিশ্ববিদ্যালয়ের স্টুডেন্ট আইডি কার্ড ও নোটবুক',
      'মার্জিত পোশাক'
    ],
    guidelinesEn: [
      'Auditorium entry opens at 8:30 AM; please be seated by 9:00 AM.',
      'Photography & recordings strictly permitted in designated zones.',
      'Maintain discipline and sacred decorum inside the hall.'
    ],
    guidelinesBn: [
      'সকাল ৮:৩০টায় হলরুম উন্মুক্ত হবে; ৯:০০টার মধ্যে আসন গ্রহণ করতে হবে।',
      'মিলনায়তনে শৃঙ্খলা ও পবিত্র পরিবেশ বজায় রাখা।'
    ],
    coordinatorEn: 'Advaita VOICE Youth Festival Organizing Committee',
    coordinatorBn: 'অদ্বৈত ভয়েস যুব উৎসব বাস্তবায়ন পরিষদ',
    schedule: [
      {
        dayTitleEn: 'UDGOSH Full Day Program Flow',
        dayTitleBn: 'উদ্ঘোষ দিনব্যাপী উৎসব সূচি',
        timeline: [
          { time: '08:30 AM', activityEn: 'Registration, Welcome Gift Kit & Seating', activityBn: 'রেজিস্ট্রেশন কিট প্রদান ও আসন গ্রহণ' },
          { time: '09:30 AM', activityEn: 'Vedic Invocation & Lighting of Sacred Lamp', activityBn: 'বেদমন্ত্র পাঠ ও মঙ্গল প্রদীপ প্রজ্জ্বলন' },
          { time: '10:00 AM', activityEn: 'Keynote Speech: "The Science of Inner Leadership"', activityBn: 'মূল প্রবন্ধ: "নেতৃত্বের অভ্যন্তরীণ বিজ্ঞান"' },
          { time: '11:30 AM', activityEn: 'Inter-University Vedic Quiz Grand Finale', activityBn: 'আন্তঃবিশ্ববিদ্যালয় বৈদিক কুইজ গ্র্যান্ড ফিনালে' },
          { time: '01:00 PM', activityEn: 'Sumptuous Feast (Mahaprasadam Banquet)', activityBn: 'মহা প্রীতিভোজ উৎসব' },
          { time: '02:30 PM', activityEn: 'Mega Stage Drama Presentation', activityBn: 'মহা মঞ্চ নাটক পরিবেশনা' },
          { time: '04:00 PM', activityEn: 'Prize Giving Ceremony & Dignitary Speeches', activityBn: 'পুরস্কার বিতরণ ও অতিথিবৃন্দের সম্মাননা' },
          { time: '05:00 PM', activityEn: 'Mantra Rock Concert & Ecstatic Harinam', activityBn: 'মন্ত্র রক কনসার্ট ও উল্লাসিত নৃত্যকীর্তন' }
        ]
      }
    ]
  },
  {
    id: 'camp_yatra',
    titleEn: 'Sri Mayapur & Sri Vrindavan Dham Parikrama Yatra',
    titleBn: 'বার্ষিক শ্রীমায়াপুর ও ব্রজমণ্ডল ধাম পরিক্রমা যাত্রা',
    categoryEn: 'Holy Dham Pilgrimage',
    categoryBn: 'পবিত্র তীর্থ পরিক্রমা যাত্রা',
    locationEn: 'Sridham Mayapur (Nadia) & Sri Vrindavan Dham (Mathura)',
    locationBn: 'শ্রীধাম মায়াপুর (নদীয়া) ও শ্রী শ্রীল বৃন্দাবন ধাম (মথুরা)',
    durationEn: '7 Days Sacred Parikrama & Pilgrimage',
    durationBn: '৭ দিনের পবিত্র তীর্থযাত্রা ও পরিক্রমা',
    descEn: 'A life-transforming pilgrimage walking in the footprints of Lord Sri Chaitanya Mahaprabhu and Sri Sri Radha Krishna, accompanied by senior sannyasis explaining transcendental pastimes.',
    descBn: 'শ্রীচৈতন্য মহাপ্রভু ও শ্রীশ্রী রাধাকৃষ্ণের অপ্রাকৃত লীলাধাম দর্শন, যমুনা স্নান, গোবর্ধন পরিক্রমা ও সাধু সঙ্গের এক অপার্থিব তীর্থযাত্রা।',
    visionEn: 'Experiencing the transcendental reality of the holy dhams to deepen devotion, detaching the heart from mundane world.',
    visionBn: 'তীর্থ পরিক্রমার মাধ্যমে জড় জগতের প্রতি অনাসক্তি এবং শ্রীভগবানের চরণে গভীর ভক্তি ও শরণাগতি লাভ।',
    highlightsEn: [
      'Govardhana Hill 21-Kilometer Sacred Parikrama with Harinama',
      'Holy Bathing in Yamuna River, Radha Kunda & Shyama Kunda',
      'Visiting Historic Temples: Madana Mohana, Radha Raman, Govindaji',
      'Temple of Vedic Planetarium (TOVP) Architectural Tour at Mayapur',
      'Visiting Yogapitha (Birthplace of Lord Chaitanya) & Srivasa Angan',
      'Deep Harikatha Seminars by Senior Acharyas every evening'
    ],
    highlightsBn: [
      '২১ কিলোমিটার গিরিরাজ গোবর্ধন পরিক্রমা ও কীর্তন',
      'পবিত্র যমুনা, শ্রী রাধাকুণ্ড ও শ্যামকুণ্ডে পুণ্যস্নান',
      'মদনমোহন, রাধারমণ ও গোবিন্দজীর মতো প্রাচীন ঐতিহাসিক বিগ্রহ দর্শন',
      'মায়াপুরে নির্মাণাধীন বিশ্বখ্যাত টিওভিপি (TOVP) দর্শন',
      'শ্রীযোগপীঠ (মহাপ্রভুর জন্মস্থান) ও শ্রীবাস অঙ্গন পরিক্রমা',
      'প্রতি সন্ধ্যায় বরেণ্য বৈষ্ণবদের মুখে অপ্রাকৃত ভাগবত কথা'
    ],
    packingListEn: [
      'Valid Passport / NID / Student Verification ID',
      'Dhoti-Kurta / Saffron / White Vaishnava clothes for temples',
      'Japa Mala, Gopi Chandan, Tilak, Bead Bag, Scripture Reader',
      'Light travel bedding, comfortable walking shoes for long parikramas',
      'Essential travel medicines and personal items'
    ],
    packingListBn: [
      'বৈধ পাসপোর্ট / এনআইডি / স্টুডেন্ট আইডি',
      'ধুতি-পাঞ্জাবি / মার্জিত পোশাক ও তিলক সামগ্রী',
      'জপমালা, জপ থলি ও নিত্য পাঠের গীতা গ্রন্থ',
      'পরিক্রমায় হাঁটার উপযোগী নরম জুতো',
      'ব্যক্তিগত ভ্রমণ কিট ও প্রয়োজনীয় ওষুধ'
    ],
    guidelinesEn: [
      'Pilgrims must strictly abide by the 4 regulative principles during the yatra.',
      'Always move with the assigned group; avoid solitary wandering in unfamiliar areas.',
      'Maintain an attitude of humble service (Seva-bhava) to the holy dham.'
    ],
    guidelinesBn: [
      'যাত্রাকালে কঠোরভাবে ভক্তির ৪টি নিয়ম মেনে চলতে হবে।',
      'সর্বদা দলের সাথে থাকতে হবে এবং শৃঙ্খলার সাথে নির্দেশিকা অনুসরণ করতে হবে।',
      'ধামে কোনো অপরাধ না করে সেবামূলক ও শ্রদ্ধাশীল মনোভাব বজায় রাখা।'
    ],
    coordinatorEn: 'Advaita VOICE Yatra Coordination Dept & Temple Tour Guides',
    coordinatorBn: 'অদ্বৈত ভয়েস যাত্রা বিভাগ ও অভিজ্ঞ তীর্থ গাইড',
    schedule: [
      {
        dayTitleEn: '7-Day Parikrama Overview',
        dayTitleBn: '৭ দিনের পরিক্রমা সংক্ষিপ্ত রূপরেখা',
        timeline: [
          { time: 'Day 1–3', activityEn: 'Sri Mayapur Dham: Yogapitha, Srivas Angan, Ganga Snana, TOVP & Harinam', activityBn: 'শ্রীধাম মায়াপুর: যোগপীঠ, শ্রীবাস অঙ্গন, সুরধনী গঙ্গা স্নান ও টিওভিপি দর্শন' },
          { time: 'Day 4', activityEn: 'Travel to Sri Vrindavan Dham & Evening Yamuna Arati at Kesi Ghat', activityBn: 'শ্রী বৃন্দাবন যাত্রা ও কেশী ঘাটে অপূর্ব যমুনা আরতি দর্শন' },
          { time: 'Day 5', activityEn: 'Sri Govardhana Parikrama, Radha Kunda & Shyama Kunda Snana', activityBn: 'গিরিরাজ গোবর্ধন পরিক্রমা, রাধাকুণ্ড ও শ্যামকুণ্ড দর্শন ও স্নান' },
          { time: 'Day 6', activityEn: 'Historic 7 Goswami Temples Darshan & Nidhivan / Seva Kunj', activityBn: 'সাত গোস্বামী মন্দির দর্শন, নিধুবন ও সেবা কুঞ্জ পরিক্রমা' },
          { time: 'Day 7', activityEn: 'Special Yatra Conclusion Katha, Mahaprasadam & Safe Return Departure', activityBn: 'সমাপনী কথা, মহাপ্রসাদ ভোজ ও দেশে প্রত্যাবর্তন' }
        ]
      }
    ]
  },
  {
    id: 'camp_weekend',
    titleEn: 'Weekend 24-Hour Ashram Living Immersion',
    titleBn: 'সাপ্তাহিক ২৪ ঘণ্টার আশ্রমিক জীবন অভিজ্ঞতা ক্যাম্প',
    categoryEn: 'Ashram Immersion',
    categoryBn: 'আশ্রমিক সাধনা ক্যাম্প',
    locationEn: 'Advaita VOICE University Ashram, Chittagong',
    locationBn: 'অদ্বৈত ভয়েস বিশ্ববিদ্যালয় আশ্রম, চট্টগ্রাম',
    durationEn: 'Saturday 4:00 PM – Sunday 6:00 PM (24 Hours)',
    durationBn: 'শনিবার বিকাল ৪:০০ – রবিবার সন্ধ্যা ৬:০০ (২৪ ঘণ্টা)',
    descEn: 'Experience the pure monastic lifestyle of an authentic Vedic ashram for 24 hours: waking up at Brahma-muhurta, engaging in deity worship, temple cooking seva, and hearing sublime philosophy.',
    descBn: '২৪ ঘণ্টার জন্য বাস্তব আশ্রমিক জীবনের স্বাদ গ্রহণ: ব্রহ্ম মুহূর্তে জাগরণ, দেবালয়ে সেবা, রন্ধন সেবা ও নিবিড় বৈদিক শিক্ষা।',
    visionEn: 'Allowing student day-scholars to experience the profound inner peace and discipline of authentic ashram life.',
    visionBn: 'অনাবাসিক শিক্ষার্থীদের আশ্রমিক জীবনের শুচিতা, নিয়মানুবর্তিতা ও মানসিক প্রশান্তি আস্বাদনের সুযোগ প্রদান।',
    highlightsEn: [
      'Complete Brahma-Muhurta & Mangalarati Experience (3:30 AM)',
      'Hands-on Temple Seva: Cooking, Deities decoration, and Cleaning',
      'Exclusive Q&A Session with Senior Resident Brahmacharis',
      'Systematic Japa Absorption Workshop (Chanting with Focus)'
    ],
    highlightsBn: [
      'ব্রহ্ম মুহূর্তে (ভোর ৩:৩০) জাগরণ ও সম্পূর্ণ প্রভাতীয় অনুষ্ঠান',
      'দেবালয়ে প্রত্যক্ষ রন্ধন ও শৃঙ্গার সেবায় অংশগ্রহণ',
      'আশ্রমবাসী ব্রহ্মচারীদের সাথে একান্ত প্রশ্নোত্তর পর্ব',
      'মনোযোগ সহকারে জপ করার বিশেষ কৌশল কর্মশালা'
    ],
    packingListEn: [
      'Vaishnava clothes for 1 day',
      'Personal Japa Mala & notebook',
      'Toiletries & bedsheet'
    ],
    packingListBn: [
      '১ দিনের উপযোগী বৈষ্ণবীয় মার্জিত পোশাক',
      'জপমালা ও নোটবুক',
      'প্রসাধন ও ব্যক্তিগত চাদর'
    ],
    guidelinesEn: [
      'Arrival by 4:00 PM on Saturday; orientation starts at 4:30 PM.',
      'Follow all ashram daily bell schedules with enthusiasm.'
    ],
    guidelinesBn: [
      'শনিবার বিকাল ৪:০০টার মধ্যে আশ্রমে উপস্থিতি আবশ্যক।',
      'আশ্রমের দৈনন্দিন নিয়মাবলি প্রফুল্ল চিত্তে পালন করা।'
    ],
    coordinatorEn: 'Advaita VOICE Ashram General Secretary',
    coordinatorBn: 'অদ্বৈত ভয়েস আশ্রম সাধারণ সম্পাদক',
    schedule: [
      {
        dayTitleEn: '24-Hour Ashram Living Timeline',
        dayTitleBn: '২৪ ঘণ্টার আশ্রম জীবন সূচি',
        timeline: [
          { time: '04:00 PM (Sat)', activityEn: 'Arrival, Check-in & Orientation Session', activityBn: 'আগমন ও পরিচিতি পর্ব' },
          { time: '06:30 PM (Sat)', activityEn: 'Sandhya Arati, Gaura Arati & Bhagavad Gita Study', activityBn: 'সন্ধ্যা আরতি ও গীতা পাঠ' },
          { time: '08:30 PM (Sat)', activityEn: 'Night Prasad & Rest by 9:30 PM', activityBn: 'রাতের মহাপ্রসাদ ও ঘুম' },
          { time: '03:30 AM (Sun)', activityEn: 'Rising at Brahma-muhurta & Holy Bath', activityBn: 'ব্রহ্ম মুহূর্তে জাগরণ ও স্নান' },
          { time: '04:30 AM (Sun)', activityEn: 'Mangalarati, Nrsimharati & Tulasi Parikrama', activityBn: 'মঙ্গল আরতি ও তুলসী পূজা' },
          { time: '05:30 AM (Sun)', activityEn: 'Morning Attentive Japa Meditation (16 Rounds)', activityBn: 'নিবিষ্ট জপ মেডিটেশন (১৬ মালা)' },
          { time: '08:00 AM (Sun)', activityEn: 'Deity Darshan, Guru Puja & Srimad Bhagavatam Class', activityBn: 'দর্শন আরতি, গুরুপূজা ও শ্রীমদ্ভাগবত ক্লাস' },
          { time: '09:00 AM (Sun)', activityEn: 'Breakfast Prasad & Temple Seva Work (Cooking/Cleaning)', activityBn: 'প্রাতঃরাশ ও আশ্রম সেবা' },
          { time: '02:00 PM (Sun)', activityEn: 'Sunday Feast Program & Youth Discussion', activityBn: 'রবিবাসরীয় মহোৎসব ও যুব সম্মেলন' },
          { time: '05:30 PM (Sun)', activityEn: 'Reflections, Blessing by Senior Devotees & Return Home', activityBn: 'অনুভূতি বিনিময় ও শুভ সমাপ্তি' }
        ]
      }
    ]
  },
  {
    id: 'camp_padayatra',
    titleEn: 'Campus Padayatra & Book Distribution Marathon',
    titleBn: 'ক্যাম্পাস পদযাত্রা ও গীতা বিতরণ প্রচার ক্যাম্প',
    categoryEn: 'Outreach & Harinama',
    categoryBn: 'নগর প্রচার ও বই বিতরণ',
    locationEn: 'University of Chittagong Campus & Adjacent Hill Communities',
    locationBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় ক্যাম্পাস, জিরো পয়েন্ট ও পার্শ্ববর্তী উপশহর',
    durationEn: 'Weekend Intensive (Saturday Full Day)',
    durationBn: 'সাপ্তাহিক ছুটির দিনব্যাপী প্রচার ক্যাম্প',
    descEn: 'Equipping youth with the sublime joy of sharing Vedic literature door-to-door, distributing hot sanctified food, and performing vibrant Harinama Sankirtana.',
    descBn: 'দ্বারে দ্বারে গিয়ে গীতা ও আত্মোপলব্ধির বিজ্ঞান গ্রন্থ বিতরণ, হরিনাম সংকীর্তন এবং তৃষ্ণার্ত মানুষের মাঝে মহাপ্রসাদ বিতরণ।',
    visionEn: 'Experiencing the highest transcendental ecstasy of practical preaching and sharing Srila Prabhupada’s mercy.',
    visionBn: 'শ্রীল প্রভুপাদের গ্রন্থ বিতরণের মাধ্যমে প্রত্যক্ষ প্রচারের অপার্থিব আনন্দ লাভ।',
    highlightsEn: [
      'Street Harinama Procession with Mridanga & Karatalas',
      'Distributing 200+ Bhagavad Gita As It Is in a Single Day',
      'Free Khichuri Mahaprasadam Distribution to 500+ Students',
      'Practical Field Training on Approaching Strangers with Courtesy'
    ],
    highlightsBn: [
      'মৃদঙ্গ ও করতাল সহযোগে ক্যাম্পাস পদযাত্রা ও সংকীর্তন',
      'একদিনেই ২০০+ শ্রীমদ্ভগবদ্গীতা যথার্থ বিতরণ',
      '৫০০+ শিক্ষার্থীর মাঝে বিনামূল্যে মহাপ্রসাদ বিতরণ',
      'বিনম্রভাবে গ্রন্থ উপস্থাপনের বাস্তব ফিল্ড প্রশিক্ষণ'
    ],
    packingListEn: [
      'White / Saffron Vaishnava dress',
      'Book carrying bag / backpack',
      'Water bottle, notebook for donor contacts'
    ],
    packingListBn: [
      'মার্জিত পোশাক',
      'বই বহন করার জন্য কাঁধের ব্যাগ',
      'পানির বোতল ও যোগাযোগ ডায়রি'
    ],
    guidelinesEn: [
      'Always maintain sweetness, humility, and polite respect with every person.',
      'Never argue disrespectfully; present Bhagavad Gita with love and dignity.'
    ],
    guidelinesBn: [
      'সবার সাথে অত্যন্ত বিনম্র, মার্জিত ও মিষ্ট ব্যবহার বজায় রাখতে হবে।',
      'কোনো তর্কে না জড়িয়ে শ্রীল প্রভুপাদের গ্রন্থ প্রীতির সাথে উপস্থাপন করা।'
    ],
    coordinatorEn: 'Advaita VOICE Sankirtan & Book Marathon Incharge',
    coordinatorBn: 'অদ্বৈত ভয়েস সংকীর্তন ও গ্রন্থ প্রচার বিভাগ',
    schedule: [
      {
        dayTitleEn: 'Padayatra & Marathon Flow',
        dayTitleBn: 'পদযাত্রা ও ম্যারাথন কার্যসূচি',
        timeline: [
          { time: '08:30 AM', activityEn: 'Morning Briefing, Shloka Recitation & Book Bag Distribution', activityBn: 'প্রাতঃকালীন দিকনির্দেশনা ও বইয়ের ব্যাগ প্রস্তুতকরণ' },
          { time: '09:30 AM', activityEn: 'Campus Harinama & Door-to-Door Book Distribution', activityBn: 'পদযাত্রা সংকীর্তন ও ক্যাম্পাসে বই বিতরণ' },
          { time: '01:30 PM', activityEn: 'Midday Mahaprasadam at Ashram', activityBn: 'মধ্যাহ্ন প্রসাদ আস্বাদন' },
          { time: '03:00 PM', activityEn: 'Afternoon Village & Zero-Point Outreach', activityBn: 'জিরো পয়েন্ট ও সংলগ্ন এলাকায় প্রচার' },
          { time: '06:00 PM', activityEn: 'Sankirtana Marathon Score Calculation & Blissful Celebration', activityBn: 'বই বিতরণের হিসাব গণনা ও কীর্তন আনন্দ' }
        ]
      }
    ]
  }
];
