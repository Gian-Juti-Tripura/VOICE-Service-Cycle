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
// 2. DETAILED CAMPS DATA (Authentic Official 13 VOICE Camps from Syllabus Handbook)
// -------------------------------------------------------------
export const DETAILED_CAMPS_DATA: CampDetailItem[] = [
  // --- FIRST YEAR CAMPS ---
  {
    id: 'camp_sankalpa',
    titleEn: 'Sankalpa Camp (Determination & Vows)',
    titleBn: 'সংকল্প ক্যাম্প (দৃঢ় সংকল্প ও ব্রত গ্রহণ)',
    categoryEn: 'First Year Camp 1',
    categoryBn: '১ম বর্ষ ক্যাম্প ১',
    locationEn: 'Advaita VOICE Ashram / Spiritual Retreat Centre',
    locationBn: 'অদ্বৈত ভয়েস আশ্রম / আধ্যাত্মিক রিট্রিট সেন্টার',
    durationEn: '2 Days & 1 Night (Full Residential)',
    durationBn: '২ দিন ১ রাত (পূর্ণ আবাসিক)',
    descEn: 'The foundational first-year camp where new students take solemn vows to practice daily japa meditation, regulate habits, and cultivate determination on the spiritual path.',
    descBn: '১ম বর্ষের শিক্ষার্থীদের প্রাথমিক আবাসিক ক্যাম্প যেখানে প্রাত্যহিক জপ সাধনা, সাত্ত্বিক জীবনাচরণ ও সংকল্প গ্রহণের বাস্তব প্রশিক্ষণ প্রদান করা হয়।',
    visionEn: 'Building an unshakeable foundation of spiritual discipline and daily japa habit in youth.',
    visionBn: 'তরুণ শিক্ষার্থীদের মাঝে নিয়মিত জপ সাধনা ও নিয়মানুবর্তিতার দৃঢ় সংকল্প গড়ে তোলা।',
    highlightsEn: [
      'Early Morning Mangalarati & Guided Japa Workshop',
      'Art of Mind Control & Overcoming Procrastination Seminar',
      'Formal Sankalpa (Devotional Vow) Ceremony',
      'Loving Vaishnava Association & Ashram Community Living'
    ],
    highlightsBn: [
      'ভোরের মঙ্গল আরতি ও নিবিড় জপ কর্মশালা',
      'মন নিয়ন্ত্রণ ও সময়ের সদ্ব্যবহার বিষয়ক সেমিনার',
      'আনুষ্ঠানিক সংকল্প গ্রহণ ও ব্রত উৎসব',
      'স্নেহপূর্ণ বৈষ্ণব সঙ্গ ও আশ্রম জীবনের অভিজ্ঞতা'
    ],
    packingListEn: [
      'Dhoti-Kurta / Vaishnava dress',
      'Japa Mala, Bead Bag & Notebook',
      'Personal toiletries & essential items'
    ],
    packingListBn: [
      'ধুতি-পাঞ্জাবি / মার্জিত পোশাক',
      'জপমালা, জপ থলি ও নোটবুক',
      'ব্যক্তিগত প্রসাধন সামগ্রী ও প্রয়োজনীয় জিনিসপত্র'
    ],
    guidelinesEn: [
      'Full attendance in all morning and evening ashram programs.',
      'Mobile phones kept on silent focus mode during sessions.'
    ],
    guidelinesBn: [
      'সকালের মঙ্গল আরতি ও সন্ধ্যার আরতি-কীর্তনে বাধ্যতামূলক উপস্থিতি।',
      'সেশন চলাকালীন মোবাইল ফোন সাইলেন্ট রাখতে হবে।'
    ],
    coordinatorEn: 'Advaita VOICE Youth Training Team',
    coordinatorBn: 'অদ্বৈত ভয়েস যুব প্রশিক্ষণ টিম',
    schedule: [
      {
        dayTitleEn: 'Day 1: Arrival, Orientation & Guided Japa',
        dayTitleBn: '১ম দিন: আগমন, পরিচিতি ও জপ প্রশিক্ষণ',
        timeline: [
          { time: '03:00 PM', activityEn: 'Arrival, Room Allocation & Welcome Refreshments', activityBn: 'শিবিরে আগমন, আসন বণ্টন ও স্বাগত মহাপ্রসাদ' },
          { time: '05:00 PM', activityEn: 'Orientation: "The Power of Sankalpa in Youth Life"', activityBn: 'পরিচিতি সেশন: "যুব জীবনে সংকল্পের শক্তি"' },
          { time: '06:30 PM', activityEn: 'Sandhya Arati, Gaura Arati & Kirtan', activityBn: 'সন্ধ্যা আরতি, গৌর আরতি ও কীর্তন' },
          { time: '08:00 PM', activityEn: 'Evening Prasadam & Sanga Discussion', activityBn: 'রাতের মহাপ্রসাদ ও প্রীতি সম্মিলন' }
        ]
      },
      {
        dayTitleEn: 'Day 2: Vow Taking Ceremony & Conclusion',
        dayTitleBn: '২য় দিন: সংকল্প গ্রহণ ও সমাপনী',
        timeline: [
          { time: '04:30 AM', activityEn: 'Mangalarati & Tulasi Parikrama', activityBn: 'মঙ্গল আরতি ও তুলসী পরিক্রমা' },
          { time: '06:00 AM', activityEn: 'Guided Japa Meditation Workshop', activityBn: 'নিবিড় জপ সাধনা কর্মশালা' },
          { time: '08:30 AM', activityEn: 'Breakfast Mahaprasadam', activityBn: 'সকালের মহাপ্রসাদ' },
          { time: '10:00 AM', activityEn: 'Formal Sankalpa Vow Ceremony & Certificates', activityBn: 'আনুষ্ঠানিক সংকল্প গ্রহণ ও সমাপনী' }
        ]
      }
    ]
  },
  {
    id: 'camp_sphurti',
    titleEn: 'Sphurti Camp (Spiritual Joy & Energy)',
    titleBn: 'স্ফূর্তি ক্যাম্প (আধ্যাত্মিক উল্লাস ও নব উদ্দীপনা)',
    categoryEn: 'First Year Camp 2',
    categoryBn: '১ম বর্ষ ক্যাম্প ২',
    locationEn: 'Scenic Ashram Nature Retreat',
    locationBn: 'প্রাকৃতিক মনোরম আশ্রম পরিবেশ',
    durationEn: '2 Days & 1 Night',
    durationBn: '২ দিন ১ রাত',
    descEn: 'Igniting dynamic enthusiasm, joyful service, drama, Vedic games, and ecstatic kirtan for first-year devotees.',
    descBn: '১ম বর্ষের ভক্তদের আধ্যাত্মিক আনন্দ, উৎসাহ উদ্দীপনা, বৈদিক নাটক ও সংকীর্তনে উজ্জীবিত করার প্রাণবন্ত ক্যাম্প।',
    visionEn: 'Transforming spiritual practice into a joyful, vibrant way of life.',
    visionBn: 'আধ্যাত্মিক জীবনকে আনন্দময়, প্রাণবন্ত ও উদ্যমী করে তোলা।',
    highlightsEn: [
      'Dynamic Harinama Sankirtana & Mridanga Beats',
      'Vedic Quiz Competitions & Team Games',
      'Devotional Drama & Cultural Performances',
      'Overcoming Negative Mindsets Workshop'
    ],
    highlightsBn: [
      'উচ্ছ্বসিত হরিনাম সংকীর্তন ও মৃদঙ্গ বাদন',
      'বৈদিক কুইজ ও দলগত অনুপ্রেরণামূলক খেলা',
      'ভক্তিমূলক নাটক ও সাংস্কৃতিক পরিবেশনা',
      'নেতিবাচক চিন্তা দূরীকরণ কর্মশালা'
    ],
    packingListEn: ['Vaishnava attire', 'Japa Mala & notes'],
    packingListBn: ['মার্জিত পোশাক', 'জপমালা ও নোটবুক'],
    guidelinesEn: ['Active participation in all team activities.'],
    guidelinesBn: ['সকল দলগত কার্যক্রমে সক্রিয় অংশগ্রহণ।'],
    coordinatorEn: 'Advaita VOICE Cultural Department',
    coordinatorBn: 'অদ্বৈত ভয়েস সাংস্কৃতিক বিভাগ',
    schedule: [
      {
        dayTitleEn: 'Day 1: Energy & Expression',
        dayTitleBn: '১ম দিন: উদ্দীপনা ও সৃজনশীল প্রকাশ',
        timeline: [
          { time: '04:00 PM', activityEn: 'Arrival & Welcome Kirtan', activityBn: 'আগমন ও স্বাগত কীর্তন' },
          { time: '07:00 PM', activityEn: 'Mantra Rock & Cultural Night', activityBn: 'মন্ত্র সংকীর্তন ও সাংস্কৃতিক সন্ধ্যা' }
        ]
      },
      {
        dayTitleEn: 'Day 2: Vedic Games & Conclusion',
        dayTitleBn: '২য় দিন: বৈদিক খেলা ও সমাপনী',
        timeline: [
          { time: '04:30 AM', activityEn: 'Mangalarati & Morning Japa', activityBn: 'মঙ্গল আরতি ও প্রভাতী জপ' },
          { time: '10:00 AM', activityEn: 'Team Games, Prizes & Feast', activityBn: 'দলগত খেলা, পুরস্কার ও মহাপ্রসাদ' }
        ]
      }
    ]
  },
  {
    id: 'camp_utsaha',
    titleEn: 'Utsaha Camp (Unflinching Enthusiasm)',
    titleBn: 'উৎসাহ ক্যাম্প (অদম্য উৎসাহ ও অধ্যবসায়)',
    categoryEn: 'First Year Camp 3',
    categoryBn: '১ম বর্ষ ক্যাম্প ৩',
    locationEn: 'Advaita VOICE Center',
    locationBn: 'অদ্বৈত ভয়েস কেন্দ্র',
    durationEn: '2 Days & 1 Night',
    durationBn: '২ দিন ১ রাত',
    descEn: 'Deepening enthusiasm (utsahan niscayad dhairyat) in spiritual practices and academic excellence.',
    descBn: 'উপদেশামৃত ৩ অনুযায়ী উৎসাহ, নিশ্চয় ও ধৈর্যের সাথে সাধনা ও পড়াশোনায় অগ্রগতির বিশেষ ক্যাম্প।',
    visionEn: 'Sustaining high energy and spiritual enthusiasm across all campus challenges.',
    visionBn: 'ক্যাম্পাস জীবনের সকল প্রতিকূলতার মাঝেও আধ্যাত্মিক উৎসাহ বজায় রাখা।',
    highlightsEn: ['Upadeshamrita 3 Deep Dive', 'Time Management for University Students'],
    highlightsBn: ['উপদেশামৃত ৩ এর প্রয়োগ', 'বিশ্ববিদ্যালয় শিক্ষার্থীদের টাইম ম্যানেজমেন্ট'],
    packingListEn: ['Japa mala', 'Notebook', 'Dress'],
    packingListBn: ['জপমালা', 'নোটবুক', 'পোশাক'],
    guidelinesEn: ['Maintain punctuality in all sessions.'],
    guidelinesBn: ['সময়ানুবর্তিতা রক্ষা করা।'],
    coordinatorEn: 'Advaita VOICE Mentorship Cell',
    coordinatorBn: 'অদ্বৈত ভয়েস মেন্টরশিপ সেল',
    schedule: [
      {
        dayTitleEn: 'Day 1: The Principle of Utsaha',
        dayTitleBn: '১ম দিন: উৎসাহের মূলনীতি',
        timeline: [
          { time: '05:00 PM', activityEn: 'Keynote: "Keeping the Fire of Enthusiasm Burning"', activityBn: 'মূল বক্তব্য: "উৎসাহের প্রদীপ প্রজ্বলন"' }
        ]
      }
    ]
  },
  {
    id: 'camp_utkarsha',
    titleEn: 'Utkarsha Camp (Character Excellence)',
    titleBn: 'উৎকর্ষ ক্যাম্প (চারিত্রিক উৎকর্ষ ও ব্যক্তিত্ব বিকাশ)',
    categoryEn: 'First Year Camp 4',
    categoryBn: '১ম বর্ষ ক্যাম্প ৪',
    locationEn: 'Advaita VOICE Retreat Ground',
    locationBn: 'অদ্বৈত ভয়েস রিট্রিট প্রাঙ্গণ',
    durationEn: '2 Days & 1 Night',
    durationBn: '২ দিন ১ রাত',
    descEn: 'Culmination of first-year training, focusing on character excellence, integrity, and personal sadhana audit.',
    descBn: '১ম বর্ষের সমাপনী ক্যাম্প, যেখানে চারিত্রিক সাধুতা, সততা ও সামগ্রিক ব্যক্তিত্বের উৎকর্ষ সাধন করা হয়।',
    visionEn: 'Producing youths of character and competence for the society.',
    visionBn: 'সমাজে চারিত্রিক উৎকর্ষসম্পন্ন সৎ ও যোগ্য তরুণ নেতৃত্ব গড়ে তোলা।',
    highlightsEn: ['Sad-achara Workshop', 'Personal Transformation Testimonies'],
    highlightsBn: ['সদাচার প্রশিক্ষণ', 'ব্যক্তিগত পরিবর্তনের অভিজ্ঞতা বিনিময়'],
    packingListEn: ['Standard Vaishnava items'],
    packingListBn: ['প্রয়োজনীয় বৈষ্ণব উপকরণ'],
    guidelinesEn: ['Strict adherence to ashram discipline.'],
    guidelinesBn: ['আশ্রম নিয়মাবলী কঠোরভাবে অনুসরণ।'],
    coordinatorEn: 'HG Rasvihari KC Das',
    coordinatorBn: 'শ্রীল রাসবিহারী কেসি দাস',
    schedule: [{ dayTitleEn: 'Day 1-2', dayTitleBn: '১ম-২য় দিন', timeline: [{ time: '08:00 AM', activityEn: 'Excellence Seminars', activityBn: 'উৎকর্ষ সেমিনার' }] }]
  },

  // --- SECOND YEAR CAMPS ---
  {
    id: 'camp_srcgd',
    titleEn: 'SRCGD Camp (Scriptural Study & Devotional Culture)',
    titleBn: 'SRCGD ক্যাম্প (শাস্ত্রচর্চা ও ভক্তিমূলক সংস্কৃতি)',
    categoryEn: 'Second Year Camp 1',
    categoryBn: '২য় বর্ষ ক্যাম্প ১',
    locationEn: 'Advaita VOICE Central Ashram',
    locationBn: 'অদ্বৈত ভয়েস কেন্দ্রীয় আশ্রম',
    durationEn: '3 Days & 2 Nights',
    durationBn: '৩ দিন ২ রাত',
    descEn: 'Rigorous scriptural study and immersion in the authentic mood and teachings of Gaudiya Vaishnavism.',
    descBn: 'গৌড়ীয় বৈষ্ণব সিদ্ধান্ত ও শাস্ত্রীয় গভীর তত্ত্ব উপলব্ধির বিশেষ আবাসিক পাঠশালা ও কর্মশালা।',
    visionEn: 'Grounding 2nd year students deeply into philosophical conviction.',
    visionBn: '২য় বর্ষের শিক্ষার্থীদের দার্শনিক বিশ্বাস ও শাস্ত্রীয় জ্ঞানে সুপ্রতিষ্ঠিত করা।',
    highlightsEn: ['Systematic Bhagavad Gita Section Analysis', 'Morning Mangalarati & Japa Standards'],
    highlightsBn: ['ভগবদ্গীতার পদ্ধতিগত বিশ্লেষণ', 'উন্নত মানের প্রাতঃকালীন সাধনা'],
    packingListEn: ['Bhagavad Gita As It Is', 'Notebook', 'Japa Mala'],
    packingListBn: ['যথার্থ ভগবদ্গীতা', 'নোটবুক', 'জপমালা'],
    guidelinesEn: ['Mandatory attendance in all study periods.'],
    guidelinesBn: ['সকল স্টাডি সেশনে বাধ্যতামূলক উপস্থিতি।'],
    coordinatorEn: 'Senior Preachers Council',
    coordinatorBn: 'সিনিয়র প্রচারক পরিষদ',
    schedule: [{ dayTitleEn: 'Day 1-3', dayTitleBn: '১ম-৩য় দিন', timeline: [{ time: '09:00 AM', activityEn: 'Shastric Colloquium', activityBn: 'শাস্ত্র বিচার ও প্রশ্নোত্তর' }] }]
  },
  {
    id: 'camp_nistha',
    titleEn: 'Nistha Camp (Steadfast Devotion & Japa)',
    titleBn: 'নিষ্ঠা ক্যাম্প (অবিচল নিষ্ঠা ও গভীর জপ সাধনা)',
    categoryEn: 'Second Year Camp 2',
    categoryBn: '২য় বর্ষ ক্যাম্প ২',
    locationEn: 'Serene Spiritual Retreat Center',
    locationBn: 'শান্ত ও নিভৃত আধ্যাত্মিক আশ্রম',
    durationEn: '3 Days & 2 Nights',
    durationBn: '৩ দিন ২ রাত',
    descEn: 'Achieving the stage of Nistha (steadiness in devotional service), freedom from doubts, and pure 16-round chanting.',
    descBn: 'অনর্থ নিবৃত্তি পেরিয়ে ভক্তি সাধনায় অবিচল নিষ্ঠা অর্জন ও অভিনিবেশ সহকারে ১৬ মালা জপ অনুশীলনের ক্যাম্প।',
    visionEn: 'Eliminating mental distractions to attain unflinching steady devotion.',
    visionBn: 'চিত্তের চাঞ্চল্য দূর করে অবিচল ভক্তি সাধন নিষ্ঠা লাভ।',
    highlightsEn: ['64-Rounds Japa Challenge', 'Anartha Nivritti Seminar', 'Silence & Meditation Hours'],
    highlightsBn: ['৬৪ মালা জপ চ্যালেঞ্জ', 'অনর্থ নিবৃত্তি সেমিনার', 'মৌন জপ ও ধ্যান সেশন'],
    packingListEn: ['Vaishnava attire', 'Japa bead bag', 'Prabhupada lectures notes'],
    packingListBn: ['ধুতি-পাঞ্জাবি', 'জপ থলি', 'প্রভুপাদ লেকচার নোটবুক'],
    guidelinesEn: ['Total silence maintained during japa marathon hours.'],
    guidelinesBn: ['জপ চলার সময় পূর্ণ নীরবতা পালনীয়।'],
    coordinatorEn: 'HG Rasvihari KC Das',
    coordinatorBn: 'শ্রীল রাসবিহারী কেসি দাস',
    schedule: [{ dayTitleEn: 'Day 1-3', dayTitleBn: '১ম-৩য় দিন', timeline: [{ time: '05:00 AM', activityEn: 'Japa Marathon', activityBn: 'টানা জপ সাধনা' }] }]
  },
  {
    id: 'camp_ftw',
    titleEn: 'Follow up Training Workshop (FTW)',
    titleBn: 'ফলো-আপ ট্রেনিং ওয়ার্কশপ (FTW কর্মশালা)',
    categoryEn: 'Second Year Workshop',
    categoryBn: '২য় বর্ষ প্রশিক্ষণ কর্মশালা',
    locationEn: 'Advaita VOICE Hall',
    locationBn: 'অদ্বৈত ভয়েস মিলনায়তন',
    durationEn: '2 Days Workshop',
    durationBn: '২ দিনব্যাপী কর্মশালা',
    descEn: 'Structured follow-up training to audit sadhana, track academic progress, and troubleshoot practical devotee-life obstacles.',
    descBn: 'শিক্ষার্থীদের সাধনা মূল্যায়ন, পড়াশোনার অগ্রগতি নিরীক্ষণ এবং বাস্তব জীবনের সমস্যা সমাধানের ফলো-আপ কর্মশালা।',
    visionEn: 'Personal care and holistic progress monitoring of all growing devotees.',
    visionBn: 'প্রত্যেক শিক্ষার্থীর ব্যক্তিগত যত্ন গ্রহণ ও সমন্বিত অগ্রগতি নিশ্চিত করা।',
    highlightsEn: ['1-on-1 Counselor Review', 'Time Table Optimization', 'Spiritual Health Assessment'],
    highlightsBn: ['কাউন্সেলরের সাথে একান্তে পর্যালোচনা', 'রুটিন উন্নয়ন', 'আধ্যাত্মিক স্বাস্থ্য মূল্যায়ন'],
    packingListEn: ['Sadhana chart records', 'Notebook'],
    packingListBn: ['সাধনা রেকর্ড খাতা', 'নোটবুক'],
    guidelinesEn: ['Bring completed 3-month sadhana records.'],
    guidelinesBn: ['বিগত ৩ মাসের সাধনা রিপোর্ট সাথে আনতে হবে।'],
    coordinatorEn: 'Advaita VOICE Counselor Team',
    coordinatorBn: 'অদ্বৈত ভয়েস কাউন্সেলর টিম',
    schedule: [{ dayTitleEn: 'Day 1-2', dayTitleBn: '১ম-২য় দিন', timeline: [{ time: '10:00 AM', activityEn: 'Evaluation & Coaching', activityBn: 'মূল্যায়ন ও দিকনির্দেশনা' }] }]
  },
  {
    id: 'camp_fec',
    titleEn: 'Facilitator Empowerment Course (FEC)',
    titleBn: 'ফ্যাসিলিটেটর এমপাওয়ারমেন্ট কোর্স (FEC ক্যাম্প)',
    categoryEn: 'Second Year Empowerment',
    categoryBn: '২য় বর্ষ ক্ষমতায়ন ক্যাম্প',
    locationEn: 'Advaita VOICE Training Academy',
    locationBn: 'অদ্বৈত ভয়েস ট্রেনিং একাডেমি',
    durationEn: '2 Days Intensive',
    durationBn: '২ দিনের নিবিড় প্রশিক্ষণ',
    descEn: 'Empowering senior 2nd year devotees with leadership skills to facilitate DYS small groups, mentor newcomers, and lead discussion circles.',
    descBn: '২য় বর্ষের শিক্ষার্থীদের ছোট দল পরিচালনা, নতুনদের মেন্টরিং ও দলনেতার দায়িত্ব পালনের বাস্তব প্রশিক্ষণ।',
    visionEn: 'Creating capable facilitators to nurture future generations of students.',
    visionBn: 'আগামী প্রজন্মের শিক্ষার্থীদের সঠিক পথ প্রদর্শনে সক্ষম ফ্যাসিলিটেটর তৈরি।',
    highlightsEn: ['Group Discussion Moderation Skills', 'Active Listening & Empathy Training', 'Mock Facilitation Practicals'],
    highlightsBn: ['গ্রুপ আলোচনা পরিচালনার কৌশল', 'মনোযোগ দিয়ে শোনার দক্ষতা', 'মক ফ্যাসিলিটেশন প্র্যাকটিস'],
    packingListEn: ['Facilitator handbook', 'Formal attire'],
    packingListBn: ['ফ্যাসিলিটেটর হ্যান্ডবুক', 'মার্জিত পোশাক'],
    guidelinesEn: ['Participate in mock presentation sessions.'],
    guidelinesBn: ['মক প্রেজেন্টেশনে বাধ্যতামূলক অংশগ্রহণ।'],
    coordinatorEn: 'HG Utpol Das Khocon',
    coordinatorBn: 'উৎপল দাস খোকন',
    schedule: [{ dayTitleEn: 'Day 1-2', dayTitleBn: '১ম-২য় দিন', timeline: [{ time: '09:00 AM', activityEn: 'Facilitator Mastery', activityBn: 'ফ্যাসিলিটেশন দক্ষতা' }] }]
  },
  {
    id: 'camp_dys_pt',
    titleEn: 'DYS Preachers Training Camp',
    titleBn: 'ডিওয়াইএস প্রচারক প্রশিক্ষণ ক্যাম্প (DYS Preachers Training)',
    categoryEn: 'Second Year Preaching Camp',
    categoryBn: '২য় বর্ষ প্রচার প্রশিক্ষণ',
    locationEn: 'Advaita VOICE Preaching Hub',
    locationBn: 'অদ্বৈত ভয়েস প্রচার হাব',
    durationEn: '3 Days Camp',
    durationBn: '৩ দিনের প্রচার প্রশিক্ষণ',
    descEn: 'Practical public speaking, slide presentation, logic presentation, and answering youth questions to deliver the Discover Your Self (DYS) seminars on campus.',
    descBn: 'বিশ্ববিদ্যালয়ে ডিসকভার ইয়োর সেলফ কোর্স পড়ানোর জন্য পাবলিক স্পিকিং, স্লাইড প্রেজেন্টেশন ও প্রশ্নের উত্তর প্রদানের বিশেষ প্রশিক্ষণ।',
    visionEn: 'Developing bold, charismatic, and scripturally sound youth preachers.',
    visionBn: 'দৃঢ়প্রত্যয়ী, বাগ্মী ও শাস্ত্রনিষ্ঠ তরুণ প্রচারক তৈরি করা।',
    highlightsEn: ['Live Speech Delivery & Peer Feedback', 'Defending Science vs Spirituality Arguments', 'Slide Mastery & Body Language'],
    highlightsBn: ['সরাসরি বক্তব্য প্রদান ও ফিডব্যাক', 'বিজ্ঞান বনাম আধ্যাত্মিকতা বিষয়ক যুক্তি', 'বডি ল্যাঙ্গুয়েজ ও স্লাইড প্রেজেন্টেশন'],
    packingListEn: ['Laptop / Presentation slides', 'Notebook', 'Formal attire'],
    packingListBn: ['ল্যাপটপ / স্লাইড নোট', 'নোটবুক', 'মার্জিত পোশাক'],
    guidelinesEn: ['Prepare a 15-minute mock DYS presentation.'],
    guidelinesBn: ['১৫ মিনিটের একটি মক ডিওয়াইএস প্রেজেন্টেশন প্রস্তুত রাখতে হবে।'],
    coordinatorEn: 'Advaita VOICE Preaching Cell',
    coordinatorBn: 'অদ্বৈত ভয়েস প্রচার সেল',
    schedule: [{ dayTitleEn: 'Day 1-3', dayTitleBn: '১ম-৩য় দিন', timeline: [{ time: '10:00 AM', activityEn: 'Preaching Practicals', activityBn: 'বাস্তব প্রচার মহড়া' }] }]
  },

  // --- THIRD YEAR CAMPS ---
  {
    id: 'camp_ashraya',
    titleEn: 'Ashraya Camp (Formal Spiritual Shelter)',
    titleBn: 'আশ্রয় ক্যাম্প (শ্রীগুরু চরণে আনুষ্ঠানিক আশ্রয়)',
    categoryEn: 'Third Year Camp',
    categoryBn: '৩য় বর্ষ ক্যাম্প',
    locationEn: 'Holy Dham / Central ISKCON Temple',
    locationBn: 'পবিত্র ধাম / কেন্দ্রীয় ইসকন মন্দির',
    durationEn: '3 Days Residential',
    durationBn: '৩ দিনের বিশেষ আবাসিক ক্যাম্প',
    descEn: 'Preparing for and accepting formal spiritual shelter (Ashraya) at the lotus feet of Srila Prabhupada and Sri Guru, committing to eternal service.',
    descBn: 'শ্রীগুরু ও শ্রীল প্রভুপাদের পাদপদ্মে আনুষ্ঠানিক আশ্রয় গ্রহণ ও ভক্তিসাধনায় আজীবন আনুগত্যের পবিত্র ক্যাম্প।',
    visionEn: 'Entering formal guru-shishya relationship and eternal devotional shelter.',
    visionBn: 'শ্রীগুরু-শিষ্য সম্বন্ধ ও শাশ্বত ভক্তি আশ্রয়ে প্রবেশ।',
    highlightsEn: ['Guru-Tattva Intensive Seminar', '10 Offenses to the Holy Name Study', 'Formal Ashraya Yajna & Blessings'],
    highlightsBn: ['গুরুতত্ত্ব বিষয়ক নিবিড় পাঠ', 'দশবিধ নামাপরাধ বর্জন বিধি', 'আনুষ্ঠানিক আশ্রয় যজ্ঞ ও আশীর্বাদ'],
    packingListEn: ['New Vaishnava clothes for ceremony', 'Japa Mala', 'Kanthi Mala'],
    packingListBn: ['অনুষ্ঠানের জন্য নতুন ধুতি-পাঞ্জাবি', 'জপমালা', 'কণ্ঠীমালা'],
    guidelinesEn: ['Fast till noon on ceremony day.'],
    guidelinesBn: ['অনুষ্ঠান দিবসে মধ্যাহ্ন পর্যন্ত উপবাস পালনীয়।'],
    coordinatorEn: 'HG Rasvihari KC Das',
    coordinatorBn: 'শ্রীল রাসবিহারী কেসি দাস',
    schedule: [{ dayTitleEn: 'Day 1-3', dayTitleBn: '১ম-৩য় দিন', timeline: [{ time: '08:00 AM', activityEn: 'Ashraya Ceremony', activityBn: 'আশ্রয় অনুষ্ঠান' }] }]
  },
  {
    id: 'camp_gauranga_sabha',
    titleEn: 'Gauranga Sabha Camp (Sri Chaitanya Katha & Mission)',
    titleBn: 'গৌরাঙ্গ সভা ক্যাম্প (শ্রীচৈতন্য কথা ও সংকীর্তন মিশন)',
    categoryEn: 'Third & Fourth Year Camp',
    categoryBn: '৩য় ও ৪র্থ বর্ষ ক্যাম্প',
    locationEn: 'Advaita VOICE Sanga Hall',
    locationBn: 'অদ্বৈত ভয়েস সঙ্গ সভাগৃহ',
    durationEn: '3 Days Camp',
    durationBn: '৩ দিনের সম্মেলন',
    descEn: "Advanced absorption in Sri Chaitanya Mahaprabhu's pastimes, teachings, and expanding the sankirtana mission in universities.",
    descBn: 'শ্রীচৈতন্য মহাপ্রভুর লীলা, শিক্ষা ও বিশ্ববিদ্যালয়ে সংকীর্তন আন্দোলনের প্রসারে ৩য় ও ৪র্থ বর্ষের ভক্তদের মহাসম্মেলন।',
    visionEn: 'Spreading the sublime mood of Gauranga Mahaprabhu across youth communities.',
    visionBn: 'শ্রীচৈতন্য মহাপ্রভুর প্রেমভক্তির বার্তা তরুণদের মাঝে বিস্তার।',
    highlightsEn: ['Chaitanya Charitamrita Amrita Katha', 'University Preaching Strategic Blueprint', 'Maha Sankirtana Sessions'],
    highlightsBn: ['চৈতন্য চরিতামৃত সুধা আস্বাদন', 'বিশ্ববিদ্যালয় প্রচারের দীর্ঘমেয়াদী কৌশল', 'মহা সংকীর্তন সম্মেলন'],
    packingListEn: ['CC Madhya-lila', 'Japa Mala', 'Vaishnava dress'],
    packingListBn: ['চৈতন্য চরিতামৃত মধ্যলীলা', 'জপমালা', 'পোশাক'],
    guidelinesEn: ['High standard of Vaishnava etiquette.'],
    guidelinesBn: ['উচ্চমানের বৈষ্ণব সদাচার ও মর্যাদা বজায় রাখা।'],
    coordinatorEn: 'Advaita VOICE Executive Council',
    coordinatorBn: 'অদ্বৈত ভয়েস কার্যনির্বাহী পরিষদ',
    schedule: [{ dayTitleEn: 'Day 1-3', dayTitleBn: '১ম-৩য় দিন', timeline: [{ time: '06:00 PM', activityEn: 'Gauranga Katha', activityBn: 'গৌরাঙ্গ কথা ও কীর্তন' }] }]
  },
  {
    id: 'camp_nityananda_sabha',
    titleEn: 'Nityananda Sabha Camp (Compassion & Mercy Outreach)',
    titleBn: 'নিত্যানন্দ সভা ক্যাম্প (পরম করুণা ও পতিতপাবন সেবা)',
    categoryEn: 'Third & Fourth Year Camp',
    categoryBn: '৩য় ও ৪র্থ বর্ষ ক্যাম্প',
    locationEn: 'Advaita VOICE Preaching Base',
    locationBn: 'অদ্বৈত ভয়েস প্রচার ঘাঁটি',
    durationEn: '3 Days Camp',
    durationBn: '৩ দিনের সেবা সম্মেলন',
    descEn: 'Imbibing the boundless compassion of Lord Nityananda to distribute mercy to the most fallen souls and organize massive youth outreach.',
    descBn: 'প্রভু নিত্যানন্দের অপার অহৈতুকী করুণা হৃদয়ে ধারণ করে পতিত মানবকল্যাণে কৃষ্ণনাম বিতরণের বিশেষ প্রশিক্ষণ ও সম্মেলন।',
    visionEn: 'Fostering deep compassion and selfless mood of preacher-servants.',
    visionBn: 'নিঃস্বার্থ সেবাপ্রেম ও করুণার মূর্ত প্রতীক হিসেবে প্রচারক তৈরি।',
    highlightsEn: ['Lord Nityananda Lila & Mercy Study', 'Mass Book Distribution Blitz', 'Street Sankirtan Procession'],
    highlightsBn: ['শ্রীল নিত্যানন্দ প্রভুর করুণা লীলা পাঠ', 'ব্যাপক গ্রন্থ বিতরণ মহড়া', 'নগর সংকীর্তন শোভাযাত্রা'],
    packingListEn: ['Book distribution bag', 'Japa mala'],
    packingListBn: ['গ্রন্থ বিতরণ ব্যাগ', 'জপমালা'],
    guidelinesEn: ['Active participation in street sankirtana.'],
    guidelinesBn: ['নগর সংকীর্তনে স্বতঃস্ফূর্ত অংশগ্রহণ।'],
    coordinatorEn: 'Advaita VOICE Sankirtan Wing',
    coordinatorBn: 'অদ্বৈত ভয়েস সংকীর্তন বিভাগ',
    schedule: [{ dayTitleEn: 'Day 1-3', dayTitleBn: '১ম-৩য় দিন', timeline: [{ time: '02:00 PM', activityEn: 'Mercy Outreach', activityBn: 'প্রচার অভিযান' }] }]
  },

  // --- FOURTH YEAR CAMP ---
  {
    id: 'camp_sharanagati',
    titleEn: 'Sharanagati Camp (Complete Surrender & Diksha Preparation)',
    titleBn: 'শরণাগতি ক্যাম্প (পূর্ণ আত্মসমর্পণ ও হরিনাম দীক্ষা প্রস্তুতি)',
    categoryEn: 'Fourth Year Camp',
    categoryBn: '৪র্থ বর্ষ ক্যাম্প',
    locationEn: 'Sri Mayapur / Sri Vrindavan Holy Dham',
    locationBn: 'শ্রীমায়াপুর / শ্রীবৃন্দাবন ধাম',
    durationEn: '5 Days & 4 Nights (Holy Dham Residential)',
    durationBn: '৫ দিন ৪ রাত (পবিত্র ধামে আবাসিক)',
    descEn: 'The supreme fourth-year milestone camp preparing dedicated senior students for Harinama Diksha, lifetime vows of Vaishnava service, and lifelong dedication.',
    descBn: '৪র্থ বর্ষের শিক্ষার্থীদের জীবনের সর্বোচ্চ মাইলফলক ক্যাম্প, যেখানে হরিনাম দীক্ষার চূড়ান্ত প্রস্তুতি, ৬টি শরণাগতি অঙ্গ অনুশীলন ও আজীবন কৃষ্ণসেবার ব্রত গ্রহণ করা হয়।',
    visionEn: 'Total surrender (Sharanagati) to the lotus feet of Sri Krishna and lifelong mission dedication.',
    visionBn: 'শ্রীকৃষ্ণের চরণে পূর্ণ আত্মসমর্পণ ও আজীবন সেবা-সংকল্প।',
    highlightsEn: [
      'The 6 Limbs of Sharanagati (Bhakti-vinoda Thakura)',
      'Harinama Diksha Examination & Viva Preparation',
      'Holy Dham Parikrama in Mayapur / Vrindavan',
      'Sacred Fire Yajna & Lifetime Devotional Dedication'
    ],
    highlightsBn: [
      'ভক্তিস্তোত্র ও শরণাগতির ৬টি অঙ্গ নিবিড় পাঠ',
      'হরিনাম দীক্ষা পরীক্ষা ও সাক্ষাৎকার প্রস্তুতি',
      'শ্রীমায়াপুর/শ্রীবৃন্দাবন ধাম পরিক্রমা',
      'পবিত্র হোম যজ্ঞ ও আজীবন সেবা সংকল্প'
    ],
    packingListEn: ['Formal Diksha attire', 'Japa mala & Tulasi Kanthi', 'Scriptures'],
    packingListBn: ['দীক্ষার নতুন পোশাক', 'জপমালা ও তুলসী কণ্ঠীমালা', 'শাস্ত্রীয় গ্রন্থ'],
    guidelinesEn: ['Strict observance of all Vaishnava regulative principles in Holy Dham.'],
    guidelinesBn: ['পবিত্র ধামে বৈষ্ণব সদাচার ও ভক্তির নিয়মনীতি কঠোরভাবে পালনীয়।'],
    coordinatorEn: 'HG Rasvihari KC Das & Central Leaders',
    coordinatorBn: 'শ্রীল রাসবিহারী কেসি দাস ও কেন্দ্রীয় নেতৃত্ব',
    schedule: [
      {
        dayTitleEn: 'Day 1-5: Holy Dham Surrender Retreat',
        dayTitleBn: '১ম-৫ম দিন: শ্রীধাম শরণাগতি রিট্রিট ও দীক্ষা যজ্ঞ',
        timeline: [
          { time: '04:30 AM', activityEn: 'Mangalarati in Holy Dham', activityBn: 'শ্রীধামে মঙ্গল আরতি ও পরিক্রমা' },
          { time: '07:30 AM', activityEn: 'Sharanagati Katha & Meditation', activityBn: 'শরণাগতি তত্ত্ব ও জপ সাধনা' },
          { time: '10:00 AM', activityEn: 'Diksha Readiness Seminars', activityBn: 'দীক্ষা প্রস্তুতি সেমিনার' },
          { time: '04:00 PM', activityEn: 'Parikrama to Sacred Tirthas', activityBn: 'পবিত্র তীর্থ পরিক্রমা' }
        ]
      }
    ]
  }
];
