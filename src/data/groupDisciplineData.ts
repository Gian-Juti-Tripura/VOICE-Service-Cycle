export type GroupType = 'VOICE' | 'LOTUS';

export type DisciplineAuditorRole = 'ADMIN' | 'MORNING_INCHARGE' | 'SECURITY_MANAGER' | 'INTERNAL_MANAGER' | 'VIEWER';

export interface AuditorProfile {
  key: DisciplineAuditorRole;
  titleEn: string;
  titleBn: string;
  inchargeNameEn: string;
  inchargeNameBn: string;
  studentId?: string;
  badgeColor: string;
  descriptionEn: string;
  descriptionBn: string;
}

export const DISCIPLINE_AUDITOR_ROLES: AuditorProfile[] = [
  {
    key: 'ADMIN',
    titleEn: 'Admin / Overall Coordinator',
    titleBn: 'অ্যাডমিন ও সার্বিক সমন্বয়ক',
    inchargeNameEn: 'Utpol Das & Gian Juti (Admin)',
    inchargeNameBn: 'উৎপল দাস ও জ্ঞান জ্যোতি (অ্যাডমিন)',
    studentId: 'member_0',
    badgeColor: 'bg-amber-500 text-slate-950',
    descriptionEn: 'Full editing authority across all Bedtime, Morning Program, Strikes, and Devotee lists.',
    descriptionBn: 'শয়ন, মর্নিং প্রোগ্রাম, স্ট্রাইক এবং ভক্ত তালিকার পূর্ণ পরিবর্তন ও নিয়ন্ত্রণের ক্ষমতাপ্রাপ্ত।'
  },
  {
    key: 'MORNING_INCHARGE',
    titleEn: 'Morning Program Incharge',
    titleBn: 'মর্নিং প্রোগ্রাম ইনচার্জ',
    inchargeNameEn: 'Dipendranath Roy (Dipen P.)',
    inchargeNameBn: 'দীপেন্দ্রনাথ রায় (দীপেন প্রভু)',
    studentId: 'member_5',
    badgeColor: 'bg-emerald-600 text-white',
    descriptionEn: 'Authorized to edit Wake-up (4:00 AM), MP Punctuality (with late minutes), Mangalarati, and Morning Class.',
    descriptionBn: 'ভোর ৪:০০ জাগরণ, মর্নিং প্রোগ্রাম (বিলম্ব মিনিট), মঙ্গল আরতি ও ক্লাসের উপস্থিতি নিয়ন্ত্রণের ক্ষমতাপ্রাপ্ত।'
  },
  {
    key: 'SECURITY_MANAGER',
    titleEn: 'Security & Energy Manager',
    titleBn: 'নিরাপত্তা ও বিদ্যুৎ ব্যবস্থাপক',
    inchargeNameEn: 'Sangakara Das (Sanga P.)',
    inchargeNameBn: 'সাঙ্গাকারা দাস (সাঙ্গা প্রভু)',
    studentId: 'member_4',
    badgeColor: 'bg-indigo-600 text-white',
    descriptionEn: 'Authorized to edit Bedtime Curfew compliance (10 PM / 11 PM), late minutes, and Night Leaves/Absence reasons.',
    descriptionBn: 'নৈশ কারফিউ শয়ন সময় (১০/১১টা), বিলম্ব মিনিট ও নৈশ ছুটির কারণ নিয়ন্ত্রণের ক্ষমতাপ্রাপ্ত।'
  },
  {
    key: 'INTERNAL_MANAGER',
    titleEn: 'Internal Manager',
    titleBn: 'অভ্যন্তরীণ ব্যবস্থাপক',
    inchargeNameEn: 'Dipendranath Roy (Dipen P.)',
    inchargeNameBn: 'দীপেন্দ্রনাথ রায় (দীপেন প্রভু)',
    studentId: 'member_5',
    badgeColor: 'bg-purple-600 text-white',
    descriptionEn: 'Supervisory management authority across all daily ashram discipline activities.',
    descriptionBn: 'দৈনিক আশ্রম শৃঙ্খলার সার্বিক ব্যবস্থাপনা ও পর্যালোচনার ক্ষমতাপ্রাপ্ত।'
  },
  {
    key: 'VIEWER',
    titleEn: 'General Devotee (View-Only)',
    titleBn: 'সাধারণ ভক্ত (শুধু দর্শন/রিপোর্ট)',
    inchargeNameEn: 'Ashram Devotees & Visitors',
    inchargeNameBn: 'আশ্রম ভক্তবৃন্দ ও দর্শনার্থী',
    badgeColor: 'bg-slate-700 text-slate-200',
    descriptionEn: 'Read-only access to view daily attendance, sadhana records, history logs, and monthly verdicts.',
    descriptionBn: 'শুধুমাত্র দৈনিক উপস্থিতি, সাধনা রেকর্ড, হিস্ট্রি ও মাসিক মূল্যায়ন পর্যবেক্ষণের সুবিধা।'
  }
];

