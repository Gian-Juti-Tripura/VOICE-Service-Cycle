export interface PrabhupadaLecture {
  id: string;
  year: 1 | 2 | 3 | 4;
  category: 'BG' | 'SB' | 'CC' | 'NOD_NOI' | 'WALKS' | 'PHILOSOPHY';
  categoryLabelEn: string;
  categoryLabelBn: string;
  titleEn: string;
  titleBn: string;
  dateAndPlace: string;
  verse?: string;
  duration?: string;
  summaryEn: string;
  summaryBn: string;
  youtubeSearchQuery: string;
  vaniUrl: string;
}

export const PRABHUPADA_VANI_DATA: PrabhupadaLecture[] = [
  // --- 1ST YEAR: Fundamentals, BG Ch 1-6, Japa & Four Regulative Principles ---
  {
    id: 'sp_bg_02_13',
    year: 1,
    category: 'BG',
    categoryLabelEn: 'Bhagavad Gita As It Is',
    categoryLabelBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ',
    titleEn: 'Bhagavad-gita 2.13 — Transmigration of the Soul & Real Identity',
    titleBn: 'শ্রীমদ্ভগবদ্গীতা ২.১৩ — আত্মার রূপান্তর ও প্রকৃত স্বরূপ',
    dateAndPlace: 'London, 19 August 1973',
    verse: 'BG 2.13',
    duration: '42 mins',
    summaryEn: 'Srila Prabhupada explains the eternal nature of the spirit soul changing bodies from childhood to youth to old age.',
    summaryBn: 'শ্রীল প্রভুপাদ দেহান্তর ও আত্মার শাশ্বত স্বরূপ অত্যন্ত প্রাঞ্জল ভাষায় ব্যাখ্যা করেন।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Bhagavad Gita 2.13 London 1973',
    vaniUrl: 'https://prabhupadavani.org/transcriptions/730819bg-london/'
  },
  {
    id: 'sp_bg_02_20',
    year: 1,
    category: 'BG',
    categoryLabelEn: 'Bhagavad Gita As It Is',
    categoryLabelBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ',
    titleEn: 'Bhagavad-gita 2.20 — The Soul is Never Born and Never Dies',
    titleBn: 'শ্রীমদ্ভগবদ্গীতা ২.২০ — আত্মার জন্ম ও মৃত্যু নেই',
    dateAndPlace: 'Hyderabad, 25 November 1972',
    verse: 'BG 2.20',
    duration: '48 mins',
    summaryEn: 'Detailed scientific analysis of consciousness as the symptom of the soul in the heart.',
    summaryBn: 'হৃদয়ে আত্মার উপস্থিতি ও চেতনার বিজ্ঞানভিত্তিক বিশ্লেষণ।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Bhagavad Gita 2.20 Hyderabad 1972',
    vaniUrl: 'https://prabhupadavani.org/transcriptions/721125bg-hyderabad/'
  },
  {
    id: 'sp_bg_04_09',
    year: 1,
    category: 'BG',
    categoryLabelEn: 'Bhagavad Gita As It Is',
    categoryLabelBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ',
    titleEn: 'Bhagavad-gita 4.9 — Understanding the Divine Nature of Krishna',
    titleBn: 'শ্রীমদ্ভগবদ্গীতা ৪.৯ — শ্রীকৃষ্ণের দিব্য জন্ম ও কর্মের জ্ঞান',
    dateAndPlace: 'Bombay, 29 March 1974',
    verse: 'BG 4.9',
    duration: '52 mins',
    summaryEn: 'One who understands the transcendental appearance and activities of Krishna never takes birth again in the material world.',
    summaryBn: 'ভগবানের দিব্য জন্ম ও কর্মতত্ত্ব উপলব্ধি করলে আর জড় জগতে পুনর্জন্ম হয় না।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Bhagavad Gita 4.9 Bombay 1974',
    vaniUrl: 'https://prabhupadavani.org/transcriptions/740329bg-bombay/'
  },
  {
    id: 'sp_japa_meditation',
    year: 1,
    category: 'PHILOSOPHY',
    categoryLabelEn: 'Japa & Science of Chanting',
    categoryLabelBn: 'জপ সাধনা ও হরিনাম বিজ্ঞান',
    titleEn: 'The Science of Chanting the Hare Krishna Maha-Mantra',
    titleBn: 'শ্রীহরেকৃষ্ণ মহামন্ত্র জপের বৈজ্ঞানিক মহিমা ও নিয়মাবলী',
    dateAndPlace: 'New York, 1966',
    duration: '35 mins',
    summaryEn: 'Srila Prabhupada establishes the sublime method for reviving our transcendental consciousness through attentive chanting.',
    summaryBn: 'মনোযোগ সহকারে ষোল মালা জপের মাধ্যমে ভগবৎ চেতনা জাগ্রত করার সার্বজনীন পদ্ধতি।',
    youtubeSearchQuery: 'Srila Prabhupada on chanting Hare Krishna attentively Japa meditation',
    vaniUrl: 'https://prabhupadavani.org/'
  },

  // --- 2ND YEAR: BG Ch 7-12, Nectar of Instruction, Nectar of Devotion Part 1, Sri Isopanisad ---
  {
    id: 'sp_bg_07_01',
    year: 2,
    category: 'BG',
    categoryLabelEn: 'Bhagavad Gita As It Is',
    categoryLabelBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ',
    titleEn: 'Bhagavad-gita 7.1 — Knowledge of the Absolute & Hearing Submissively',
    titleBn: 'শ্রীমদ্ভগবদ্গীতা ৭.১ — পরমেশ্বর শ্রীকৃষ্ণকে পূর্ণরূপে জানার বিজ্ঞান',
    dateAndPlace: 'Bombay, 11 January 1973',
    verse: 'BG 7.1',
    duration: '46 mins',
    summaryEn: 'Srila Prabhupada explains the significance of asakti (attachment) to Krishna through constant hearing.',
    summaryBn: 'ভগবানের প্রতি আসক্তি বৃদ্ধির উপায় ও ভক্তিশ্রবণের গুরুত্ব।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Bhagavad Gita 7.1 Bombay 1973',
    vaniUrl: 'https://prabhupadavani.org/transcriptions/730111bg-bombay/'
  },
  {
    id: 'sp_noi_01',
    year: 2,
    category: 'NOD_NOI',
    categoryLabelEn: 'Nectar of Instruction (Upadesamrita)',
    categoryLabelBn: 'উপদেশামৃত ও ভক্তিরসামৃতসিন্ধু',
    titleEn: 'Nectar of Instruction Verse 1 — Controlling the Six Urges (Vaco Vegam)',
    titleBn: 'উপদেশামৃত শ্লোক ১ — বাক্যের বেগ ও ছয়টি রিপুর বেগ নিয়ন্ত্রণ',
    dateAndPlace: 'Vrindavan, 23 October 1975',
    verse: 'NOI Text 1',
    duration: '44 mins',
    summaryEn: 'Srila Prabhupada teaches the symptoms of a goswami who can tolerate the urges of speech, mind, anger, tongue, belly, and genitals.',
    summaryBn: 'ষড়বেগের নিয়ন্ত্রণ এবং গোস্বামী হওয়ার যোগ্যতা সংক্রান্ত দিব্য প্রবচন।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Nectar of Instruction Verse 1 Vrindavan 1975',
    vaniUrl: 'https://prabhupadavani.org/transcriptions/751023noi-vrindavan/'
  },
  {
    id: 'sp_noi_02_03',
    year: 2,
    category: 'NOD_NOI',
    categoryLabelEn: 'Nectar of Instruction (Upadesamrita)',
    categoryLabelBn: 'উপদেশামৃত ও ভক্তিরসামৃতসিন্ধু',
    titleEn: 'Nectar of Instruction Verse 2 & 3 — Obstacles and Boosters of Bhakti',
    titleBn: 'উপদেশামৃত শ্লোক ২ ও ৩ — ভক্তি বিনষ্টকারী ও ভক্তি বৃদ্ধিকারী ছয়টি নীতি',
    dateAndPlace: 'Vrindavan, 24 October 1975',
    verse: 'NOI Text 2-3',
    duration: '50 mins',
    summaryEn: 'Analyzing Atyahara, Prayasa, Prajalpa, Niyamagraha, and Utsaha, Niscaya, Dhairya in devotional service.',
    summaryBn: 'অত্যাহার, প্রয়াস, প্রজল্গ এবং উৎসাহ, নিশ্চয়, ধৈর্যের বিশদ আধ্যাত্মিক তাৎপর্য।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Nectar of Instruction Verse 2 and 3 Vrindavan',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_iso_01',
    year: 2,
    category: 'PHILOSOPHY',
    categoryLabelEn: 'Sri Isopanisad',
    categoryLabelBn: 'শ্রীঈশোপনিষদ',
    titleEn: 'Sri Isopanisad Mantra 1 — Everything Belongs to the Supreme Lord (Isavasyam)',
    titleBn: 'শ্রীঈশোপনিষদ মন্ত্র ১ — জগৎ ঈশ্বরের সম্পত্তি ও ত্যাগের নীতি',
    dateAndPlace: 'Los Angeles, 26 April 1970',
    verse: 'Isopanisad 1',
    duration: '45 mins',
    summaryEn: 'Universal formula for peace and harmony: accepting only ones quota while recognizing Krishna as the supreme proprietor.',
    summaryBn: 'ভগবানই নিখিল বিশ্বের পরম মালিক এবং প্রত্যেকের নির্ধারিত অংশ গ্রহণের বিধান।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Sri Isopanisad Mantra 1 Los Angeles 1970',
    vaniUrl: 'https://prabhupadavani.org/'
  },

  // --- 3RD YEAR: BG Ch 13-18, Nectar of Devotion Part 2, SB Canto 1 (Kunti & Bhishma Prayers) ---
  {
    id: 'sp_bg_18_66',
    year: 3,
    category: 'BG',
    categoryLabelEn: 'Bhagavad Gita As It Is',
    categoryLabelBn: 'শ্রীমদ্ভগবদ্গীতা যথার্থ',
    titleEn: 'Bhagavad-gita 18.66 — Complete Surrender to Sri Krishna (Sarva-Dharman)',
    titleBn: 'শ্রীমদ্ভগবদ্গীতা ১৮.৬৬ — সর্বধর্ম পরিত্যাগ করে শ্রীকৃষ্ণের শ্রীপাদপদ্মে শরণাগতি',
    dateAndPlace: 'Los Angeles, 25 November 1968',
    verse: 'BG 18.66',
    duration: '55 mins',
    summaryEn: 'The ultimate conclusion of Bhagavad-gita: full surrender to Krishna, abandoning all varieties of speculative religion.',
    summaryBn: 'গীতার চূড়ান্ত উপসংহার: সকল মনগড়া মতবাদ ত্যাগ করে একমাত্র শ্রীকৃষ্ণের চরণে শরণাগতি।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Bhagavad Gita 18.66 Sarva dharman parityajya',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_sb_01_08_18',
    year: 3,
    category: 'SB',
    categoryLabelEn: 'Srimad Bhagavatam Canto 1',
    categoryLabelBn: 'শ্রীমদ্ভাগবতম ১ম স্কন্ধ (কুন্তীদেবীর প্রার্থনা)',
    titleEn: 'Srimad-Bhagavatam 1.8.18 — Prayers of Queen Kunti (The Shelter of the Lord)',
    titleBn: 'শ্রীমদ্ভাগবতম ১.৮.১৮ — মহারাণী কুন্তীদেবীর পরম স্তুতি ও শরণাগতি',
    dateAndPlace: 'Mayapur, 28 September 1974',
    verse: 'SB 1.8.18',
    duration: '48 mins',
    summaryEn: 'Queen Kunti glorifies Krishna as Adhoksaja, beyond the perception of mundane material senses.',
    summaryBn: 'মহারাণী কুন্তী ভগবান শ্রীকৃষ্ণকে ইন্দ্রিয়াতীত ও শরণাগতবৎসলেরূপে মহিমান্বিত করেছেন।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Prayers of Queen Kunti Srimad Bhagavatam 1.8.18',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_sb_01_09_22',
    year: 3,
    category: 'SB',
    categoryLabelEn: 'Srimad Bhagavatam Canto 1',
    categoryLabelBn: 'শ্রীমদ্ভাগবতম ১ম স্কন্ধ (ভীষ্মদেবের প্রার্থনা)',
    titleEn: 'Srimad-Bhagavatam 1.9.22 — The Passing Away of Bhishmadeva',
    titleBn: 'শ্রীমদ্ভাগবতম ১.৯.২২ — পিতামহ ভীষ্মদেবের অপ্রকট ও দিব্য প্রার্থনা',
    dateAndPlace: 'Mayapur, 15 October 1974',
    verse: 'SB 1.9.22',
    duration: '50 mins',
    summaryEn: 'Bhishmadeva fixes his mind completely on Krishna at the time of death on the bed of arrows.',
    summaryBn: 'শরশয্যায় পিতামহ ভীষ্মের মৃত্যুকালে ভগবান শ্রীকৃষ্ণের শ্রীমুখে দৃষ্টি নিবদ্ধ করার অনুপম মহিমা।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Srimad Bhagavatam 1.9.22 Bhishmadeva',
    vaniUrl: 'https://prabhupadavani.org/'
  },

  // --- 4TH YEAR: Advanced Srimad Bhagavatam, Caitanya Caritamrta, Preaching Boldness & Leadership ---
  {
    id: 'sp_cc_adi_01_01',
    year: 4,
    category: 'CC',
    categoryLabelEn: 'Sri Caitanya Caritamrta',
    categoryLabelBn: 'শ্রীচৈতন্য চরিতামৃত',
    titleEn: 'Sri Caitanya-caritamrta Adi-lila 1.1 — The Glories of Lord Chaitanya & Nityananda',
    titleBn: 'শ্রীচৈতন্য চরিতামৃত আদি-লীলা ১.১ — শ্রীগৌর-নিত্যানন্দের যুগল আবির্ভাব ও কৃপা',
    dateAndPlace: 'Mayapur, 25 March 1975',
    verse: 'CC Adi 1.1',
    duration: '58 mins',
    summaryEn: 'Lord Caitanya and Lord Nityananda simultaneously appear to dispel the darkness of ignorance in Kali-yuga through Harinama.',
    summaryBn: 'কলির অন্ধকার বিনাশে সূর্য ও চন্দ্রের ন্যায় শ্রীচৈতন্য ও শ্রীনিত্যানন্দের যুগল প্রকাশ।',
    youtubeSearchQuery: 'Srila Prabhupada lecture Sri Caitanya Caritamrta Adi lila 1.1 Mayapur',
    vaniUrl: 'https://prabhupadavani.org/'
  },
  {
    id: 'sp_morning_walk_leadership',
    year: 4,
    category: 'WALKS',
    categoryLabelEn: 'Morning Walks & Conversations',
    categoryLabelBn: 'মর্নিং ওয়াক ও পারমার্থিক নেতৃত্ব',
    titleEn: 'Morning Walk on Pure Devotion, Leadership & Defeating Materialism',
    titleBn: 'প্রাতঃভ্রমণে শ্রীল প্রভুপাদের নির্দেশ: জড়বাদ খণ্ডন ও প্রচারকের আদর্শ নেতৃত্ব',
    dateAndPlace: 'Los Angeles, 10 December 1973',
    duration: '40 mins',
    summaryEn: 'Srila Prabhupada challenges Darwinian evolution, materialistic science, and gives blueprints for youth preaching.',
    summaryBn: 'ডারউইনের বিবর্তনবাদ খণ্ডন ও যুবকদের বৈদিক বিজ্ঞানে সুশিক্ষিত করার বাস্তব কৌশল।',
    youtubeSearchQuery: 'Srila Prabhupada Morning Walk Los Angeles December 1973',
    vaniUrl: 'https://prabhupadavani.org/'
  }
];
