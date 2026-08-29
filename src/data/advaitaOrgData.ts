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
  branch: 1 | 2 | 3;
  nameEn: string;
  nameBn: string;
  incharge: string;
  category: 'INTERNAL' | 'MAINTENANCE' | 'PREACHING' | 'ACADEMIC';
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
  // --- COLUMN 1: Ashram & Daily Operations ---
  {
    id: 'internal_manager',
    branch: 1,
    nameEn: 'Internal Manager',
    nameBn: 'অভ্যন্তরীণ ব্যবস্থাপক',
    incharge: 'Dipendranath Roy',
    category: 'INTERNAL',
    icon: 'ShieldCheck',
    descriptionEn: 'Ashram discipline, living standards, room inspection & daily schedule enforcement.',
    descriptionBn: 'আশ্রম শৃঙ্খলা, জীবনযাত্রার মান এবং দৈনন্দিন রুটিন পরিচালনা।'
  },
  {
    id: 'morning_program',
    branch: 1,
    nameEn: 'Morning Programme',
    nameBn: 'মর্নিং প্রোগ্রাম',
    incharge: 'Joykanto Roy',
    category: 'INTERNAL',
    icon: 'Sun',
    descriptionEn: 'Mangalarati (4:15 AM), Tulasi Arati, Japa meditation & morning Bhagavatam class.',
    descriptionBn: 'মঙ্গল আরতি, তুলসী পূজা, জপ সাধনা ও প্রাতঃকালীন ভাগবতম ক্লাস পরিচালনা।'
  },
  {
    id: 'kitchen_incharge',
    branch: 1,
    nameEn: 'Kitchen Incharge',
    nameBn: 'রান্নাঘর ইনচার্জ ও ভোগ সেবা',
    incharge: 'Antor Mohonto',
    category: 'INTERNAL',
    icon: 'Utensils',
    descriptionEn: 'Daily prasadam headcount, bhoga inventory, cooking roster & kitchen sanctity.',
    descriptionBn: 'দৈনিক প্রসাদ গণনা, ভোগ ইনভেন্টরি, রান্না ও রান্নাঘরের পরিচ্ছন্নতা তদারকি।'
  },
  {
    id: 'study_care',
    branch: 1,
    nameEn: 'Study Care',
    nameBn: 'স্টাডি কেয়ার (শিক্ষা ও ক্যারিয়ার)',
    incharge: 'Gian Juti Tripura + Pranto C Das',
    category: 'ACADEMIC',
    icon: 'GraduationCap',
    descriptionEn: 'University exam schedules, study circles, BCS/Bank job preparation & daily study logs.',
    descriptionBn: 'বিশ্ববিদ্যালয় পরীক্ষার রুটিন, স্টাডি সার্কেল, বিসিএস/চাকরি প্রস্তুতি ও একাডেমিক সহায়তা।'
  },
  {
    id: 'medical_guest',
    branch: 1,
    nameEn: 'Medical & Guest Care',
    nameBn: 'চিকিৎসা ও অতিথি সেবা',
    incharge: 'Bappy C Sarkar',
    category: 'INTERNAL',
    icon: 'Stethoscope',
    descriptionEn: 'First-aid maintenance, health care for sick devotees & visiting guest hospitality.',
    descriptionBn: 'ফার্স্ট এইড বক্স, অসুস্থ ভক্তদের সেবা ও আগত অতিথিদের আপ্যায়ন।'
  },
  {
    id: 'security_energy',
    branch: 1,
    nameEn: 'Security & Energy Manager',
    nameBn: 'নিরাপত্তা ও বিদ্যুৎ ব্যবস্থাপক',
    incharge: 'Sangakara Das',
    category: 'INTERNAL',
    icon: 'ShieldAlert',
    descriptionEn: 'Night gate locking (10 PM), visitor log, electricity conservation & ashram safety.',
    descriptionBn: 'রাত ১০টায় গেট বন্ধ, বিদ্যুৎ সাশ্রয় ও আশ্রমের সামগ্রিক নিরাপত্তা তদারকি।'
  },

  // --- COLUMN 2: Ashram Services & Maintenance ---
  {
    id: 'accounts',
    branch: 2,
    nameEn: 'Accounts',
    nameBn: 'হিসাব বিভাগ',
    incharge: 'Ankon Nath',
    category: 'MAINTENANCE',
    icon: 'CreditCard',
    descriptionEn: 'Ashram income-expenditure budgeting, daily accounts record & audit reports.',
    descriptionBn: 'আশ্রমের আয়-ব্যয় হিসাব, দৈনিক ক্যাশবুক ও অডিট রিপোর্ট পরিচালনা।'
  },
  {
    id: 'deity_care',
    branch: 2,
    nameEn: 'Deity Care',
    nameBn: 'শ্রীবিগ্রহ সেবা ও আরতি',
    incharge: 'Antor Mohonto',
    category: 'INTERNAL',
    icon: 'HeartHandshake',
    descriptionEn: 'Altar decoration, daily deity seva, dress offering & puja arrangements.',
    descriptionBn: 'বেদী সাজসজ্জা, বিগ্রহের স্নান-বস্ত্র এবং আরতি ও পূজা সরঞ্জাম পরিচালনা।'
  },
  {
    id: 'easy_memberships',
    branch: 2,
    nameEn: 'Easy Memberships',
    nameBn: 'সহজ সদস্যপদ ব্যবস্থাপনা',
    incharge: 'Ankon Nath',
    category: 'MAINTENANCE',
    icon: 'Users',
    descriptionEn: 'VOICE and Ashraya membership database, enrollment & monthly contribution tracking.',
    descriptionBn: 'ভয়েস ও আশ্রয় সদস্যপদ নিবন্ধন এবং নিয়মিত ডেটাবেজ আপডেট।'
  },
  {
    id: 'cleanliness_water',
    branch: 2,
    nameEn: 'Cleanliness & Water',
    nameBn: 'পরিচ্ছন্নতা ও পানি ব্যবস্থাপনা',
    incharge: 'Sangakara Das',
    category: 'MAINTENANCE',
    icon: 'Droplets',
    descriptionEn: 'Water pump operations, pure drinking water filtration & ashram cleanliness standard.',
    descriptionBn: 'পানির পাম্প ও ফিল্টার রক্ষণাবেক্ষণ এবং সার্বিক পরিচ্ছন্নতা নিশ্চিতকরণ।'
  },
  {
    id: 'tulasi_care',
    branch: 2,
    nameEn: 'Tulasi Care',
    nameBn: 'শ্রীতুলসী সেবা ও পরিচর্যা',
    incharge: 'Antor Kumar Mohonta',
    category: 'INTERNAL',
    icon: 'Leaf',
    descriptionEn: 'Daily Tulasi watering, soil nourishment, seasonal care & leaf offerings.',
    descriptionBn: 'শ্রীতুলসী মহারানীর জলদান, আলো-বাতাস নিশ্চিতকরণ ও পাতা চয়ন বিধি রক্ষা।'
  },
  {
    id: 'sadhana_resources',
    branch: 2,
    nameEn: 'Sadhana Resources',
    nameBn: 'সাধনা সামগ্রী ব্যবস্থাপনা',
    incharge: 'Akash Paul',
    category: 'INTERNAL',
    icon: 'Sparkles',
    descriptionEn: 'Japa malas, bead bags, tilak, japa counters, and spiritual kits distribution.',
    descriptionBn: 'জপমালা, থলে, তিলক, সাধনা ডায়েরি ও আধ্যাত্মিক সামগ্রী বিতরণ।'
  },

  // --- COLUMN 3: Preaching, Courses & Festivals ---
  {
    id: 'preaching_coordinator',
    branch: 3,
    nameEn: 'Preaching Co-Ordinator',
    nameBn: 'প্রচার সমন্বয়ক',
    incharge: 'US Joy + Roton C Roy',
    category: 'PREACHING',
    icon: 'Megaphone',
    descriptionEn: 'CU Campus outreach, faculty preaching, youth counseling & DYS enrollment.',
    descriptionBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় ক্যাম্পাস প্রচার, অনুষদভিত্তিক কার্যক্রম ও যুব কাউন্সেলিং।'
  },
  {
    id: 'monthly_report',
    branch: 3,
    nameEn: 'Monthly-Report Manager',
    nameBn: 'মাসিক প্রতিবেদন ব্যবস্থাপক',
    incharge: 'Ankon Nath',
    category: 'PREACHING',
    icon: 'FileText',
    descriptionEn: 'Monthly ashram progress reports, preaching metrics & counselor compilations.',
    descriptionBn: 'মাসিক অগ্রগতি ও প্রচার পরিসংখ্যান সংকলন এবং প্রতিবেদন তৈরি।'
  },
  {
    id: 'course_camps',
    branch: 3,
    nameEn: 'Course-Camps',
    nameBn: 'কোর্স ও ক্যাম্প পরিচালনা',
    incharge: 'Preaching Co-ordinators',
    category: 'PREACHING',
    icon: 'Tent',
    descriptionEn: 'Overall management of 13 residential camps (Sankalpa, Sphurti, SRCGD, Nistha, etc.).',
    descriptionBn: '১৩টি আবাসিক ক্যাম্প ও কারিকুলাম পরিচালনার সার্বিক তত্ত্বাবধান।'
  },
  {
    id: 'btg_cs',
    branch: 3,
    nameEn: 'BTG-CS (Back to Godhead & Correspondence)',
    nameBn: 'বিটিজি-সিএস ও পারমার্থিক সাহিত্য',
    incharge: 'Dipendranath Roy',
    category: 'PREACHING',
    icon: 'BookOpen',
    descriptionEn: 'Back to Godhead subscriptions, book distribution & spiritual correspondence school.',
    descriptionBn: 'ভগবদ্দর্শন পত্রিকা গ্রাহক সংগ্রহ ও পারমার্থিক পত্রালাপ কোর্স পরিচালনা।'
  },
  {
    id: 'course_camp_assistant',
    branch: 3,
    nameEn: 'Course-Camp-Assistant',
    nameBn: 'কোর্স ও ক্যাম্প সহকারী',
    incharge: 'Roton Roy',
    category: 'PREACHING',
    icon: 'Compass',
    descriptionEn: 'Camp venue booking, student lodging, logistics & tour coordination.',
    descriptionBn: 'ক্যাম্পের ভেন্যু বুকিং, শিক্ষার্থীদের আবাসন ও লজিস্টিকস সহায়তা।'
  },
  {
    id: 'programme_festivals',
    branch: 3,
    nameEn: 'Programme & Festivals',
    nameBn: 'অনুষ্ঠান ও মহোৎসব পরিচালনা',
    incharge: 'Akash Paul + Ankon Nath',
    category: 'PREACHING',
    icon: 'Sparkles',
    descriptionEn: 'Janmastami, Gaura Purnima, Sunday Youth Feasts & stage decoration.',
    descriptionBn: 'শ্রীকৃষ্ণ জন্মাষ্টমী, গৌর পূর্ণিমা ও বিশেষ মহোৎসবের স্টেজ ও সাংস্কৃতিক আয়োজন।'
  }
];
