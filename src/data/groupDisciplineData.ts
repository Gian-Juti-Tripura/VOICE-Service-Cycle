export type GroupType = 'VOICE' | 'LOTUS';

export interface StudentDisciplineRecord {
  id: string;
  name: string;
  group: GroupType;
  phone?: string;
  monthlyStrikes: number; // 0 to 3
  status: 'ACTIVE' | 'WARNED' | 'DEMOTION_DUE' | 'DISMISSED';
}

export interface DailyDisciplineEntry {
  studentId: string;
  dateStr: string; // YYYY-MM-DD
  sleptOnTime: boolean;
  wokeUpOnTime: boolean;
  morningProgramOnTime: boolean;
  reason?: string;
  isEmergency?: boolean;
  reportedBy?: string;
  notes?: string;
}

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
  // VOICE Group (Bed: <10:00 PM, Wake: 4:00 AM, MP: <4:30 AM)
  { id: 'std_1', name: 'Utpol P.', group: 'VOICE', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_2', name: 'Chaitanya P.', group: 'VOICE', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_3', name: 'Bishwajit P.', group: 'VOICE', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_4', name: 'Joy P.', group: 'VOICE', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_5', name: 'Joydev P.', group: 'VOICE', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_6', name: 'Sagar P.', group: 'VOICE', monthlyStrikes: 0, status: 'ACTIVE' },

  // Lotus Group (Bed: <11:00 PM, MP: <5:00 AM)
  { id: 'std_7', name: 'Alok P.', group: 'LOTUS', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_8', name: 'Deep P.', group: 'LOTUS', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_9', name: 'Ripon P.', group: 'LOTUS', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_10', name: 'Tushar P.', group: 'LOTUS', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_11', name: 'Proloy P.', group: 'LOTUS', monthlyStrikes: 0, status: 'ACTIVE' },
  { id: 'std_12', name: 'Gouranga P.', group: 'LOTUS', monthlyStrikes: 0, status: 'ACTIVE' },
];
