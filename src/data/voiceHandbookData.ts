export interface VoicePillar {
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

export interface VoiceObjective {
  number: number;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

export interface IskconCenterItem {
  name: string;
  address: string;
  phones: string[];
}

export interface IskconDivision {
  divisionNameEn: string;
  divisionNameBn: string;
  centers: IskconCenterItem[];
}

export interface YearProgression {
  yearTitleEn: string;
  yearTitleBn: string;
  courses: string[];
  camps: string[];
}

export interface NightStayEntry {
  monthEn: string;
  monthBn: string;
  servantEn: string;
  servantBn: string;
  managedByEn: string;
  managedByBn: string;
}

export interface DevoteeAdvancementItem {
  en: string;
  bn: string;
}

export interface DevoteeAdvancementStage {
  stageEn: string;
  stageBn: string;
  color: string;
  borderColor: string;
  headerBg: string;
  items: DevoteeAdvancementItem[];
}

export interface VoiceHandbook {
  mottoEn: string;
  mottoBn: string;
  oasisQuoteEn: string;
  oasisQuoteBn: string;
  oasisSourceEn: string;
  oasisSourceBn: string;
  swamiBlessingEn: string;
  swamiBlessingBn: string;
  swamiTitleEn: string;
  swamiTitleBn: string;
  sixPillars: VoicePillar[];
  objectives: VoiceObjective[];
  devoteeAdvancementMatrix: DevoteeAdvancementStage[];
  fourYearMatrix: YearProgression[];
  nightStayFestivals2026: NightStayEntry[];
  iskconDivisions: IskconDivision[];
}

export const VOICE_HANDBOOK_DATA: VoiceHandbook = {
  mottoEn: "Rekindling wisdom, Reviving love.",
  mottoBn: "প্রজ্ঞার পুনরুজ্জীবন, প্রেমের নবজাগরণ।",
  
  oasisQuoteEn: "Our centers are like an oasis in the vast desert. In the desert there is no water, but if by chance someone is fortunate enough to find this oasis, he is saved. The purpose of establishing our ISKCON centers is to rescue those parched, conditioned souls who are searching for the nectar of real life.",
  oasisQuoteBn: "আমাদের কেন্দ্রগুলো হলো বিস্তীর্ণ মরুভূমিতে মরুদ্যানের মতো। মরুভূমিতে কোনো জল নেই, কিন্তু কদাচিৎ যদি কেউ সৌভাগ্যবান হয় সে এই মরুদ্যানের সন্ধান পায়, এতে সে পরিত্রাণ পায়। আমাদের ইসকন কেন্দ্রগুলো নির্মাণের অর্থই হচ্ছে সেইসব শুকিয়ে যাওয়া বদ্ধ জীবদের উদ্ধার করা, যারা অমৃতময় জীবনের খোঁজ করছে।",
  oasisSourceEn: "Srila Prabhupada's Letter to Bhagavan Dasa (18 December 1970)",
  oasisSourceBn: "ভগবান দাসকে শ্রীল প্রভুপাদের পত্র (১৮ ডিসেম্বর ১৯৭০)",

  swamiBlessingEn: "VOICE is a successful preaching wing of International Society for Krishna Consciousness (ISKCON). It is serving the highly educated but frustrated youths by rendering the vision of ancient timeless Vedic Science in a very systematic and attractive way... Radheshyam Prabhu, an engineer of Indian Institute of Technology (IIT) has designed the VOICE curriculum in accordance with the teachings of Srila Prabhupada... I hope you will use your every moment to exploit all these opportunities to reach the summit of Education and Devotion.",
  swamiBlessingBn: "আন্তর্জাতিক কৃষ্ণভাবনামৃত সংঘ (ইসকন)-এর অত্যন্ত সফল যুব প্রচার শাখা হলো ভয়েস (VOICE)। এটি বিশ্ববিদ্যালয় শিক্ষার্থীদের প্রাচীন শাশ্বত বৈদিক বিজ্ঞানের আলোকবর্তিকা দ্বারা আলোকিত করছে... আইআইটি (IIT) স্নাতক প্রকৌশলী শ্রীল রাধেশ্যাম প্রভু শ্রীল প্রভুপাদের শিক্ষার আলোকে এই ভয়েস কারিকুলাম প্রণয়ন করেছেন... আশা করি আপনারা এই অপূর্ব সুযোগকে কাজে লাগিয়ে বিদ্যা ও ভক্তির সর্বোচ্চ শিখরে আরোহণ করবেন।",
  swamiTitleEn: "HH Bhakti Purusottama Swami (GBC, ISKCON • Director, ISKCON Youth Forum IYF Bangladesh)",
  swamiTitleBn: "শ্রীমৎ ভক্তি পুরুষোত্তম স্বামী গুরুমহারাজ (জিবিসি, ইসকন • পরিচালক, ইসকন ইয়ুথ ফোরাম বাংলাদেশ)",

  sixPillars: [
    { titleEn: 'Inspiration', titleBn: 'অনুপ্রেরণা', descEn: 'Awakening pure spiritual aspiration in youth.', descBn: 'তরুণ হৃদয়ে আধ্যাত্মিক উদ্দীপনা সঞ্চার।' },
    { titleEn: 'Culture', titleBn: 'সংস্কৃতি', descEn: 'Reviving timeless Vedic etiquette, music, and arts.', descBn: 'শাশ্বত বৈদিক সদাচার, শিল্প ও সংস্কৃতির পুনর্জাগরণ।' },
    { titleEn: 'Community', titleBn: 'সমাজ ও ভ্রাতৃত্ব', descEn: 'Building loving, supportive ashram brotherhood.', descBn: 'প্রীতিপূর্ণ ও আন্তরিক বৈষ্ণব সমাজ গঠন।' },
    { titleEn: 'Empowerment', titleBn: 'ক্ষমতায়ন', descEn: 'Unlocking hidden talents for the service of God.', descBn: 'ভগবদ্ সেবায় সুপ্ত মেধার সর্বোত্তম বিকাশ।' },
    { titleEn: 'Training', titleBn: 'প্রশিক্ষণ', descEn: 'Rigorous character and leadership development.', descBn: 'চারিত্রিক দৃঢ়তা ও সেবামূলক নেতৃত্ব প্রশিক্ষণ।' },
    { titleEn: 'Education', titleBn: 'শিক্ষা', descEn: 'Systematic Vedic shastra diplomas (DYS to BBS).', descBn: 'ডিওয়াইএস থেকে ভক্তি শাস্ত্রী পর্যন্ত শাস্ত্রীয় পাঠ্যক্রম।' }
  ],

  objectives: [
    {
      number: 1,
      titleEn: "High Character & Competence",
      titleBn: "উচ্চ চরিত্র ও কর্মদক্ষতা সম্পন্ন ব্যক্তিত্ব গঠন",
      descEn: "Creating a class of people of high character and competence.",
      descBn: "সমাজে চারিত্রিক উৎকর্ষ ও বহুমুখী যোগ্যতাসম্পন্ন আদর্শ তরুণ নাগরিক গড়ে তোলা।"
    },
    {
      number: 2,
      titleEn: "Saving Youth from Bad Habits",
      titleBn: "ক্ষতিকর ও আত্মবিধ্বংসী কুভ্যাস থেকে যুবসমাজকে রক্ষা",
      descEn: "Saving teenagers and university students from self-destructive habits and modern vices.",
      descBn: "ডিজিটাল আসক্তি, কুসঙ্গ ও আত্মবিধ্বংসী অভ্যাস থেকে শিক্ষার্থীদের মুক্ত করা।"
    },
    {
      number: 3,
      titleEn: "Communities for Growth & Counseling",
      titleBn: "কাউন্সেলিং ও আত্মউন্নয়নের প্ল্যাটফর্ম তৈরি",
      descEn: "Creating communities for counseling and growth in self-excellence skills as well as spirituality.",
      descBn: "ব্যক্তিগত জীবনের সমস্যা সমাধান, কাউন্সেলিং ও আত্মিক বিকাশের নিরাপদ পরিবেশ সৃষ্টি।"
    },
    {
      number: 4,
      titleEn: "Arts, Music & Media for Wisdom",
      titleBn: "শিল্প, সঙ্গীত ও মিডিয়ার মাধ্যমে সত্য প্রচার",
      descEn: "Use Arts, Culture, Music and Media to propagate the message of Wisdom literatures.",
      descBn: "নাটক, বৈদিক সঙ্গীত ও আধুনিক মাল্টিমিডিয়ার মাধ্যমে শাস্ত্রীয় বাণী প্রচার।"
    },
    {
      number: 5,
      titleEn: "Loving Community Living",
      titleBn: "পারস্পরিক আস্থা ও ভালোবাসার বন্ধন",
      descEn: "Creating a class of people who respect, trust and love each other living as vehicles of wisdom.",
      descBn: "পরস্পরকে শ্রদ্ধা, বিশ্বাস ও প্রীতির দৃষ্টিতে দেখে জ্ঞানের মূর্ত প্রতীক হিসেবে জীবনযাপন।"
    },
    {
      number: 6,
      titleEn: "Talents for Love of God",
      titleBn: "সুপ্ত প্রতিভাকে ভগবদ্ সেবায় নিয়োজন",
      descEn: "Use talents for propagating love of God & love for all, based on Vedic scriptures.",
      descBn: "বিজ্ঞান, সাহিত্য ও প্রযুক্তির প্রতিভাকে মানবকল্যাণ ও কৃষ্ণপ্রেমে কাজে লাগানো।"
    },
    {
      number: 7,
      titleEn: "Subsidized Spiritual Literature",
      titleBn: "সুলভ মূল্যে শাস্ত্রীয় গ্রন্থ বিতরণ",
      descEn: "Distributing Spiritual literature at subsidized prices for mass university outreach.",
      descBn: "শিক্ষার্থীদের সুবিধার্থে স্বল্পমূল্যে শ্রীল প্রভুপাদের প্রামাণিক গ্রন্থ বিতরণ।"
    },
    {
      number: 8,
      titleEn: "Vedic Science & Etiquette Training",
      titleBn: "বৈদিক বিজ্ঞান, সদাচার ও প্রার্থনা প্রশিক্ষণ",
      descEn: "Training in Vedic Science, etiquettes and behavior, prayer and practices in Service of God.",
      descBn: "আধ্যাত্মিক বিজ্ঞান, বৈষ্ণব সদাচার, প্রার্থনা ও ঈশ্বর আরাধনার বাস্তব প্রশিক্ষণ প্রদান।"
    }
  ],


  // Official Devotee's Advancement Curriculum Matrix (ভক্তের উন্নতির পাঠ্যক্রম)
  devoteeAdvancementMatrix: [
    {
      stageEn: "Beginner to 3 Years",
      stageBn: "শুরু থেকে ৩ বছর",
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-400/40",
      headerBg: "bg-amber-600 text-white",
      items: [
        { en: "Small Books (Srila Prabhupada)", bn: "ছোট বই (শ্রীল প্রভুপাদ)" },
        { en: "VOICE Based Activities", bn: "ভয়েস ভিত্তিক কার্যক্রম" },
        { en: "Siddhanta (Philosophical Tenets)", bn: "সিদ্ধান্ত" },
        { en: "Vaishnava Lifestyle & Etiquette", bn: "বৈষ্ণব জীবনধারা" },
        { en: "Personality Development", bn: "ব্যক্তিত্ব উন্নয়ন" }
      ]
    },
    {
      stageEn: "3 to 5 Years",
      stageBn: "৩-৫ বছর",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-400/40",
      headerBg: "bg-blue-600 text-white",
      items: [
        { en: "Big Books (Bhagavad Gita, TLC, NOD)", bn: "বড় বই" },
        { en: "ICFC ISKCON Brahmacari Courses", bn: "ICFC ইস্কনের ব্রহ্মচর্য ভিত্তিক কোর্সসমূহ" },
        { en: "Brahmacarya Ashram Training", bn: "ব্রহ্মচর্য" },
        { en: "Srila Prabhupada Lilamrita Study", bn: "শ্রীল প্রভুপাদ লীলা" },
        { en: "108 Essential Sanskrit Shlokas", bn: "১০৮টি শ্লোক" },
        { en: "Acharya Life & Teachings", bn: "আচার্য" },
        { en: "Gaudiya Vaishnava Sampradaya History", bn: "গৌড়ীয় বৈষ্ণব সম্প্রদায়" }
      ]
    },
    {
      stageEn: "5 to 7 Years",
      stageBn: "৫-৭ বছর",
      color: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-400/40",
      headerBg: "bg-purple-600 text-white",
      items: [
        { en: "Srimad Bhagavatam Cantos Study & Discussion", bn: "শ্রীমদ্ভাগবত বিভাগ এবং আলোচনা" },
        { en: "Engaging Oneself in Preaching Field", bn: "নিজেকে প্রচার কার্যে যুক্ত করা" },
        { en: "Ashram & Event Management", bn: "ব্যবস্থাপনা" },
        { en: "Leadership & Team Mentorship", bn: "নেতৃত্ব" },
        { en: "Deep Japa Meditation (Dhyan)", bn: "ধ্যান" },
        { en: "Mass Book Distribution (Grantha Pracar)", bn: "গ্রন্থ প্রচার" }
      ]
    },
    {
      stageEn: "7+ Years",
      stageBn: "৭ বছর +",
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-400/40",
      headerBg: "bg-emerald-600 text-white",
      items: [
        { en: "Deep Realization: SB, CC & 6 Goswamis", bn: "গভীর/অভ্যন্তরীণ উপলব্ধি: শ্রীমদ্ভাগবত, চৈতন্য চরিতামৃত ও ষড় গোস্বামীদের জীবনধারা" },
        { en: "Glories of Holy Dhama (Holy Places)", bn: "পবিত্র ধাম মাহাত্ম্য" },
        { en: "Internal Devotee Care & Counseling", bn: "অভ্যন্তরীণ যত্নগ্রহণ (কাউন্সেলিং)" },
        { en: "26 Qualities of a Pure Vaishnava", bn: "বৈষ্ণবের ২৬টি গুণ" },
        { en: "Vaishnava Aparadha Insights (3 Stages of Seva)", bn: "বৈষ্ণব অপরাধ বিষয়ে গভীর ধারণা (৩ স্তরে ভক্তিমূলক সেবায়)" }
      ]
    }
  ],

  fourYearMatrix: [
    {
      yearTitleEn: "First Year: Foundation & Awakening",
      yearTitleBn: "১ম বর্ষ: ভিত্তিপ্রস্তর ও আত্মজাগরণ",
      courses: [
        "Discover Yourself (DYS) — 6 Sessions",
        "Spiritual Scientist (SS)",
        "Positive Thinker (PT)",
        "One-Time Preaching Seminars"
      ],
      camps: [
        "Sankalpa Camp (সংকল্প গ্রহণ)",
        "Sphurti Camp (উৎসাহ ও উল্লাস)",
        "Utsaha Camp (উদ্দীপনা)",
        "Utkarsha Camp (উৎকর্ষ)"
      ]
    },
    {
      yearTitleEn: "Second Year: Self-Management & Shastra Habit",
      yearTitleBn: "২য় বর্ষ: সেলফ ম্যানেজমেন্ট ও শাস্ত্রাভ্যাস",
      courses: [
        "Self Manager (SM)",
        "Hearing Srila Prabhupada 100 Lectures Series",
        "DYS Preachers Training Course",
        "Follow up Training Workshop (FTW)"
      ],
      camps: [
        "SRCGD Camp",
        "Nistha Camp (নিষ্ঠা সাধনা)",
        "Facilitator Empowerment Camp (FEC)",
        "Mala Camp (জপ সাধনা)"
      ]
    },
    {
      yearTitleEn: "Third Year: Leadership & Devotional Shelter",
      yearTitleBn: "৩য় বর্ষ: প্রজ্ঞা, নেতৃত্ব ও আশ্রয়",
      courses: [
        "Proactive Leader (PL)",
        "Hearing Srila Prabhupada & Gurumaharaj 100 Lectures",
        "Bhakti Shastri Semester 1 & 2"
      ],
      camps: [
        "Ashraya Camp (শ্রীগুরু চরণে আনুষ্ঠানিক আশ্রয়)",
        "Gauranga Shabha Camp",
        "Nityananda Shabha Camp",
        "Voice Youth Camp"
      ]
    },
    {
      yearTitleEn: "Fourth Year: Surrender, Diksha & Personality Mastery",
      yearTitleBn: "৪র্থ বর্ষ: আত্মসমর্পণ, দীক্ষা ও ব্যক্তিত্ব বিকাশ",
      courses: [
        "Proactive Leader & Campus Mentorship",
        "Personality Development Course",
        "Bhakti Shastri Semester 3 & 4 (Diploma)"
      ],
      camps: [
        "Sharanagati Camp (হরিনাম দীক্ষা ও যজ্ঞ)",
        "Gauranga Shabha Camp",
        "Nityananda Shabha Camp",
        "Prerana Youth Festival"
      ]
    }
  ],

  nightStayFestivals2026: [
    { monthEn: 'January', monthBn: 'জানুয়ারি', servantEn: 'Ramanath Shyam Das & Dr. Ashok Kumar Mandal', servantBn: 'রমানাথ শ্যাম দাস ও ডা. অশোক কুমার মণ্ডল', managedByEn: 'Gauranga VOICE & Nityananda VOICE', managedByBn: 'গৌরাঙ্গ ভয়েস ও নিত্যানন্দ ভয়েস' },
    { monthEn: 'February', monthBn: 'ফেব্রুয়ারি', servantEn: 'Madhumangal Kanai Das & Rajdwip Acharya', servantBn: 'মধুমঙ্গল কানাই দাস ও রাজদ্বীপ আচার্য', managedByEn: 'Suvadra VOICE & Mukunda Dutta VOICE', managedByBn: 'সুভদ্রা ভয়েস ও মুকুন্দ দত্ত ভয়েস' },
    { monthEn: 'March', monthBn: 'মার্চ', servantEn: 'Govinda Kunda Das & Ujjal Dutta', servantBn: 'গোবিন্দ কুন্ড দাস ও উজ্জ্বল দত্ত', managedByEn: 'Dhananjay Pandit VOICE & Giri Govardhan VOICE', managedByBn: 'ধনঞ্জয় পণ্ডিত ভয়েস ও গিরি গোবর্ধন ভয়েস' },
    { monthEn: 'April', monthBn: 'এপ্রিল', servantEn: 'Mitra Pundarik Das & Baladev Vidyabhusan Das', servantBn: 'মিত্র পুণ্ডরীক দাস ও বলদেব বিদ্যাভূষণ দাস', managedByEn: 'Advaita VOICE & Rup Goswami VOICE', managedByBn: 'অদ্বৈত ভয়েস ও রূপ গোস্বামী ভয়েস' },
    { monthEn: 'May', monthBn: 'মে', servantEn: 'Hridoy Ballav Das & Dr. Ashok Kumar Mandal', servantBn: 'হৃদয় বল্লভ দাস ও ডা. অশোক কুমার মণ্ডল', managedByEn: 'Caitanya Sandesh & Nityananda VOICE', managedByBn: 'চৈতন্য সন্দেশ ও নিত্যানন্দ ভয়েস' },
    { monthEn: 'June', monthBn: 'জুন', servantEn: 'Sankirtan Madhav Das & Bablu Deb', servantBn: 'সংকীর্তন মাধব দাস ও বাবলু দেব', managedByEn: 'Mukunda Dutta VOICE & Advaita VOICE', managedByBn: 'মুকুন্দ দত্ত ভয়েস ও অদ্বৈত ভয়েস' },
    { monthEn: 'July', monthBn: 'জুলাই', servantEn: 'Nabakishor Gopesh Das & Prashanta Gopinath Das', servantBn: 'নবকিশোর গোপেশ দাস ও প্রশান্ত গোপীনাথ দাস', managedByEn: 'Giri Govardhan VOICE & Suvadra VOICE', managedByBn: 'গিরি গোবর্ধন ভয়েস ও সুভদ্রা ভয়েস' },
    { monthEn: 'August', monthBn: 'আগস্ট', servantEn: 'Riku Bhoumik & Liton Das (Mohara)', servantBn: 'রিকু ভৌমিক ও লিটন দাস', managedByEn: 'Rup Goswami VOICE & Gauranga VOICE', managedByBn: 'রূপ গোস্বামী ভয়েস ও গৌরাঙ্গ ভয়েস' },
    { monthEn: 'September', monthBn: 'সেপ্টেম্বর', servantEn: 'Chandramohan Das & Sada Sundar Nitai Das', servantBn: 'চন্দ্রমোহন দাস ও সদা সুন্দর নিতাই দাস', managedByEn: 'Advaita VOICE & Dhananjay Pandit VOICE', managedByBn: 'অদ্বৈত ভয়েস ও ধনঞ্জয় পণ্ডিত ভয়েস' },
    { monthEn: 'October', monthBn: 'অক্টোবর', servantEn: 'Suranjit Sikder & Anjan Das', servantBn: 'সুরঞ্জিত শিকদার ও অঞ্জন দাস', managedByEn: 'Nityananda VOICE & Suvadra VOICE', managedByBn: 'নিত্যানন্দ ভয়েস ও সুভদ্রা ভয়েস' },
    { monthEn: 'November', monthBn: 'নভেম্বর', servantEn: 'Murali Mohan Krishna Das & Pran Ballav Das', servantBn: 'মুরলী মোহন কৃষ্ণ দাস ও প্রাণ বল্লভ দাস', managedByEn: 'Caitanya Sandesh & Mukunda Dutta VOICE', managedByBn: 'চৈতন্য সন্দেশ ও মুকুন্দ দত্ত ভয়েস' },
    { monthEn: 'December', monthBn: 'ডিসেম্বর', servantEn: 'Devabrata Das (CU) & Aravinda Nimay Das', servantBn: 'দেবব্রত দাস ও অরবিন্দ নিমাই দাস', managedByEn: 'Giri Govardhan VOICE & Gauranga VOICE', managedByBn: 'গিরি গোবর্ধন ভয়েস ও গৌরাঙ্গ ভয়েস' }
  ],

  iskconDivisions: [
    {
      divisionNameEn: 'Chattogram Division',
      divisionNameBn: 'চট্টগ্রাম বিভাগ',
      centers: [
        { name: 'Sri Sri Radha-Madhav Mandir & Sri Sri Gour Nitai Ashram', address: '23 Nandankanan, Kotwali, Chattogram', phones: ['01815-628851', '01718-312153'] },
        { name: 'Sri Sri Pundarik Dham', address: 'Mekhal, Hathazari, Chattogram', phones: ['01718-312153'] },
        { name: 'Radha Govinda Mandir', address: 'Mohara, Kalurghat, Chattogram', phones: ['01818-097519', '01871-383811'] },
        { name: 'ISKCON Prabartak Srikrishna Mandir', address: 'Panchlaish, Chattogram', phones: ['01812-723200', '01730-059275'] },
        { name: 'Sri Sri Radha Damodar Mandir', address: "Krishnananda Dham Road, Cox's Bazar", phones: ['01720-643264', '01719-324202'] },
        { name: 'Sri Sri Radha Rasbihari Mandir', address: 'Rangapani, Rangamati Hill Tracts', phones: ['01832-879000'] },
        { name: 'Sri Sri Bankubihari Mandir', address: 'Court Road, Khagrachari Bazar', phones: ['01718-735797'] },
        { name: 'Sri Sri Radha-Banshibihari Mandir', address: 'South Sahadev, Feni', phones: ['01716-420953'] }
      ]
    },
    {
      divisionNameEn: 'Dhaka Division',
      divisionNameBn: 'ঢাকা বিভাগ',
      centers: [
        { name: 'ISKCON Swamibag Ashram', address: 'Dhaka-1100', phones: ['01715-001280', '027122747'] },
        { name: 'Sri Sri Radha Govinda Jeu Mandir', address: '8 no. Chandramohan Basak Street, Bangram, Wari, Dhaka-1203', phones: ['01677-317188', '01730-059201'] },
        { name: 'Sri Sri Radha Govinda Mandir', address: 'Sabelia, Madhupur & Tangail', phones: ['01730-059201', '01715-001240'] },
        { name: 'Sri Sri Nrisimha Mandir', address: 'Jiddargonj, Sherpur', phones: ['01723-280457', '01733-208705'] }
      ]
    },
    {
      divisionNameEn: 'Sylhet & North Divisions',
      divisionNameBn: 'সিলেট ও উত্তরাঞ্চল',
      centers: [
        { name: 'Sri Sri Radha Madhav Mandir', address: 'JugalTilla, Kajalshah, Sylhet', phones: ['01711-478190', '01712-164297'] },
        { name: 'Sri Sri Madanmohan Mandir', address: 'Taragonj, Rangpur', phones: ['01718-543679', '01882-545639'] },
        { name: 'Ananda Ashram ISKCON', address: 'Sewijarhi, Palpara, Bogura', phones: ['01712-010927'] }
      ]
    }
  ]
};
