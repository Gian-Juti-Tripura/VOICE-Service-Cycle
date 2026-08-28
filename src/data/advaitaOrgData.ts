export interface LeadershipMember {
  id: string;
  name: string;
  roleEn: string;
  roleBn: string;
  level: 'GBC' | 'DIRECTOR' | 'ADVISER' | 'OC' | 'DEPARTMENT_HEAD' | 'CARETAKER';
  phone?: string;
  email?: string;
  descriptionEn?: string;
  descriptionBn?: string;
}

export interface DepartmentInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  incharge: string;
  category: 'INTERNAL' | 'FACILITY' | 'PREACHING' | 'ACADEMIC';
  icon: string;
  descriptionEn: string;
  descriptionBn: string;
}

export const SPIRITUAL_LEADERSHIP: LeadershipMember[] = [
  {
    id: 'jps',
    name: 'HH Jayapataka Swami Gurumaharaja',
    roleEn: 'GBC, ISKCON',
    roleBn: 'জিবিসি, ইসকন',
    level: 'GBC'
  },
  {
    id: 'bps',
    name: 'HH Bhakti Purusottam Swami Maharaja',
    roleEn: 'GBC, ISKCON',
    roleBn: 'জিবিসি, ইসকন',
    level: 'GBC'
  },
  {
    id: 'jgd',
    name: 'HG Jagatguru Gauranga Das Brahmachari',
    roleEn: 'Director, IYF',
    roleBn: 'পরিচালক, আইওয়াইএফ',
    level: 'DIRECTOR'
  },
  {
    id: 'pgd',
    name: 'HG Pandit Gadadhar Das Brahmachari',
    roleEn: 'Project Adviser',
    roleBn: 'প্রজেক্ট উপদেষ্টা',
    level: 'ADVISER',
    phone: '01845-812889',
    email: 'Pandit.Gadadhar.JPS@pamho.net'
  },
  {
    id: 'rmd',
    name: 'HG Ranabir Madhav Das Brahmachari',
    roleEn: 'Project Leader',
    roleBn: 'প্রজেক্ট লিডার',
    level: 'ADVISER',
    phone: '01876-630171',
    email: 'ranabir82.jps@gmail.com'
  },
  {
    id: 'rkc',
    name: 'HG Rashvihari KC. Das Brahmachari',
    roleEn: 'Project Manager',
    roleBn: 'প্রজেক্ট ম্যানেজার',
    level: 'ADVISER',
    phone: '01743-546818'
  }
];

export const EXECUTIVE_LEADER: LeadershipMember = {
  id: 'oc_utpol',
  name: 'Utpol Das Khocon',
  roleEn: 'Overall Co-Ordinator (OC)',
  roleBn: 'সার্বিক সমন্বয়ক (ওসি)',
  level: 'OC',
  phone: '01842-651450',
  descriptionEn: 'Responsible for general oversight, daily ashram coordination, and seva cycle policies.',
  descriptionBn: 'সার্বিক আশ্রম তত্ত্বাবধান, সেবাক্রম পরিচালনা এবং নিয়মশৃঙ্খলা নিশ্চিতকরণ।'
};

