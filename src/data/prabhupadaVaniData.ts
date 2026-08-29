export interface PrabhupadaLecture {
  id: string;
  serialNumber: number;
  semester: string;
  year: 1 | 2 | 3 | 4;
  category: 'BG' | 'SB' | 'CC' | 'NOD_NOI' | 'WALKS' | 'PHILOSOPHY';
  categoryLabelEn: string;
  categoryLabelBn: string;
  titleEn: string;
  titleBn: string;
  dateAndPlace: string;
  verse?: string;
  duration?: string;
  tapeCode: string;
  summaryEn: string;
  summaryBn: string;
  youtubeSearchQuery: string;
  vaniUrl: string;
}

export const PRABHUPADA_VANI_DATA: PrabhupadaLecture[] = [
  // ===================== MORNING PROGRAM SERIES (EXACT SYLLABUS BOOK ORDER) =====================
  {
    id: 'sp_mp_01',
    serialNumber: 1,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 1.1.1',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ১ম স্কন্ধ ১.১',
    titleEn: "1. SB 1.1.1 — Increasing Your Problems",
    titleBn: "১. শ্রীমদ্ভাগবতম ১.১.১ — জড়জগতের সমস্যা বৃদ্ধি বনাম স্থায়ী সমাধান",
    tapeCode: '1 SB 1.1.1_Increasing Your Problems_20feb75_CA',
    dateAndPlace: "Caracas, 20 Feb 1975",
    verse: 'SB 1.1.1',
    duration: '42 mins',
    summaryEn: "Srila Prabhupada explains the primeval cause of all causes and how material solutions only multiply suffering.",
    summaryBn: "সকল কারণের পরম কারণ শ্রীকৃষ্ণের অনুসন্ধান না করলে জড় সমস্যা কেবল বাড়তেই থাকে।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 1.1.1 Increasing Your Problems Caracas 1975',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_02',
    serialNumber: 2,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 1.1.1',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ১ম স্কন্ধ ১.১',
    titleEn: "2. SB 1.1.1 — Car Is Ford, But Ford Is Not the Car",
    titleBn: "২. শ্রীমদ্ভাগবতম ১.১.১ — গাড়ি ফোর্ড হলেও ফোর্ড স্বয়ং গাড়ি নয় (অচিন্ত্যভেদাভেদ)",
    tapeCode: '2 SB 1.1.1_Car Is Ford--Ford Is Not Car_21feb75_CA',
    dateAndPlace: "Caracas, 21 Feb 1975",
    verse: 'SB 1.1.1',
    duration: '45 mins',
    summaryEn: "Simultaneous oneness and difference between the energetic Supreme Lord and His cosmic energy.",
    summaryBn: "শ্রীচৈতন্যের অচিন্ত্যভেদাভেদ তত্ত্ব: সৃষ্টি ভগবানের শক্তি হলেও সৃষ্টি স্বয়ং পরমেশ্বর নয়।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 1.1.1 Car Is Ford Ford Is Not Car Caracas',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_03',
    serialNumber: 3,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 1.1.2',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ১ম স্কন্ধ ১.২',
    titleEn: "3. SB 1.1.2 — Dependent on Krishna's Mercy",
    titleBn: "৩. শ্রীমদ্ভাগবতম ১.১.২ — শ্রীকৃষ্ণের অহৈতুকী কৃপার ওপর পূর্ণ নির্ভরতা",
    tapeCode: '3 SB 1.1.2_Dependent On Krishnas Mercy_23feb75_CA',
    dateAndPlace: "Caracas, 23 Feb 1975",
    verse: 'SB 1.1.2',
    duration: '48 mins',
    summaryEn: "Establishing Dharma-projjhita-kaitavah: casting away all cheating religions for pure surrender.",
    summaryBn: "কৈতবধর্ম বর্জন করে শ্রীকৃষ্ণের কৃপার ওপর শরণাগত হওয়ার পরম বৈষ্ণব সিদ্ধান্ত।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 1.1.2 Dependent On Krishnas Mercy Caracas',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_04',
    serialNumber: 4,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 1.2.26',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ১ম স্কন্ধ ২.২৬',
    titleEn: "4. SB 1.2.26 — People Are Being Killed in Ignorance",
    titleBn: "৪. শ্রীমদ্ভাগবতম ১.২.২৬ — অজ্ঞানতার অন্ধকারে মানবাত্মার পতন ও উদ্ধার",
    tapeCode: 'SB 1.2.26_People Are Being Killed_06nov72_VV',
    dateAndPlace: "Vrindavan, 06 Nov 1972",
    verse: 'SB 1.2.26',
    duration: '50 mins',
    summaryEn: "Worship of the Supreme Personality of Godhead Mukunda versus temporary demigod worship.",
    summaryBn: "মুমুক্ষু সাধকদের পরমেশ্বর শ্রীহরির ভজন ও দেবদেবী পূজার অনিত্যতা।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 1.2.26 People Are Being Killed Vrindavan 1972',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_05',
    serialNumber: 5,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 1.8.28',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ১ম স্কন্ধ ৮.২৮',
    titleEn: "5. SB 1.8.28 — Don't Be a \"Skin Observer\" (Queen Kunti)",
    titleBn: "৫. শ্রীমদ্ভাগবতম ১.৮.২৮ — চর্মচক্ষুর দৃষ্টি ত্যাগ ও ভগবানের নিরপেক্ষতা দর্শন",
    tapeCode: 'SB 1.8.28_Dont Be A Skin Observer_08oct74_MA',
    dateAndPlace: "Mayapur, 08 Oct 1974",
    verse: 'SB 1.8.28',
    duration: '52 mins',
    summaryEn: "Queen Kunti reveals how Lord Krishna is equal to everyone like the sun, yet partial to His devotees.",
    summaryBn: "মহারাণী কুন্তীর দিব্য প্রার্থনা: ভগবান সূর্যের মতো সর্বসম হলেও ভক্তবৎসল।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 1.8.28 Dont Be A Skin Observer Mayapur 1974',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_06',
    serialNumber: 6,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 6.1.1',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ৬ষ্ঠ স্কন্ধ ১.১',
    titleEn: "6. SB 6.1.1 — What to Do About Death",
    titleBn: "৬. শ্রীমদ্ভাগবতম ৬.১.১ — অনিবার্য মৃত্যুর সম্মুখীন হওয়ার প্রস্তুতি",
    tapeCode: 'SB 6.1.1_What To Do About Death_07may75_ME',
    dateAndPlace: "Melbourne, 07 May 1975",
    verse: 'SB 6.1.1',
    duration: '46 mins',
    summaryEn: "Maharaja Pariksit asks Sukadeva Goswami how conditioned souls can be saved from hellish planets.",
    summaryBn: "নরক যন্ত্রণা থেকে মুক্তি ও মৃত্যুকালে ভগবানকে স্মরণ করার উপায়।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 6.1.1 What To Do About Death Melbourne',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_07',
    serialNumber: 7,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 6.1.10',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ৬ষ্ঠ স্কন্ধ ১.১০',
    titleEn: "7. SB 6.1.10 — No Heart Free of Dirt Unless Pure Bhakti",
    titleBn: "৭. শ্রীমদ্ভাগবতম ৬.১.১০ — শুদ্ধভক্তি ব্যতীত অন্তরের অনর্থ দূর হয় না",
    tapeCode: 'SB 6.1.10_No Heart Free Of Dirt Unless..._23jun75_LA',
    dateAndPlace: "Los Angeles, 23 Jun 1975",
    verse: 'SB 6.1.10',
    duration: '44 mins',
    summaryEn: "Atonement (Prayascitta) like an elephants bath is useless without complete surrender to Krishna.",
    summaryBn: "হস্তিস্নানের ন্যায় নিষ্ফল প্রায়শ্চিত্ত ত্যাগ করে শুদ্ধ কৃষ্ণভক্তি গ্রহণের আবশ্যকতা।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 6.1.10 No Heart Free Of Dirt Los Angeles',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_08',
    serialNumber: 8,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 6.1.11',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ৬ষ্ঠ স্কন্ধ ১.১১',
    titleEn: "8. SB 6.1.11 — Real Reform School for the Soul",
    titleBn: "৮. শ্রীমদ্ভাগবতম ৬.১.১১ — আত্মার যথার্থ সংশোধনাগার ও চেতনা রূপান্তর",
    tapeCode: 'SB 6.1.11_Real Reform School_12may76_HO',
    dateAndPlace: "Honolulu, 12 May 1976",
    verse: 'SB 6.1.11',
    duration: '47 mins',
    summaryEn: "How true education and ashram training permanently uproots sinful desires (Bija).",
    summaryBn: "পাপবীজ সমূলে বিনাশ করে আত্মাকে চিরতরে মুক্ত করার বৈদিক শিক্ষা ব্যবস্থা।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 6.1.11 Real Reform School Honolulu',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_09',
    serialNumber: 9,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 6.1.15',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ৬ষ্ঠ স্কন্ধ ১.১৫',
    titleEn: "9. SB 6.1.15 — Liberation by Pure Understanding",
    titleBn: "৯. শ্রীমদ্ভাগবতম ৬.১.১৫ — পারমার্থিক তত্ত্বজ্ঞান ও মায়ামুক্তির পথ",
    tapeCode: 'SB 6.1.15_Liberation By Pure Understanding_08jan76_NE',
    dateAndPlace: "Nellore, 08 Jan 1976",
    verse: 'SB 6.1.15',
    duration: '50 mins',
    summaryEn: "Just as dried grass is burned by blazing fire, so all sinful reactions are burned by devotion to Krishna.",
    summaryBn: "দাবানল যেমন শুকনো ঘাস পুড়িয়ে ছাই করে, ভক্তি তেমনি কোটি জন্মের পাপ ভস্মীভূত করে।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 6.1.15 Liberation By Pure Understanding',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_mp_10',
    serialNumber: 10,
    semester: 'Third Semester',
    year: 2,
    category: 'SB',
    categoryLabelEn: 'Morning Program: SB 6.1.16',
    categoryLabelBn: 'মর্নিং প্রোগ্রাম: ৬ষ্ঠ স্কন্ধ ১.১৬',
    titleEn: "10. SB 6.1.16 — Mercy of Spiritual Master & Pure Self-Satisfaction",
    titleBn: "১০. শ্রীমদ্ভাগবতম ৬.১.১৬ — শ্রীগুরুদেবের কৃপা ও আত্মতুষ্টি",
    tapeCode: 'SB 6.1.16_Mercy Of Spiritual Master_16may76_HO',
    dateAndPlace: "Honolulu, 16 May 1976",
    verse: 'SB 6.1.16',
    duration: '48 mins',
    summaryEn: "Yamuna water and pure surrender: attaining the shelter of pure devotees of the Lord.",
    summaryBn: "শ্রীগুরুর পদাশ্রয়ে থেকে আত্মতুষ্টি লাভ এবং যমরাজের দূতদের ভয় থেকে চিরতরে মুক্তি।",
    youtubeSearchQuery: 'Srila Prabhupada lecture SB 6.1.16 Mercy Of Spiritual Master Honolulu',
    vaniUrl: 'https://prabhupadavani.org/'
  }
];