export interface StudentDisciplineRecord {
  id: string;
  name: string;
  group: GroupType;
  phone?: string;
  cycleOrder?: number;
  monthlyStrikes: number; // 0 to 3
  manualStrikeDelta?: number; // manual incharge override delta
  status: 'ACTIVE' | 'WARNED' | 'DEMOTION_DUE' | 'DISMISSED';
}

export interface DailyDisciplineEntry {
  studentId: string;
  dateStr: string; // YYYY-MM-DD
  isAbsent?: boolean;
  absenceReason?: string;
  sleptOnTime: boolean;
  bedLateMinutes?: number; // e.g. 5, 10, 15, 30, 45, 60
  wokeUpOnTime: boolean;
  morningProgramOnTime: boolean;
  mpLateMinutes?: number; // e.g. 5, 10, 15, 30
  mangalaratiAttended: boolean; // Yes / No
  mangalaratiReason?: string;
  morningClassAttended: boolean; // Yes / No till 7:00 AM
  morningClassReason?: string;
  reason?: string;
  isEmergency?: boolean;
  reportedBy?: string;
  notes?: string;
}

export const LATE_MINUTE_OPTIONS = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];

export const MANGALARATI_REASONS = [
  'Health / Sickness (অসুস্থতা / চিকিৎসা)',
  'Room Study / Exam Prep (পরীক্ষার পড়া / পড়াশোনা)',
  'Temple / Outside Seva (মন্দির বা বিশেষ সেবা)',
  'Overslept / Exhaustion (দেরিতে ঘুম ভাঙা / ক্লান্তি)',
  'Personal Emergency (পারিবারিক / ব্যক্তিগত জরুরি)',
  'Other Reason (অন্যান্য কারণ)'
];

export const MORNING_CLASS_REASONS = [
  'University Class / Lab (বিশ্ববিদ্যালয়ের ক্লাস / ল্যাব পরীক্ষা)',
  'Academic Exam Prep (পরীক্ষার বিশেষ প্রস্তুতি)',
  'Health / Sickness (অসুস্থতা / বিশ্রাম)',
  'Morning Temple Seva Duty (সকালের বিশেষ সেবা দায়িত্ব)',
  'Personal Emergency (ব্যক্তিগত জরুরি)',
  'Other Reason (অন্যান্য কারণ)'
];

export const ABSENCE_REASONS = [
  'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)',
  'Health / Hospital / Sickness (অসুস্থতা / চিকিৎসা)',
  'University Exam / Academic (পরীক্ষার প্রস্তুতি)',
  'Temple / Outside Seva (মন্দির বা বিশেষ প্রচার সেবা)',
  'Personal Emergency (পারিবারিক / ব্যক্তিগত ছুটি)',
  'Other Reason (অন্যান্য কারণ)'
];

export const EMERGENCY_REASONS = [
  'Emergency (জরুরি পরিস্থিতি)',
  'Health Emergency / Sickness (অসুস্থতা / স্বাস্থ্য সমস্যা)',
  'Family Emergency (পারিবারিক জরুরি)',
  'Academic / Urgent Exam Study (পরীক্ষার বিশেষ প্রস্তুতি)',
  'Temple / VOICE Seva Duty (মন্দির বা ভয়েস বিশেষ সেবা)',
  'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
  'Other Reason (অন্যান্য কারণ)'
];

