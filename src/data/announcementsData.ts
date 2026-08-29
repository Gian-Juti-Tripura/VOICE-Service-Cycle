export interface ManagerAnnouncement {
  id: string;
  roleKey: 'INTERNAL_MGR' | 'SECURITY_MGR' | 'COORDINATOR' | 'MORNING_PROG' | 'STUDY_CARE' | 'KITCHEN_MGR';
  roleTitleEn: string;
  roleTitleBn: string;
  inchargeNameEn: string;
  inchargeNameBn: string;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  date: string;
  actionRequiredEn?: string;
  actionRequiredBn?: string;
}

export interface UpcomingFestival {
  id: string;
  nameEn: string;
  nameBn: string;
  dateEn: string;
  dateBn: string;
  month: number; // 1-12
  day: number;
  fastingEn: string;
  fastingBn: string;
  descEn: string;
  descBn: string;
  featured?: boolean;
}

export const UPCOMING_FESTIVALS_2026: UpcomingFestival[] = [
  {
    id: 'f1',
    nameEn: 'Sri Nityananda Trayodasi',
    nameBn: 'শ্রী শ্রী নিত্যানন্দ ত্রয়োদশী (আবির্ভাব মহোৎসব)',
    dateEn: '31 January 2026',
    dateBn: '৩১ জানুয়ারি ২০২৬',
    month: 1,
    day: 31,
    fastingEn: 'Fasting till noon (১২:০০ পর্যন্ত উপবাস)',
    fastingBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও মহা অভিষেক',
    descEn: 'Appearance day of Lord Nityananda Prabhu, the original spiritual master and reservoir of mercy.',
    descBn: 'পরম দয়ালু পরমেশ্বর ভগবান শ্রী শ্রী নিত্যানন্দ প্রভুর দিব্য আবির্ভাব তিথি।',
    featured: true
  },
  {
    id: 'f2',
    nameEn: 'Sri Gaura Purnima (540th Gaurabda)',
    nameBn: 'শ্রী গৌর পূর্ণিমা (শ্রীচৈতন্য মহাপ্রভুর আবির্ভাব)',
    dateEn: '3 March 2026',
    dateBn: '৩ মার্চ ২০২৬',
    month: 3,
    day: 3,
    fastingEn: 'Fasting till moonrise (চন্দ্রোদয় পর্যন্ত উপবাস)',
    fastingBn: 'সন্ধ্যায় চন্দ্রোদয় পর্যন্ত পূর্ণ উপবাস ও অনুকল্প প্রসাদ',
    descEn: 'Appearance day of Sri Chaitanya Mahaprabhu, the golden avatar who inaugurated the Sankirtana movement.',
    descBn: 'যুগাবতার পরম করুণাময় শ্রী শ্রীচৈতন্য মহাপ্রভুর পরম পবিত্র আবির্ভাব মহোৎসব।',
    featured: true
  },
  {
    id: 'f3',
    nameEn: 'Sri Rama Navami',
    nameBn: 'শ্রী রাম নবমী (মর্যাদা পুরুষোত্তম রামচন্দ্রের আবির্ভাব)',
    dateEn: '27 March 2026',
    dateBn: '২৭ মার্চ ২০২৬',
    month: 3,
    day: 27,
    fastingEn: 'Fasting till sunset (সূর্যাস্ত পর্যন্ত উপবাস)',
    fastingBn: 'সূর্যাস্ত পর্যন্ত উপবাস ও শ্রী রামকথা শ্রবণ',
    descEn: 'Appearance day of Lord Ramachandra, the ideal king and upholder of dharma.',
    descBn: 'পরমেশ্বর ভগবান শ্রী রামচন্দ্রের আবির্ভাব তিথি মহোৎসব।',
    featured: true
  },
  {
    id: 'f4',
    nameEn: 'Sri Nrsimha Caturdasi',
    nameBn: 'শ্রী নৃসিংহ চতুর্দশী (ভক্তবৎসল নৃসিংহদেবের আবির্ভাব)',
    dateEn: '30 April 2026',
    dateBn: '৩০ এপ্রিল ২০২৬',
    month: 4,
    day: 30,
    fastingEn: 'Fasting till dusk (সন্ধ্যা পর্যন্ত উপবাস)',
    fastingBn: 'সন্ধ্যা পর্যন্ত উপবাস ও নৃসিংহ কবচ পাঠ',
    descEn: 'Appearance of Lord Nrsimhadeva to protect His pure devotee Prahlada Maharaja.',
    descBn: 'ভক্ত প্রহ্লাদকে রক্ষার জন্য ভগবান শ্রীনৃসিংহদেবের শুভাগমন তিথি।',
    featured: false
  },
  {
    id: 'f5',
    nameEn: 'Sri Jagannath Snan Yatra',
    nameBn: 'শ্রী জগন্নাথ দেবের স্নানযাত্রা মহোৎসব',
    dateEn: '29 June 2026',
    dateBn: '২৯ জুন ২০২৬',
    month: 6,
    day: 29,
    fastingEn: 'Regular prasadam after mahabhisheka',
    fastingBn: '১০৮ কলস জল ও সুগন্ধি দুধে স্নান দর্শন',
    descEn: 'Lord Jagannath, Baladeva, and Subhadra Maharani bathed with 108 fragrant water jugs.',
    descBn: 'জগন্নাথ দেবের ১০৮ ঘট সুগন্ধি জলে দিব্য স্নানযাত্রা ও অনবসর কালের সূচনা।'
  },
  {
    id: 'f6',
    nameEn: 'Sri Jagannath Ratha Yatra (Grand Chariot Festival)',
    nameBn: 'শ্রী জগন্নাথ দেবের রথযাত্রা মহোৎসব',
    dateEn: '16 July 2026',
    dateBn: '১৬ জুলাই ২০২৬',
    month: 7,
    day: 16,
    fastingEn: 'Grand Festival Feast & Prasad Distribution',
    fastingBn: 'রথ টানা, নগর পরিক্রমা ও মহাপ্রসাদ বিতরণ',
    descEn: 'Grand procession pulling the divine chariots of Lord Jagannath, Baladeva, and Subhadra to Gundicha Mandir.',
    descBn: 'জগন্নাথ, বলদেব ও সুভদ্রা মহারানীর শ্রীমন্দির থেকে গুণ্ডিচায় দিব্য রথ পরিক্রমা।'
  },
  {
    id: 'f7',
    nameEn: 'Sri Jhulan Yatra',
    nameBn: 'শ্রী ঝুলনযাত্রা মহোৎসব (৫ দিনব্যাপী)',
    dateEn: '23 August 2026',
    dateBn: '২৩ আগস্ট ২০২৬',
    month: 8,
    day: 23,
    fastingEn: 'Pavilion Swing Seva & Kirtan',
    fastingBn: 'শ্রী শ্রী রাধাকৃষ্ণের মনোরম ঝুলন সেবা ও সংকীর্তন',
    descEn: 'Five-day swinging festival of Sri Sri Radha Madhava with devotional songs.',
    descBn: 'রাধাকৃষ্ণের দিব্য ঝুলন লীলা ও ভক্তদের স্বহস্তে দোলা সেবা।'
  },
  {
    id: 'f8',
    nameEn: 'Sri Balarama Jayanti',
    nameBn: 'শ্রী বলরাম জয়ন্তী (শ্রী বলদেব প্রভুর আবির্ভাব)',
    dateEn: '28 August 2026',
    dateBn: '২৮ আগস্ট ২০২৬',
    month: 8,
    day: 28,
    fastingEn: 'Fasting till noon (১২:০০ পর্যন্ত উপবাস)',
    fastingBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও শ্রী বলরাম অভিষেক',
    descEn: 'Appearance day of Lord Balarama, the original spiritual strength and source of all incarnations.',
    descBn: 'অনন্ত বলের উৎস পরমেশ্বর ভগবান শ্রী বলরামের পরম পবিত্র আবির্ভাব তিথি।'
  },
  {
    id: 'f9',
    nameEn: 'Sri Krishna Janmastami (Supreme Appearance Day)',
    nameBn: 'শ্রীকৃষ্ণ জন্মাষ্টমী (ভগবান শ্রীকৃষ্ণের আবির্ভাব মহোৎসব)',
    dateEn: '4 September 2026',
    dateBn: '৪ সেপ্টেম্বর ২০২৬',
    month: 9,
    day: 4,
    fastingEn: 'Fasting till midnight 12:00 AM (মধ্যরাত পর্যন্ত পূর্ণ উপবাস)',
    fastingBn: 'মধ্যরাত পর্যন্ত নির্জলা/সজল উপবাস, রাত ১২টায় মহাভিষেক ও আরতি',
    descEn: 'The supreme festival celebrating the appearance of the Supreme Personality of Godhead, Lord Sri Krishna.',
    descBn: 'সর্বকারণ কারণম পরমেশ্বর ভগবান শ্রীকৃষ্ণের ভুবনপাবন আবির্ভাব মহোৎসব।'
  },
  {
    id: 'f10',
    nameEn: 'Srimati Radhastami',
    nameBn: 'শ্রীমতী রাধাষ্টমী (শ্রীমতী রাধারাণীর শুভ আবির্ভাব)',
    dateEn: '19 September 2026',
    dateBn: '১৯ সেপ্টেম্বর ২০২৬',
    month: 9,
    day: 19,
    fastingEn: 'Fasting till noon 12:00 PM (দুপুর ১২:০০ পর্যন্ত উপবাস)',
    fastingBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও রাধাকৃপা প্রার্থনা',
    descEn: 'Appearance day of Srimati Radharani, the supreme internal pleasure potency of Lord Krishna.',
    descBn: 'বৃন্দাবনেশ্বরী শ্রীমতী রাধারাণীর পরম কৃপাময় আবির্ভাব তিথি।'
  },
  {
    id: 'f11',
    nameEn: 'Sri Govardhana Puja & Annakut Mahotsav',
    nameBn: 'শ্রী গোবর্ধন পূজা ও অন্নকূট মহোৎসব (দীপাবলি পরদিন)',
    dateEn: '10 November 2026',
    dateBn: '১০ নভেম্বর ২০২৬',
    month: 11,
    day: 10,
    fastingEn: 'Grand Feast & 108 Preparation Offerings',
    fastingBn: 'গিরি গোবর্ধন পূজা, গো-মাতার সেবা ও শত ব্যঞ্জনের অন্নকূট দর্শন',
    descEn: 'Worship of Giri Govardhan with mountains of sweetmeats and rice offerings.',
    descBn: 'গিরিরাজ গোবর্ধন পূজা ও শ্রীকৃষ্ণের তৃপ্তির জন্য বিপুল অন্নকূট ভোগ নিবেদন।'
  },
  {
    id: 'f12',
    nameEn: 'Srila Prabhupada Disappearance Day',
    nameBn: 'শ্রীল প্রভুপাদের তিরোভাব তিথি মহোৎসব',
    dateEn: '13 November 2026',
    dateBn: '১৩ নভেম্বর ২০২৬',
    month: 11,
    day: 13,
    fastingEn: 'Fasting till noon 12:00 PM (দুপুর ১২:০০ পর্যন্ত উপবাস)',
    fastingBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস, পুষ্পাঞ্জলি ও গুরুপূজা',
    descEn: 'Disappearance day of Founder-Acharya HDG A.C. Bhaktivedanta Swami Prabhupada.',
    descBn: 'ইসকন প্রতিষ্ঠাতা আচার্য জগৎগুরু শ্রীল প্রভুপাদের বিরহ মহোৎসব।'
  }
];

