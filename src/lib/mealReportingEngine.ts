import { 
  type MealMember, 
  type MealOverride, 
  type BazarEntry, 
  type Payment, 
  type BalanceAdjustment, 
  type MealWeight, 
  type MonthlyReport, 
  type MonthlyRow 
} from '../types/mealTypes';

export const DEFAULT_MEAL_WEIGHTS: MealWeight = {
  breakfast: 1,
  lunch: 1,
  dinner: 0.5,
};

export function getTodayInDhaka(): { year: number; month: number; day: number; monthKey: string; dateStr: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === 'year')?.value) || new Date().getFullYear();
  const month = Number(parts.find((part) => part.type === 'month')?.value) || (new Date().getMonth() + 1);
  const day = Number(parts.find((part) => part.type === 'day')?.value) || new Date().getDate();

  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`;

  return { year, month, day, monthKey, dateStr };
}

export function getMonthDateRange(monthKeyStr: string): { start: Date; end: Date; daysInMonth: number } {
  const [yearStr, monthStr] = monthKeyStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  const daysInMonth = end.getUTCDate();

  return { start, end, daysInMonth };
}

export function computeMemberMeals(
  member: MealMember,
  monthKeyStr: string,
  overrides: MealOverride[],
  weights: MealWeight = DEFAULT_MEAL_WEIGHTS
): number {
  if (member.status !== 'ACTIVE') return 0;

  const { daysInMonth } = getMonthDateRange(monthKeyStr);
  const today = getTodayInDhaka();

  if (monthKeyStr > today.monthKey) return 0;

  const maxDay = monthKeyStr === today.monthKey ? Math.min(today.day, daysInMonth) : daysInMonth;

  const overrideMap = new Map<string, MealOverride>();
  overrides
    .filter((o) => o.memberId === member.id)
    .forEach((o) => overrideMap.set(o.date, o));

  let totalMeals = 0;

  for (let d = 1; d <= maxDay; d++) {
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${monthKeyStr}-${dayStr}`;

    const override = overrideMap.get(dateStr);

    const breakfast = override ? override.breakfast : true;
    const lunch = override ? override.lunch : true;
    const dinner = override ? override.dinner : true;

    if (breakfast) totalMeals += weights.breakfast;
    if (lunch) totalMeals += weights.lunch;
    if (dinner) totalMeals += weights.dinner;
  }

  return totalMeals;
}

export function computeMonthlyReport(
  targetMonth: string,
  members: MealMember[],
  bazar: BazarEntry[],
  payments: Payment[],
  overrides: MealOverride[],
  adjustments: BalanceAdjustment[] = [],
  weights: MealWeight = DEFAULT_MEAL_WEIGHTS
): MonthlyReport {
  const monthBazarEntries = bazar.filter((b) => b.month === targetMonth);
  const totalBazar = monthBazarEntries.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const mealsByMember = new Map<string, number>();
  members.forEach((m) => {
    const meals = computeMemberMeals(m, targetMonth, overrides, weights);
    mealsByMember.set(m.id, meals);
  });

  const totalMeals = Array.from(mealsByMember.values()).reduce((sum, m) => sum + m, 0);
  const mealRate = totalMeals > 0 ? totalBazar / totalMeals : 0;

  const rows: MonthlyRow[] = members.map((member) => {
    const meals = mealsByMember.get(member.id) || 0;
    const mealCost = Math.round(meals * mealRate * 100) / 100;

    const deposits = payments
      .filter((p) => p.memberId === member.id && p.month === targetMonth)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const adjustmentTotal = adjustments
      .filter((a) => a.memberId === member.id && a.month === targetMonth)
      .reduce((sum, a) => {
        const amt = Number(a.amount) || 0;
        return sum + (a.type === 'CREDIT' ? amt : -amt);
      }, 0);

    const previousBalance = member.openingBalance || 0;
    const finalBalance = Math.round((previousBalance + deposits + adjustmentTotal - mealCost) * 100) / 100;

    let status: 'Surplus' | 'Due' | 'Clear' = 'Clear';
    if (finalBalance > 0.5) status = 'Surplus';
    else if (finalBalance < -0.5) status = 'Due';

    return {
      memberId: member.id,
      name: member.name,
      phone: member.phone,
      cycleOrder: member.cycleOrder,
      previousBalance,
      meals,
      mealCost,
      deposits,
      adjustmentTotal,
      finalBalance,
      status,
    };
  });

  const totalDeposits = rows.reduce((sum, r) => sum + r.deposits, 0);
  const totalDue = rows.filter((r) => r.finalBalance < 0).reduce((sum, r) => sum + Math.abs(r.finalBalance), 0);
  const totalSurplus = rows.filter((r) => r.finalBalance > 0).reduce((sum, r) => sum + r.finalBalance, 0);

  return {
    month: targetMonth,
    totalBazar,
    totalMeals,
    mealRate: Math.round(mealRate * 100) / 100,
    totalDeposits,
    totalDue: Math.round(totalDue * 100) / 100,
    totalSurplus: Math.round(totalSurplus * 100) / 100,
    rows,
  };
}
