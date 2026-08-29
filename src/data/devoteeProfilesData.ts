export interface NectarDrop {
  id: string;
  text: string;
  author: string;
  date: string;
  tag?: string;
}

export interface DevoteeProfile {
  id: string;
  sl: number;
  name: string;
  spiritualName?: string;
  phone: string;
  gmail: string;
  birthday: string; // YYYY-MM-DD
  address: string;
  bloodGroup: string;
  department: string;
  institute: string;
  guardianNumber?: string;
  nationalId?: string;
  serviceType: string;
  roleBadge?: string;
  photo?: string;
  nectarDrops: NectarDrop[];
}

export const INITIAL_DEVOTEES_DATA: DevoteeProfile[] = [
  {
    id: 'dev_caretaker',
    sl: 0,
    name: 'H.G Rasvihari Krishna Chandra Das',
    spiritualName: 'Rasvihari Krishna Chandra Das',
    phone: '01875835986',
    gmail: 'rasvihari.voice@gmail.com',
    birthday: '1985-04-14',
    address: 'Chittagong',
    bloodGroup: 'O+',
    department: 'VOICE Caretaker & Senior Mentor',
    institute: 'ISKCON Chittagong / University of Chittagong',
    guardianNumber: '01875835986',
    nationalId: '1985159823412',
    serviceType: 'Caretaker & Spiritual Guide',
    roleBadge: 'VOICE Caretaker',
    nectarDrops: [
      {
        id: 'nd_1',
        text: 'অসীম ধৈর্য্যশীল, স্নেহাময় গুরুজন এবং তরুণ শিক্ষার্থীদের পরম আধ্যাত্মিক আশ্রয়দাতা।',
        author: 'Advaita VOICE Family',
        date: '2026-08-01',
        tag: 'স্নেহময় আশ্রয়'
      },
      {
        id: 'nd_2',
        text: 'নিয়মিত প্রত্যুষে মঙ্গল আরতিতে উপস্থিতি ও ভক্তদের সাধনায় উৎসাহ প্রদান।',
        author: 'Sadhana Desk',
        date: '2026-08-15',
        tag: 'সাধনা নিষ্ঠা'
      }
    ]
  },
  {
    id: 'dev_coordinator',
    sl: 2,
    name: 'Utpol Das Khocon',
    spiritualName: 'Utpol Das',
    phone: '01790839891',
    gmail: 'utpol.acce.cu@gmail.com',
    birthday: '2001-09-18',
    address: 'Rajshahi',
    bloodGroup: 'A+',
    department: 'ACCE',
    institute: 'University of Chittagong',
    guardianNumber: '01712000000',
    nationalId: '2001769823451',
    serviceType: 'IYF (VOICE Coordinator)',
    roleBadge: 'VOICE Coordinator',
    nectarDrops: [
      {
        id: 'nd_3',
        text: 'দুর্দান্ত সাংগঠনিক দক্ষতা ও সকল সেবায় সর্বদা হাসিমুখে নেতৃত্ব দেন।',
        author: 'Gianjyoti Tripura',
        date: '2026-08-10',
        tag: 'দক্ষ সমন্বয়ক'
      },
      {
        id: 'nd_4',
        text: 'সকল ভক্তের ব্যক্তিগত সুবিধা-অসুবিধা তদারকি ও সেবায় আন্তরিক অনুপ্রেরণা।',
        author: 'Akash Paul',
        date: '2026-08-20',
        tag: 'আন্তরিকতা'
      }
    ]
  },
  {
    id: 'dev_gianjyoti',
    sl: 3,
    name: 'Gianjyoti Tripura',
    spiritualName: 'Gianjyoti Das',
    phone: '01571328549',
    gmail: 'gianjyoti.cse.cu@gmail.com',
    birthday: '2002-11-25',
    address: 'Khagrachari',
    bloodGroup: 'B+',
    department: 'CSE',
    institute: 'University of Chittagong',
    guardianNumber: '01550000000',
    nationalId: '2002159823009',
    serviceType: 'IYF (Digital & IT Incharge)',
    roleBadge: 'IT & Digital Seva',
    nectarDrops: [
      {
        id: 'nd_5',
        text: 'অধ্যবসায়ী, প্রজ্ঞাবান ও প্রযুক্তির মাধ্যমে শ্রী প্রভুপাদের বাণী প্রচারের অক্লান্ত সেবক।',
        author: 'Utpol Das Khocon',
        date: '2026-08-12',
        tag: 'প্রযুক্তি সেবা'
      },
      {
        id: 'nd_6',
        text: 'শান্ত ও ধীরস্থির স্বভাব, যেকোনো জটিল সমস্যার সুশৃঙ্খল সমাধান করেন।',
        author: 'Dipendranath Roy',
        date: '2026-08-22',
        tag: 'শান্ত স্বভাব'
      }
    ]
  },
  {
    id: 'dev_akash',
    sl: 1,
    name: 'Akash Paul',
    spiritualName: 'Akash Das',
    phone: '01799100306',
    gmail: 'akash.socio.cu@gmail.com',
    birthday: '2001-03-12',
    address: 'Feni, Chittagong',
    bloodGroup: 'O+',
    department: 'Sociology',
    institute: 'University of Chittagong',
    guardianNumber: '01799000000',
    nationalId: '2001159876543',
    serviceType: 'IYF',
    roleBadge: 'IYF Youth Leader',
    nectarDrops: [
      {
        id: 'nd_7',
        text: 'মধুর ব্যবহারের অধিকারী এবং নতুন আগত শিক্ষার্থীদের পরম আপন করে নেন।',
        author: 'Ankan Nath',
        date: '2026-08-14',
        tag: 'মধুর স্বভাব'
      }
    ]
  },
  {
    id: 'dev_dipendra',
    sl: 4,
    name: 'Dipendranath Roy',
    spiritualName: 'Dipendra Das',
    phone: '01320903062',
    gmail: 'dipendra.philo.cu@gmail.com',
    birthday: '2002-07-08',
    address: 'Thakurgaon',
    bloodGroup: 'O+',
    department: 'Philosophy',
    institute: 'University of Chittagong',
    guardianNumber: '01320000000',
    nationalId: '2002159876111',
    serviceType: 'IYF',
    roleBadge: 'Philosophical Study',
    nectarDrops: [
      {
        id: 'nd_8',
        text: 'শাস্ত্রীয় দর্শনে গভীর মনোযোগী ও প্রাঞ্জল উপস্থাপনায় দক্ষ।',
        author: 'Sangakara Das',
        date: '2026-08-16',
        tag: 'শাস্ত্রীয় প্রজ্ঞা'
      }
    ]
  },
  {
    id: 'dev_sangakara',
    sl: 5,
    name: 'Sangakara Das',
    spiritualName: 'Sangakara Krishna Das',
    phone: '01722711849',
    gmail: 'sangakara.chem.cu@gmail.com',
    birthday: '2001-12-05',
    address: 'Jashor',
    bloodGroup: 'B+',
    department: 'Chemistry',
    institute: 'University of Chittagong',
    guardianNumber: '01722000000',
    nationalId: '2001159876222',
    serviceType: 'IYF',
    roleBadge: 'Kitchen & Prasadam Seva',
    nectarDrops: [
      {
        id: 'nd_9',
        text: 'ভগবানের ভোগের জন্য অত্যন্ত নিষ্ঠা ও পরিচ্ছন্নতার সাথে প্রসাদ সেবা পরিচালনা করেন।',
        author: 'Utpol Das Khocon',
        date: '2026-08-18',
        tag: 'প্রসাদ সেবা'
      }
    ]
  },
  {
    id: 'dev_ankan',
    sl: 6,
    name: 'Ankan Nath',
    spiritualName: 'Ankan Das',
    phone: '01933503979',
    gmail: 'ankan.socio.cu@gmail.com',
    birthday: '2002-01-20',
    address: 'Feni',
    bloodGroup: 'O+',
    department: 'Sociology',
    institute: 'University of Chittagong',
    guardianNumber: '01933000000',
    nationalId: '2002159876333',
    serviceType: 'IYF',
    roleBadge: 'IYF Seva Member',
    nectarDrops: [
      {
        id: 'nd_10',
        text: 'প্রচার অভিযানে সর্বদা অগ্রগামী ও সহযোগিতাপূর্ণ মনোভাব।',
        author: 'Akash Paul',
        date: '2026-08-19',
        tag: 'উৎসাহী প্রচারক'
      }
    ]
  },
  {
    id: 'dev_antor',
    sl: 7,
    name: 'Antor Kumar Mohanto',
    spiritualName: 'Antor Das',
    phone: '01704370139',
    gmail: 'antor.sanskrit.cu@gmail.com',
    birthday: '2003-04-15',
    address: 'Gaibandha',
    bloodGroup: 'O+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01704000000',
    nationalId: '2003159876444',
    serviceType: 'IYF',
    roleBadge: 'Morning Program Seva',
    nectarDrops: [
      {
        id: 'nd_11',
        text: 'সকালের সাধনা ও শ্লোক উচ্চারণে অত্যন্ত পারদর্শী এবং মধুর কণ্ঠস্বর।',
        author: 'Utshab Sarkar Joy',
        date: '2026-08-21',
        tag: 'শ্লোক আবৃত্তি'
      }
    ]
  },
  {
    id: 'dev_utshab',
    sl: 8,
    name: 'Utshab Sarkar Joy',
    spiritualName: 'Utshab Das',
    phone: '01734550288',
    gmail: 'utshab.joy.cu@gmail.com',
    birthday: '2002-08-28',
    address: 'Mymensingh',
    bloodGroup: 'O+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01734000000',
    nationalId: '2002159876555',
    serviceType: 'IYF',
    roleBadge: 'Kirtan & Bhajan Seva',
    nectarDrops: [
      {
        id: 'nd_12',
        text: 'হৃদয়স্পর্শী সংকীর্তন ও মৃদঙ্গ বাদনে ভক্তদের আনন্দে আত্মহারা করেন।',
        author: 'Roton Roy',
        date: '2026-08-23',
        tag: 'মধুর কীর্তনীয়া'
      }
    ]
  },
  {
    id: 'dev_roton',
    sl: 9,
    name: 'Roton Roy',
    spiritualName: 'Roton Das',
    phone: '01750504601',
    gmail: 'roton.sanskrit.cu@gmail.com',
    birthday: '2002-10-10',
    address: 'Rangpur',
    bloodGroup: 'B+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01750000000',
    nationalId: '2002159876666',
    serviceType: 'IYF',
    roleBadge: 'Study Care Incharge',
    nectarDrops: [
      {
        id: 'nd_13',
        text: 'নম্রতা, বিনয় এবং জুনিয়র ভক্তদের পড়াশোনা ও সাধনায় যত্নশীল পথপ্রদর্শক।',
        author: 'Gianjyoti Tripura',
        date: '2026-08-24',
        tag: 'বিনয়ী ও যত্নশীল'
      }
    ]
  },
  {
    id: 'dev_pranto',
    sl: 10,
    name: 'Pranto Das',
    spiritualName: 'Pranto Krishna Das',
    phone: '01609302008',
    gmail: 'pranto.cse.cu@gmail.com',
    birthday: '2003-02-14',
    address: 'Gazipur',
    bloodGroup: 'AB+',
    department: 'CSE',
    institute: 'University of Chittagong',
    guardianNumber: '01609000000',
    nationalId: '2003159876777',
    serviceType: 'IYF',
    roleBadge: 'Technical Support',
    nectarDrops: [
      {
        id: 'nd_14',
        text: 'কম্পিউটার ও ডিজিটাল প্রচারকাজে যেকোনো মুহূর্তে নিঃস্বার্থ সেবা প্রদান করেন।',
        author: 'Gianjyoti Tripura',
        date: '2026-08-25',
        tag: 'নিঃস্বার্থ সেবা'
      }
    ]
  },
  {
    id: 'dev_joykanto',
    sl: 11,
    name: 'Joykanto Sen',
    spiritualName: 'Joykanto Das',
    phone: '01754034183',
    gmail: 'joykanto.sanskrit.cu@gmail.com',
    birthday: '2002-06-18',
    address: 'Thakurgaon',
    bloodGroup: 'B+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01754000000',
    nationalId: '2002159876888',
    serviceType: 'IYF',
    roleBadge: 'Temple Cleanliness Seva',
    nectarDrops: [
      {
        id: 'nd_15',
        text: 'আশ্রম পরিচ্ছন্নতা ও পূজাসামগ্রী প্রস্তুতিতে নিরলস পরিশ্রমী মনোভাব।',
        author: 'Bappi Chandra Sarkar',
        date: '2026-08-26',
        tag: 'পরিশ্রমী মনোভাব'
      }
    ]
  },
  {
    id: 'dev_bappi',
    sl: 12,
    name: 'Bappi Chandra Sarkar',
    spiritualName: 'Bappi Das',
    phone: '01331982443',
    gmail: 'bappi.sanskrit.cu@gmail.com',
    birthday: '2003-11-02',
    address: 'Panchagarh',
    bloodGroup: 'A+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01331000000',
    nationalId: '2003159876999',
    serviceType: 'IYF',
    roleBadge: 'Youth Member',
    nectarDrops: [
      {
        id: 'nd_16',
        text: 'সহজ-সরল আচরণ, সিনিয়রদের আজ্ঞাবহ এবং ভক্তসঙ্গে অত্যন্ত নিষ্ঠাবান।',
        author: 'Utpol Das Khocon',
        date: '2026-08-27',
        tag: 'আজ্ঞাবহ স্বভাব'
      }
    ]
  }
];