export const INITIAL_DISCIPLINE_STUDENTS: StudentDisciplineRecord[] = [
  // VOICE Group (10 devotees)
  { id: 'member_0', name: 'UTPOL P.', group: 'VOICE', phone: '+880 1790-839891', cycleOrder: 1, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_1', name: 'CHAITANYA P.', group: 'VOICE', phone: '+880 1331-982443', cycleOrder: 2, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_2', name: 'GIAN P.', group: 'VOICE', phone: '+8801571328549', cycleOrder: 3, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_5', name: 'DIPEN P.', group: 'VOICE', phone: '01571422381', cycleOrder: 6, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_6', name: 'ANKON P.', group: 'VOICE', phone: '01933503979', cycleOrder: 7, monthlyStrikes: 1, status: 'WARNED' },
  { id: 'member_7', name: 'ANTOR P.', group: 'VOICE', phone: '+880 1704-370139', cycleOrder: 8, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_8', name: 'ROTON P.', group: 'VOICE', phone: '+880 1750-504601', cycleOrder: 9, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_9', name: 'JOY S. P.', group: 'VOICE', phone: '+880 1734-550288', cycleOrder: 10, monthlyStrikes: 1, status: 'WARNED' },
  { id: 'member_10', name: 'JOYKANT P.', group: 'VOICE', phone: '+880 1754-034183', cycleOrder: 11, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_11', name: 'BAPPI C. P.', group: 'VOICE', cycleOrder: 12, monthlyStrikes: 1, status: 'WARNED' },

  // Lotus Group (Only Sangakara Das and Pranto C Das)
  { id: 'member_3', name: 'PRANTO P. (Pranto C Das)', group: 'LOTUS', phone: '+880 1609-302008', cycleOrder: 4, monthlyStrikes: 2, status: 'WARNED' },
  { id: 'member_4', name: 'SANGA P. (Sangakara Das)', group: 'LOTUS', phone: '+880 1722-711849', cycleOrder: 5, monthlyStrikes: 1, status: 'WARNED' },
];

export const createDefaultDailyRecordsForDate = (dateIso: string): Record<string, DailyDisciplineEntry> => {
  const result: Record<string, DailyDisciplineEntry> = {};
  
  INITIAL_DISCIPLINE_STUDENTS.forEach(student => {
    const isUtpol = student.id === 'member_0';
    const isSept2 = dateIso === '2026-09-02';
    
    result[student.id] = {
      studentId: student.id,
      dateStr: dateIso,
      isAbsent: isUtpol,
      absenceReason: isUtpol 
        ? (isSept2 
            ? 'Health / Hospital / Sickness (অসুস্থতা / চিকিৎসা)' 
            : 'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)')
        : '',
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: !isUtpol,
      mangalaratiReason: isUtpol ? 'Leave / Absent' : '',
      morningClassAttended: !isUtpol,
      morningClassReason: isUtpol ? 'Leave / Absent' : '',
      reason: '',
      isEmergency: false
    };
  });
  
  return result;
};

// Initial Detailed Seed Data for September 1 to September 7, 2026
export const INITIAL_DAILY_DISCIPLINE_RECORDS: Record<string, Record<string, DailyDisciplineEntry>> = {
  '2026-09-01': {
    ...createDefaultDailyRecordsForDate('2026-09-01'),
    'member_11': {
      studentId: 'member_11',
      dateStr: '2026-09-01',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 15,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Academic / Urgent Exam Study (পরীক্ষার বিশেষ প্রস্তুতি)',
      isEmergency: false
    },
    'member_4': {
      studentId: 'member_4',
      dateStr: '2026-09-01',
      isAbsent: false,
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: false,
      morningClassReason: 'Morning Temple Seva Duty (সকালের বিশেষ সেবা দায়িত্ব)',
      reason: 'Temple / VOICE Seva Duty (মন্দির বা ভয়েস বিশেষ সেবা)',
      isEmergency: false
    },
    'member_3': {
      studentId: 'member_3',
      dateStr: '2026-09-01',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 25,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    }
  },

  '2026-09-02': {
    ...createDefaultDailyRecordsForDate('2026-09-02'),
    'member_6': {
      studentId: 'member_6',
      dateStr: '2026-09-02',
      isAbsent: false,
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: false,
      morningProgramOnTime: false,
      mpLateMinutes: 10,
      mangalaratiAttended: true,
      morningClassAttended: false,
      morningClassReason: 'University Class / Lab (বিশ্ববিদ্যালয়ের ক্লাস / ল্যাব পরীক্ষা)',
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    },
    'member_9': {
      studentId: 'member_9',
      dateStr: '2026-09-02',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 30,
      wokeUpOnTime: false,
      morningProgramOnTime: false,
      mpLateMinutes: 15,
      mangalaratiAttended: false,
      mangalaratiReason: 'Health / Sickness (অসুস্থতা / চিকিৎসা)',
      morningClassAttended: false,
      morningClassReason: 'Health / Sickness (অসুস্থতা / বিশ্রাম)',
      reason: 'Health Emergency / Sickness (অসুস্থতা / স্বাস্থ্য সমস্যা)',
      isEmergency: true
    },
    'member_3': {
      studentId: 'member_3',
      dateStr: '2026-09-02',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 35,
      wokeUpOnTime: false,
      morningProgramOnTime: false,
      mpLateMinutes: 15,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    }
  },

  '2026-09-03': {
    ...createDefaultDailyRecordsForDate('2026-09-03'),
    'member_7': {
      studentId: 'member_7',
      dateStr: '2026-09-03',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 20,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Academic / Urgent Exam Study (পরীক্ষার বিশেষ প্রস্তুতি)',
      isEmergency: false
    },
    'member_4': {
      studentId: 'member_4',
      dateStr: '2026-09-03',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 30,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Temple / VOICE Seva Duty (মন্দির বা ভয়েস বিশেষ সেবা)',
      isEmergency: false
    }
  },

  '2026-09-04': {
    ...createDefaultDailyRecordsForDate('2026-09-04'),
    'member_11': {
      studentId: 'member_11',
      dateStr: '2026-09-04',
      isAbsent: false,
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: false,
      morningProgramOnTime: false,
      mpLateMinutes: 10,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    },
    'member_8': {
      studentId: 'member_8',
      dateStr: '2026-09-04',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 15,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Temple / VOICE Seva Duty (মন্দির বা ভয়েস বিশেষ সেবা)',
      isEmergency: false
    },
    'member_3': {
      studentId: 'member_3',
      dateStr: '2026-09-04',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 45,
      wokeUpOnTime: false,
      morningProgramOnTime: false,
      mpLateMinutes: 25,
      mangalaratiAttended: false,
      mangalaratiReason: 'Overslept / Exhaustion (দেরিতে ঘুম ভাঙা / ক্লান্তি)',
      morningClassAttended: true,
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    }
  },

  '2026-09-05': {
    ...createDefaultDailyRecordsForDate('2026-09-05'),
    'member_6': {
      studentId: 'member_6',
      dateStr: '2026-09-05',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 20,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Academic / Urgent Exam Study (পরীক্ষার বিশেষ প্রস্তুতি)',
      isEmergency: false
    },
    'member_9': {
      studentId: 'member_9',
      dateStr: '2026-09-05',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 15,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    },
    'member_4': {
      studentId: 'member_4',
      dateStr: '2026-09-05',
      isAbsent: false,
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: false,
      morningProgramOnTime: false,
      mpLateMinutes: 15,
      mangalaratiAttended: true,
      morningClassAttended: true,
      reason: 'Late Bedtime / Overslept (দেরিতে ঘুম / ঘুম ভাঙতে বিলম্ব)',
      isEmergency: false
    }
  },

  '2026-09-06': {
    ...createDefaultDailyRecordsForDate('2026-09-06'),
    'member_7': {
      studentId: 'member_7',
      dateStr: '2026-09-06',
      isAbsent: false,
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: false,
      morningClassReason: 'University Class / Lab (বিশ্ববিদ্যালয়ের ক্লাস / ল্যাব পরীক্ষা)',
      reason: '',
      isEmergency: false
    },
    'member_3': {
      studentId: 'member_3',
      dateStr: '2026-09-06',
      isAbsent: false,
      sleptOnTime: false,
      bedLateMinutes: 20,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      morningClassAttended: false,
      morningClassReason: 'Academic Exam Prep (পরীক্ষার বিশেষ প্রস্তুতি)',
      reason: 'Academic / Urgent Exam Study (পরীক্ষার বিশেষ প্রস্তুতি)',
      isEmergency: false
    }
  },

  '2026-09-07': {
    ...createDefaultDailyRecordsForDate('2026-09-07')
  }
};
