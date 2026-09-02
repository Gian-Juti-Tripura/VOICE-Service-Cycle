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
  wokeUpOnTime: boolean;
  morningProgramOnTime: boolean;
  reason?: string;
  isEmergency?: boolean;
  reportedBy?: string;
  notes?: string;
}

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
