export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type PaymentMethod = 'CASH' | 'BKASH' | 'NAGAD' | 'BANK' | 'OTHER';

export type AdjustmentType = 'CREDIT' | 'DEBIT';

export type BazarCategory = 
  | 'VEGETABLES' 
  | 'GRAINS_DAL' 
  | 'DAIRY_GHEE' 
  | 'SPICES_OIL' 
  | 'GAS_FUEL' 
  | 'CLEANING' 
  | 'FEAST_SPECIAL'
  | 'OTHER';

export interface MealMember {
  id: string;
  name: string;
  phone?: string;
  cycleOrder?: number;
  openingBalance: number;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string; // YYYY-MM-DD
  leaveDate?: string;
  notes?: string;
}

export interface MealOverride {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  isGuest?: boolean;
  guestCount?: number;
  isEkadashiFasting?: boolean;
  notes?: string;
}

export interface BazarEntry {
  id: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  buyer: string;
  category: BazarCategory;
  items: string;
  amount: number;
  receiptImage?: string;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  method: PaymentMethod;
  trxId?: string;
  note?: string;
  receivedBy?: string;
  createdAt: string;
}

export interface BalanceAdjustment {
  id: string;
  memberId: string;
  amount: number;
  type: AdjustmentType;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  note?: string;
  createdAt: string;
}

export interface MealWeight {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface MonthlyRow {
  memberId: string;
  name: string;
  phone?: string;
  cycleOrder?: number;
  previousBalance: number;
  meals: number;
  mealCost: number;
  deposits: number;
  adjustmentTotal: number;
  finalBalance: number;
  status: 'Surplus' | 'Due' | 'Clear';
}

export interface MonthlyReport {
  month: string; // YYYY-MM
  totalBazar: number;
  totalMeals: number;
  mealRate: number;
  totalDeposits: number;
  totalDue: number;
  totalSurplus: number;
  rows: MonthlyRow[];
}
