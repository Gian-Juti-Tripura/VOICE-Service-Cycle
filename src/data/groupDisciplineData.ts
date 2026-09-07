export type GroupType = 'VOICE' | 'LOTUS';

export interface StudentDisciplineRecord {
  id: string;
  name: string;
  group: GroupType;
  phone?: string;
  cycleOrder?: number;
  monthlyStrikes: number; // 0 to 3
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
  { id: 'member_6', name: 'ANKON P.', group: 'VOICE', phone: '01933503979', cycleOrder: 7, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_7', name: 'ANTOR P.', group: 'VOICE', phone: '+880 1704-370139', cycleOrder: 8, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_8', name: 'ROTON P.', group: 'VOICE', phone: '+880 1750-504601', cycleOrder: 9, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_9', name: 'JOY S. P.', group: 'VOICE', phone: '+880 1734-550288', cycleOrder: 10, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_10', name: 'JOYKANT P.', group: 'VOICE', phone: '+880 1754-034183', cycleOrder: 11, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_11', name: 'BAPPI C. P.', group: 'VOICE', cycleOrder: 12, monthlyStrikes: 0, status: 'ACTIVE' },

  // Lotus Group (Only Sangakara Das and Pranto C Das)
  { id: 'member_3', name: 'PRANTO P. (Pranto C Das)', group: 'LOTUS', phone: '+880 1609-302008', cycleOrder: 4, monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'member_4', name: 'SANGA P. (Sangakara Das)', group: 'LOTUS', phone: '+880 1722-711849', cycleOrder: 5, monthlyStrikes: 0, status: 'ACTIVE' },
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

// Initial Seed Data for September 1 to September 7, 2026
export const INITIAL_DAILY_DISCIPLINE_RECORDS: Record<string, Record<string, DailyDisciplineEntry>> = {
  '2026-09-01': createDefaultDailyRecordsForDate('2026-09-01'),
  '2026-09-02': createDefaultDailyRecordsForDate('2026-09-02'),
  '2026-09-03': createDefaultDailyRecordsForDate('2026-09-03'),
  '2026-09-04': createDefaultDailyRecordsForDate('2026-09-04'),
  '2026-09-05': createDefaultDailyRecordsForDate('2026-09-05'),
  '2026-09-06': createDefaultDailyRecordsForDate('2026-09-06'),
  '2026-09-07': createDefaultDailyRecordsForDate('2026-09-07')
};
