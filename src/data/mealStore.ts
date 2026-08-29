import { 
  type MealMember, 
  type MealOverride, 
  type BazarEntry, 
  type MealWeight,
  type Payment,
  type BazarCategory
} from '../types/mealTypes';
import { DEFAULT_MEAL_WEIGHTS } from '../lib/mealReportingEngine';

export const STORAGE_MEAL_MEMBERS = 'advaita_meal_members_v1';
export const STORAGE_MEAL_OVERRIDES = 'advaita_meal_overrides_v1';
export const STORAGE_MEAL_BAZAR = 'advaita_meal_bazar_v1';
export const STORAGE_MEAL_PAYMENTS = 'advaita_meal_payments_v1';
export const STORAGE_MEAL_WEIGHTS = 'advaita_meal_weights_v1';

export const INITIAL_MEAL_MEMBERS: MealMember[] = [
  { id: 'member_0', name: 'UTPOL P.', phone: '+880 1790-839891', cycleOrder: 1, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_1', name: 'CHAITANYA P.', phone: '+880 1331-982443', cycleOrder: 2, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_2', name: 'GIAN P.', phone: '+8801571328549', cycleOrder: 3, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_3', name: 'PRANTO P.', phone: '+880 1609-302008', cycleOrder: 4, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_4', name: 'SANGA P.', phone: '+880 1722-711849', cycleOrder: 5, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_5', name: 'DIPEN P.', phone: '01571422381', cycleOrder: 6, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_6', name: 'ANKON P.', phone: '01933503979', cycleOrder: 7, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_7', name: 'ANTOR P.', phone: '+880 1704-370139', cycleOrder: 8, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_8', name: 'ROTON P.', phone: '+880 1750-504601', cycleOrder: 9, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_9', name: 'JOY S. P.', phone: '+880 1734-550288', cycleOrder: 10, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_10', name: 'JOYKANT P.', phone: '+880 1754-034183', cycleOrder: 11, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
  { id: 'member_11', name: 'BAPPI C. P.', cycleOrder: 12, openingBalance: 0, status: 'ACTIVE', joinDate: '2026-01-01' },
];

export const INITIAL_SAMPLE_BAZAR: BazarEntry[] = [
  {
    id: 'bz_1',
    date: '2026-08-28',
    month: '2026-08',
    buyer: 'Utpol P.',
    category: 'VEGETABLES',
    items: 'Alu 5kg, Potol 2kg, Begun 1kg, Tomato 1kg, Dhonepata',
    amount: 540,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bz_2',
    date: '2026-08-27',
    month: '2026-08',
    buyer: 'Chaitanya P.',
    category: 'GRAINS_DAL',
    items: 'Miniket Chal 25kg, Moshur Dal 2kg, Mug Dal 1kg',
    amount: 2150,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bz_3',
    date: '2026-08-26',
    month: '2026-08',
    buyer: 'Gian P.',
    category: 'DAIRY_GHEE',
    items: 'Shuddho Ghee 1kg, Kacha Dudh 5L',
    amount: 1450,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SAMPLE_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    memberId: 'member_0',
    amount: 1500,
    date: '2026-08-05',
    month: '2026-08',
    method: 'BKASH',
    trxId: 'BKS9823412',
    note: 'August Advance Meal Payment',
    createdAt: new Date().toISOString()
  },
  {
    id: 'pay_2',
    memberId: 'member_1',
    amount: 2000,
    date: '2026-08-06',
    month: '2026-08',
    method: 'CASH',
    note: 'Cash deposit to Manager',
    createdAt: new Date().toISOString()
  }
];

export const BAZAR_CATEGORIES_INFO: Record<BazarCategory, { labelEn: string; labelBn: string; color: string }> = {
  VEGETABLES: { labelEn: 'Vegetables', labelBn: 'সবজি ও শাক', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  GRAINS_DAL: { labelEn: 'Grains & Dal', labelBn: 'চাল ও ডাল', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  DAIRY_GHEE: { labelEn: 'Milk & Ghee', labelBn: 'দুধ ও ঘি', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
  SPICES_OIL: { labelEn: 'Spices & Oil', labelBn: 'তেল ও মশলা', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  GAS_FUEL: { labelEn: 'Gas & Fuel', labelBn: 'গ্যাস ও জ্বালানি', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  CLEANING: { labelEn: 'Cleaning', labelBn: 'পরিষ্কার সামগ্রী', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  FEAST_SPECIAL: { labelEn: 'Feast Special', labelBn: 'মহোৎসব স্পেশাল', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  OTHER: { labelEn: 'Other', labelBn: 'অন্যান্য', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' },
};

// Store getters and setters
export function getStoredMealMembers(): MealMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEAL_MEMBERS);
    return raw ? JSON.parse(raw) : INITIAL_MEAL_MEMBERS;
  } catch {
    return INITIAL_MEAL_MEMBERS;
  }
}

export function saveStoredMealMembers(members: MealMember[]): void {
  localStorage.setItem(STORAGE_MEAL_MEMBERS, JSON.stringify(members));
}

export function getStoredMealOverrides(): MealOverride[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEAL_OVERRIDES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredMealOverrides(overrides: MealOverride[]): void {
  localStorage.setItem(STORAGE_MEAL_OVERRIDES, JSON.stringify(overrides));
}

export function getStoredBazar(): BazarEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEAL_BAZAR);
    return raw ? JSON.parse(raw) : INITIAL_SAMPLE_BAZAR;
  } catch {
    return INITIAL_SAMPLE_BAZAR;
  }
}

export function saveStoredBazar(bazar: BazarEntry[]): void {
  localStorage.setItem(STORAGE_MEAL_BAZAR, JSON.stringify(bazar));
}

export function getStoredPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEAL_PAYMENTS);
    return raw ? JSON.parse(raw) : INITIAL_SAMPLE_PAYMENTS;
  } catch {
    return INITIAL_SAMPLE_PAYMENTS;
  }
}

export function saveStoredPayments(payments: Payment[]): void {
  localStorage.setItem(STORAGE_MEAL_PAYMENTS, JSON.stringify(payments));
}

export function getStoredWeights(): MealWeight {
  try {
    const raw = localStorage.getItem(STORAGE_MEAL_WEIGHTS);
    return raw ? JSON.parse(raw) : DEFAULT_MEAL_WEIGHTS;
  } catch {
    return DEFAULT_MEAL_WEIGHTS;
  }
}

export function saveStoredWeights(weights: MealWeight): void {
  localStorage.setItem(STORAGE_MEAL_WEIGHTS, JSON.stringify(weights));
}