export const DEPARTMENTS_DATA: DepartmentInfo[] = [
  {
    id: 'study_care',
    nameEn: 'Study Care (Academic & Career)',
    nameBn: 'স্টাডি কেয়ার (শিক্ষা ও ক্যারিয়ার)',
    incharge: 'Gian Juti Tripura + Pranto C Das',
    category: 'ACADEMIC',
    icon: 'GraduationCap',
    descriptionEn: 'University exam schedules, study circles, BCS/Bank job preparation & academic welfare.',
    descriptionBn: 'বিশ্ববিদ্যালয় পরীক্ষার রুটিন, স্টাডি সার্কেল, বিসিএস/চাকরি প্রস্তুতি ও একাডেমিক সহায়তা।'
  },
  {
    id: 'internal_manager',
    nameEn: 'Internal Manager',
    nameBn: 'অভ্যন্তরীণ ব্যবস্থাপক',
    incharge: 'Dipendranath Roy',
    category: 'INTERNAL',
    icon: 'ShieldCheck',
    descriptionEn: 'Ashram discipline, living standards, conflict resolution & daily schedule enforcement.',
    descriptionBn: 'আশ্রম শৃঙ্খলা, জীবনযাত্রার মান এবং দৈনন্দিন রুটিন পরিচালনা।'
  },
  {
    id: 'morning_program',
    nameEn: 'Morning Programme',
    nameBn: 'মর্নিং প্রোগ্রাম',
    incharge: 'Joykanto Roy',
    category: 'INTERNAL',
    icon: 'Sun',
    descriptionEn: 'Mangala Arati attendance, kirtan lead coordination & morning Bhagavatam class.',
    descriptionBn: 'মঙ্গল আরতি উপস্থিতি, কীর্তন ও প্রাতঃকালীন ভাগবতম ক্লাস পরিচালনা।'
  },
  {
    id: 'kitchen',
    nameEn: 'Kitchen Incharge & Bhoga',
    nameBn: 'রান্নাঘর ও ভোগ নিবেদন ইনচার্জ',
    incharge: 'Antor Mohonto',
    category: 'INTERNAL',
    icon: 'Utensils',
    descriptionEn: 'Daily prasadam headcount, bhoga inventory, cooking roster & kitchen hygiene.',
    descriptionBn: 'দৈনিক প্রসাদ গণনা, ভোগ ইনভেন্টরি, রান্না ও রান্নাঘরের পরিচ্ছন্নতা তদারকি।'
  },
  {
    id: 'preaching',
    nameEn: 'Preaching Co-Ordinator',
    nameBn: 'প্রচার সমন্বয়ক',
    incharge: 'US Joy + Roton C Roy',
    category: 'PREACHING',
    icon: 'Users',
    descriptionEn: 'Campus outreach, DYS/EBG enrollment, youth counseling & hostel contacts.',
    descriptionBn: 'ক্যাম্পাস প্রচার, ডিসকভার ইয়োর সেলফ ব্যাচ ভর্তি ও যুব কাউন্সেলিং।'
  },
  {
    id: 'festivals',
    nameEn: 'Programme & Festivals',
    nameBn: 'অনুষ্ঠান ও মহোৎসব পরিচালনা',
    incharge: 'Akash Poul + Ankon Nath',
    category: 'PREACHING',
    icon: 'Sparkles',
    descriptionEn: 'Festival countdown, special events, decoration, stage & festival seva allocation.',
    descriptionBn: 'উৎসবের পরিকল্পনা, বিশেষ সেবা বণ্টন, সাজসজ্জা ও সাংস্কৃতিক অনুষ্ঠান।'
  },
  {
    id: 'accounts_memberships',
    nameEn: 'Accounts & Easy Memberships',
    nameBn: 'হিসাব ও সদস্যপদ ব্যবস্থাপনা',
    incharge: 'Ankon Nath',
    category: 'FACILITY',
    icon: 'CreditCard',
    descriptionEn: 'Ashram budgeting, accounts log, VOICE/Ashray membership database.',
    descriptionBn: 'আশ্রম আয়-ব্যয় হিসাব, বাজেট ও ভয়েস সদস্যপদ তালিকা।'
  },
  {
    id: 'monthly_report',
    nameEn: 'Monthly-Report Manager',
    nameBn: 'মাসিক প্রতিবেদন ব্যবস্থাপক',
    incharge: 'Ankon Nath',
    category: 'INTERNAL',
    icon: 'FileText',
    descriptionEn: 'Monthly ashram review, preaching stats compilation & counselor submissions.',
    descriptionBn: 'মাসিক আশ্রম পর্যালোচনা ও প্রচার পরিসংখ্যান প্রতিবেদন তৈরি।'
  },
  {
    id: 'deity_tulasi',
    nameEn: 'Deity & Tulasi Care',
    nameBn: 'শ্রীবিগ্রহ ও তুলসী সেবা',
    incharge: 'Antor Mohonto / Antor Kumar Mohonta',
    category: 'INTERNAL',
    icon: 'HeartHandshake',
    descriptionEn: 'Altar decoration, daily puja, water offering, Tulasi watering & circumambulation.',
    descriptionBn: 'বেদী সাজসজ্জা, দৈনিক পূজা, তুলসী মহারানীর সেবা ও জলদান।'
  },
  {
    id: 'cleanliness_energy',
    nameEn: 'Cleanliness, Water & Security/Energy',
    nameBn: 'পরিচ্ছন্নতা, পানি ও নিরাপত্তা/বিদ্যুৎ',
    incharge: 'Sangakara Das',
    category: 'FACILITY',
    icon: 'Zap',
    descriptionEn: 'Water filtration, cleanliness inspection, electricity conservation & ashram security.',
    descriptionBn: 'পানি সরবরাহ, সার্বিক পরিচ্ছন্নতা, বিদ্যুৎ সাশ্রয় ও আশ্রমের নিরাপত্তা।'
  },
  {
    id: 'btg_cs',
    nameEn: 'BTG-CS (Literature Distribution)',
    nameBn: 'বিটিজি ও গ্রন্থ প্রচার',
    incharge: 'Dipendranath Roy',
    category: 'PREACHING',
    icon: 'BookOpen',
    descriptionEn: 'Back to Godhead subscriptions, book stalls, and literature distribution records.',
    descriptionBn: 'ভগবদ্দর্শন ম্যাগাজিন গ্রাহক সংগ্রহ ও পারমার্থিক সাহিত্য প্রচার।'
  },
  {
    id: 'medical_guest',
    nameEn: 'Medical & Guest Care',
    nameBn: 'চিকিৎসা ও অতিথি সেবা',
    incharge: 'Bappy C Sarkar',
    category: 'INTERNAL',
    icon: 'Stethoscope',
    descriptionEn: 'First-aid box maintenance, sick devotee care & visiting guest hospitality.',
    descriptionBn: 'ফার্স্ট এইড বক্স, অসুস্থ ভক্তদের সেবা ও আগত অতিথিদের আপ্যায়ন।'
  },
  {
    id: 'camps_assistant',
    nameEn: 'Course-Camp Assistant',
    nameBn: 'ক্যাম্প ও কোর্স সহকারী',
    incharge: 'Roton Roy',
    category: 'PREACHING',
    icon: 'Tent',
    descriptionEn: 'Sankalpa, Sphurti, ASHRAY camp logistics, lodging & venue arrangements.',
    descriptionBn: 'সংকল্প, স্ফুর্তি ও আশ্রয় ক্যাম্পের লজিস্টিকস ও ভেন্যু ব্যবস্থাপনা।'
  },
  {
    id: 'sadhana_resources',
    nameEn: 'Sadhana Resources',
    nameBn: 'সাধনা সামগ্রী ব্যবস্থাপনা',
    incharge: 'Akash Paul',
    category: 'INTERNAL',
    icon: 'FolderCheck',
    descriptionEn: 'Japa bead bags, counters, tilak, sadhana cards, and spiritual kits.',
    descriptionBn: 'জপমালা, থলে, তিলক, সাধনা কার্ড ও পারমার্থিক সামগ্রী বিতরণ।'
  }
];