export const MANAGER_ANNOUNCEMENTS: ManagerAnnouncement[] = [
  {
    id: 'm1',
    roleKey: 'COORDINATOR',
    roleTitleEn: 'Central Coordinator',
    roleTitleBn: 'প্রধান সমন্বয়ক',
    inchargeNameEn: 'HG Pandit Gadadhar Das & HG Rupamoy Gopinath Das',
    inchargeNameBn: 'শ্রীল পণ্ডিত গদাধর দাস ও রূপময় গোপীনাথ দাস',
    priority: 'HIGH',
    titleEn: 'Weekly Counseling & Sadhana Audit Deadline',
    titleBn: 'সাপ্তাহিক কাউন্সেলিং রিপোর্ট ও সাধনা অডিট জমা দেওয়ার নোটিশ',
    date: 'Today',
    descEn: 'All 12 ashram counsellees must submit their weekly sadhana log by Friday 8:00 PM. Counselors are requested to inspect the Counselor Desk and send feedback via WhatsApp.',
    descBn: 'আশ্রমের সকল শিক্ষার্থীকে প্রতি শুক্রবার রাত ৮:০০ টার মধ্যে সাপ্তাহিক সাধনাপত্র জমা দিতে হবে। শ্রদ্ধেয় কাউন্সেলরদের ডেস্কে লগইন করে পর্যালোচনা ও আশীর্বাদ প্রদানের অনুরোধ জানানো হচ্ছে।',
    actionRequiredEn: 'Submit Sadhana Log on time',
    actionRequiredBn: 'নির্ধারিত সময়ে সাধনা সাবমিট করুন'
  },
  {
    id: 'm2',
    roleKey: 'INTERNAL_MGR',
    roleTitleEn: 'Internal Manager',
    roleTitleBn: 'অভ্যন্তরীণ ব্যবস্থাপক (Internal Manager)',
    inchargeNameEn: 'Sital Charan Nimai Das',
    inchargeNameBn: 'শীতল চরণ নিমাই দাস',
    priority: 'HIGH',
    titleEn: 'Ashram Discipline & Room Cleanliness Inspection (6:30 AM)',
    titleBn: 'আশ্রম শৃঙ্খলা ও কক্ষ পরিচ্ছন্নতা পরিদর্শন (সকাল ৬:৩০)',
    date: 'Active Routine',
    descEn: 'Daily morning room cleaning check is conducted right after Mangalarati and Japa at 6:30 AM. Bed sheets must be folded, study tables kept neat, and shoes placed in designated racks.',
    descBn: 'প্রতিদিন সকাল ৬:৩০ টায় জপ সমাপ্তির পর প্রতিটি কক্ষ পরিচ্ছন্নতা চেক করা হবে। বিছানা গুছিয়ে রাখা, পড়ার টেবিল পরিষ্কার রাখা ও লাইট-ফ্যান বন্ধ করা বাধ্যতামূলক।',
    actionRequiredEn: 'Keep rooms spotlessly clean',
    actionRequiredBn: 'কক্ষ সম্পূর্ণ পরিচ্ছন্ন রাখুন'
  },
  {
    id: 'm3',
    roleKey: 'MORNING_PROG',
    roleTitleEn: 'Morning Program Incharge',
    roleTitleBn: 'মর্নিং প্রোগ্রাম ইনচার্জ',
    inchargeNameEn: 'Jaydev Sebamoy Das & Bappa Aich',
    inchargeNameBn: 'জয়দেব সেবাময় দাস ও বাপ্পা আইচ',
    priority: 'HIGH',
    titleEn: 'Mangalarati Timing & Attentive Japa Protocol',
    titleBn: 'মঙ্গল আরতি সময়সূচি (৪:১৫ AM) ও গভীর মনোযোগে জপ নিয়মাবলী',
    date: 'Daily Schedule',
    descEn: 'Waking up time: 3:30 AM. Mangalarati begins sharp at 4:15 AM followed by Tulasi Arati, Nrisimha Prayers, and 2 hours of focused Japa (5:00 AM - 7:00 AM) in temple hall.',
    descBn: 'ভোরে জাগরণ: ৩:৩০ AM। ঠিক ৪:১৫ টায় মঙ্গল আরতি, তুলসী পূজা, নৃসিংহ প্রার্থনা ও ৫:০০ থেকে ৭:০০ পর্যন্ত মন্দির হলে বসে একাসনে গভীর মনোযোগে ১৬ মালা জপ সম্পন্ন করতে হবে।',
    actionRequiredEn: 'Be in Temple Hall by 4:10 AM',
    actionRequiredBn: '৪:১০ AM এর মধ্যে মন্দির হলে উপস্থিত হোন'
  },
  {
    id: 'm4',
    roleKey: 'SECURITY_MGR',
    roleTitleEn: 'Security Manager',
    roleTitleBn: 'নিরাপত্তা ব্যবস্থাপক (Security Manager)',
    inchargeNameEn: 'Subal Sakha Gopa Das & Bappa Mohury',
    inchargeNameBn: 'সুবল সখা গোপ দাস ও বাপ্পা মহুরী',
    priority: 'MEDIUM',
    titleEn: 'Night Gate Locking Protocol (10:00 PM) & Guest Registry',
    titleBn: 'রাত্রিকালীন প্রধান ফটক বন্ধের নিয়ম (১০:০০ PM) ও অতিথি এন্ট্রি',
    date: 'Security Rule',
    descEn: 'Main entrance gate is locked strictly at 10:00 PM. Any ashram resident needing late entry due to university lab/exams must give prior written intimation. Outside visitors must sign the visitor register.',
    descBn: 'রাত ১০:০০ টায় প্রধান ফটক বন্ধ করা হয়। ল্যাব বা পরীক্ষার কারণে দেরি হলে আগেই অনুমতি নিতে হবে। বহিরাগত সকল অতিথির রেজিস্টারে এন্ট্রি বাধ্যতামূলক।',
    actionRequiredEn: 'Return to ashram before 10:00 PM',
    actionRequiredBn: '১০:০০ PM এর মধ্যে আশ্রমে প্রবেশ করুন'
  },
  {
    id: 'm5',
    roleKey: 'STUDY_CARE',
    roleTitleEn: 'Study Care & Academic Incharge',
    roleTitleBn: 'স্টাডি কেয়ার ও একাডেমিক ইনচার্জ',
    inchargeNameEn: 'Gian Juti Tripura & Pranto C Das',
    inchargeNameBn: 'জ্ঞান জ্যোতি ত্রিপুরা ও প্রান্ত চন্দ্র দাস',
    priority: 'NORMAL',
    titleEn: 'University Semester Exam Revision & BCS Study Circle',
    titleBn: 'চবি সেমিস্টার পরীক্ষার রিভিশন ও বিসিএস স্টাডি সার্কেল',
    date: 'Saturday 8:00 PM',
    descEn: 'Weekly academic study tracking and BCS question solving session is held every Saturday at 8:00 PM in the Sebananda Library hall. All students must bring their semester progress logs.',
    descBn: 'প্রতি শনিবার রাত ৮:০০ টায় সেবানন্দ গ্রন্থাগারে একাডেমিক স্টাডি কেয়ার ও বিসিএস প্রশ্ন সমাধান সেশন অনুষ্ঠিত হয়। সকল শিক্ষার্থীকে উপস্থিত থাকার অনুরোধ করা হলো।',
    actionRequiredEn: 'Join Study Circle with course notes',
    actionRequiredBn: 'নোটসহ স্টাডি সার্কেলে যোগ দিন'
  },
  {
    id: 'm6',
    roleKey: 'KITCHEN_MGR',
    roleTitleEn: 'Kitchen & Prasadam Incharge',
    roleTitleBn: 'রান্না ও প্রসাদম ইনচার্জ',
    inchargeNameEn: 'Ramanath Shyam Das & Barshana Dham Das',
    inchargeNameBn: 'রমানাথ শ্যাম দাস ও বর্ষাণা ধাম দাস',
    priority: 'MEDIUM',
    titleEn: 'Bhog Offering Timing (12:00 PM) & Sunday Feast Duties',
    titleBn: 'ভোগ নিবেদন সময়সূচি (১২:০০ PM) ও রবিবার যুব ফিস্ট প্রস্তুতি',
    date: 'Kitchen Routine',
    descEn: 'Kitchen cleanliness must be maintained at standard Vaishnava purity. Midday bhoga offering at 12:00 PM sharp. Sunday Youth Feast vegetable cutting and preparation begins at 8:00 AM.',
    descBn: 'অত্যন্ত শুচি ও শুদ্ধভাবে ভোগ রান্না করতে হবে। দুপুর ১২:০০ টায় রাজভোগ নিবেদন ও রবিবাসরীয় যুব ফিস্টের প্রস্তুতি সকাল ৮:০০ টা থেকে শুরু হবে।',
    actionRequiredEn: 'Maintain pure Vaishnava kitchen sanctity',
    actionRequiredBn: 'রান্নাঘরের সর্বোচ্চ শুচিতা বজায় রাখুন'
  }
];
