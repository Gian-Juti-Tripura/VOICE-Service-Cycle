import { supabase } from '../supabase/supabaseClient';
import { 
  type StudentDisciplineRecord, 
  type DailyDisciplineEntry, 
  type GroupType,
  INITIAL_DISCIPLINE_STUDENTS, 
  INITIAL_DAILY_DISCIPLINE_RECORDS 
} from '../data/groupDisciplineData';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v6';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v6';
const STORAGE_MIGRATED_KEY = 'advaita_discipline_supabase_migrated_v1';

export interface ExtendedDailyMeta {
  isAbsent?: boolean;
  absenceReason?: string;
  bedLateMinutes?: number;
  mpLateMinutes?: number;
  mangalaratiAttended?: boolean;
  mangalaratiReason?: string;
  morningClassAttended?: boolean;
  morningClassReason?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export const cleanStudentName = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return '';
  return name.replace(/\s*\(Pranto C Das\)/gi, '').replace(/\s*\(Sangakara Das\)/gi, '').trim();
};

/**
 * Read cached students from LocalStorage (instant 0ms startup)
 */
export function getCachedDisciplineStudents(): StudentDisciplineRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_STUDENTS_KEY);
    const list: StudentDisciplineRecord[] = saved ? JSON.parse(saved) : INITIAL_DISCIPLINE_STUDENTS;
    return (Array.isArray(list) ? list : INITIAL_DISCIPLINE_STUDENTS).map(s => ({
      ...s,
      name: cleanStudentName(s?.name)
    }));
  } catch {
    return INITIAL_DISCIPLINE_STUDENTS.map(s => ({
      ...s,
      name: cleanStudentName(s.name)
    }));
  }
}

/**
 * Read cached daily logs from LocalStorage (instant 0ms startup)
 */
export function getCachedDailyRecords(): Record<string, Record<string, DailyDisciplineEntry>> {
  try {
    const saved = localStorage.getItem(STORAGE_DAILY_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...INITIAL_DAILY_DISCIPLINE_RECORDS, ...parsed };
  } catch {
    return INITIAL_DAILY_DISCIPLINE_RECORDS;
  }
}

/**
 * Fetch all students from Supabase `discipline_students` table
 * Immediately syncs to LocalStorage so local matches Supabase
 */
export async function fetchDisciplineStudents(): Promise<StudentDisciplineRecord[]> {
  try {
    const { data, error } = await supabase
      .from('discipline_students')
      .select('*')
      .order('cycle_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getCachedDisciplineStudents();
    }

    const students: StudentDisciplineRecord[] = data.map(row => ({
      id: String(row.id),
      name: cleanStudentName(row.name),
      group: (row.group_type as GroupType) || 'VOICE',
      phone: row.phone || '',
      cycleOrder: row.cycle_order ?? 0,
      monthlyStrikes: row.monthly_strikes ?? 0,
      status: (row.status as StudentDisciplineRecord['status']) || 'ACTIVE',
    }));

    // Cache locally so local storage immediately reflects Supabase
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.warn('LocalStorage quota or write error for students:', e);
    }
    return students;
  } catch (err) {
    console.warn('Failed to fetch students from Supabase, using local cache:', err);
    return getCachedDisciplineStudents();
  }
}

/**
 * Save / Upsert students into Supabase `discipline_students` table
 */
export async function saveDisciplineStudents(students: StudentDisciplineRecord[]): Promise<void> {
  // Update local cache immediately
  try {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.warn('LocalStorage quota or write error on save students:', e);
  }

  try {
    const rows = students.map(s => ({
      id: s.id,
      name: cleanStudentName(s.name),
      group_type: s.group,
      phone: s.phone || null,
      cycle_order: s.cycleOrder ?? 0,
      monthly_strikes: s.monthlyStrikes ?? 0,
      status: s.status,
    }));

    await supabase.from('discipline_students').upsert(rows);
  } catch (err) {
    console.error('Failed to sync students to Supabase:', err);
  }
}

/**
 * Update single student's strikes and status in Supabase
 */
export async function updateStudentStrikesInCloud(
  studentId: string, 
  monthlyStrikes: number, 
  status: StudentDisciplineRecord['status'],
  group?: GroupType
): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = {
      monthly_strikes: monthlyStrikes,
      status: status
    };
    if (group) {
      updatePayload.group_type = group;
    }

    const { error } = await supabase
      .from('discipline_students')
      .update(updatePayload)
      .eq('id', studentId);

    if (error) {
      console.warn('Could not update strikes in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error updating student strikes in cloud:', err);
    return false;
  }
}

/**
 * Fetch all daily discipline logs from Supabase `daily_discipline_logs`
 * Supabase is the primary truth: updates local storage to mirror Supabase
 */
export async function fetchDailyDisciplineLogs(): Promise<Record<string, Record<string, DailyDisciplineEntry>>> {
  try {
    const { data, error } = await supabase
      .from('daily_discipline_logs')
      .select('*')
      .order('date_str', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase fetch error for daily_discipline_logs:', error.message);
      return getCachedDailyRecords();
    }

    const records: Record<string, Record<string, DailyDisciplineEntry>> = {};

    data.forEach(row => {
      let extra: ExtendedDailyMeta = {};
      if (row.notes) {
        try {
          extra = typeof row.notes === 'string' ? JSON.parse(row.notes) : row.notes;
        } catch {
          extra = {};
        }
      }

      const dateStr = typeof row.date_str === 'string' ? row.date_str.split('T')[0] : String(row.date_str);
      const studentId = String(row.student_id);

      if (!records[dateStr]) {
        records[dateStr] = {};
      }

      records[dateStr][studentId] = {
        studentId,
        dateStr,
        sleptOnTime: Boolean(row.slept_on_time),
        wokeUpOnTime: Boolean(row.woke_up_on_time),
        morningProgramOnTime: Boolean(row.morning_program_on_time),
        reason: row.reason || '',
        isEmergency: Boolean(row.is_emergency),
        isAbsent: Boolean(extra.isAbsent),
        absenceReason: extra.absenceReason || '',
        bedLateMinutes: typeof extra.bedLateMinutes === 'number' ? extra.bedLateMinutes : 0,
        mpLateMinutes: typeof extra.mpLateMinutes === 'number' ? extra.mpLateMinutes : 0,
        mangalaratiAttended: extra.mangalaratiAttended !== undefined ? Boolean(extra.mangalaratiAttended) : !Boolean(extra.isAbsent),
        mangalaratiReason: extra.mangalaratiReason || '',
        morningClassAttended: extra.morningClassAttended !== undefined ? Boolean(extra.morningClassAttended) : !Boolean(extra.isAbsent),
        morningClassReason: extra.morningClassReason || '',
      };
    });

    // Save consolidated records to local storage so local storage directly reflects Supabase
    try {
      localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('LocalStorage quota or write error on saving daily logs:', e);
    }
    return records;
  } catch (err) {
    console.warn('Failed to load logs from Supabase, falling back to cache:', err);
    return getCachedDailyRecords();
  }
}

/**
 * Delete student and their discipline logs from Supabase
 */
export async function deleteStudentFromCloud(studentId: string): Promise<boolean> {
  try {
    await supabase.from('discipline_students').delete().eq('id', studentId);
    await supabase.from('daily_discipline_logs').delete().eq('student_id', studentId);
    return true;
  } catch (err) {
    console.error('Failed to delete student from Supabase:', err);
    return false;
  }
}

/**
 * Save / Upsert single daily discipline entry to Supabase
 */
export async function saveDailyDisciplineEntryToCloud(
  entry: DailyDisciplineEntry, 
  reportedBy?: string
): Promise<boolean> {
  try {
    const extraMeta: ExtendedDailyMeta = {
      isAbsent: entry.isAbsent,
      absenceReason: entry.absenceReason,
      bedLateMinutes: entry.bedLateMinutes || 0,
      mpLateMinutes: entry.mpLateMinutes || 0,
      mangalaratiAttended: entry.mangalaratiAttended,
      mangalaratiReason: entry.mangalaratiReason,
      morningClassAttended: entry.morningClassAttended,
      morningClassReason: entry.morningClassReason,
      updatedBy: reportedBy || 'Incharge',
      updatedAt: new Date().toISOString()
    };

    const row = {
      student_id: entry.studentId,
      date_str: entry.dateStr,
      slept_on_time: entry.sleptOnTime,
      woke_up_on_time: entry.wokeUpOnTime,
      morning_program_on_time: entry.morningProgramOnTime,
      reason: entry.reason || null,
      is_emergency: Boolean(entry.isEmergency),
      reported_by: reportedBy || null,
      notes: JSON.stringify(extraMeta)
    };

    const { error } = await supabase
      .from('daily_discipline_logs')
      .upsert(row, { onConflict: 'student_id,date_str' });

    if (error) {
      console.warn('Supabase upsert error for daily log:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to sync daily log to Supabase:', err);
    return false;
  }
}

/**
 * Bulk Save / Upsert multiple daily discipline entries (e.g. Mark All On-Time)
 */
export async function saveBulkDailyDisciplineEntriesToCloud(
  entries: DailyDisciplineEntry[], 
  reportedBy?: string
): Promise<boolean> {
  if (entries.length === 0) return true;

  try {
    const nowIso = new Date().toISOString();
    const rows = entries.map(entry => {
      const extraMeta: ExtendedDailyMeta = {
        isAbsent: entry.isAbsent,
        absenceReason: entry.absenceReason,
        bedLateMinutes: entry.bedLateMinutes || 0,
        mpLateMinutes: entry.mpLateMinutes || 0,
        mangalaratiAttended: entry.mangalaratiAttended,
        mangalaratiReason: entry.mangalaratiReason,
        morningClassAttended: entry.morningClassAttended,
        morningClassReason: entry.morningClassReason,
        updatedBy: reportedBy || 'Incharge',
        updatedAt: nowIso
      };

      return {
        student_id: entry.studentId,
        date_str: entry.dateStr,
        slept_on_time: entry.sleptOnTime,
        woke_up_on_time: entry.wokeUpOnTime,
        morning_program_on_time: entry.morningProgramOnTime,
        reason: entry.reason || null,
        is_emergency: Boolean(entry.isEmergency),
        reported_by: reportedBy || null,
        notes: JSON.stringify(extraMeta)
      };
    });

    const { error } = await supabase
      .from('daily_discipline_logs')
      .upsert(rows, { onConflict: 'student_id,date_str' });

    if (error) {
      console.warn('Bulk upsert error for daily logs:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to bulk sync daily logs to Supabase:', err);
    return false;
  }
}

/**
 * Migration Helper: Push initial baseline and cached local entries to Supabase
 * Runs once automatically to ensure zero data loss across devices.
 */
export async function autoMigrateLocalDataToSupabase(): Promise<void> {
  try {
    let isAlreadyMigrated = false;
    try {
      isAlreadyMigrated = Boolean(localStorage.getItem(STORAGE_MIGRATED_KEY));
    } catch {}
    if (isAlreadyMigrated) return;

    // Check count of existing logs in Supabase
    const { count, error } = await supabase
      .from('daily_discipline_logs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Could not verify daily_discipline_logs count:', error.message);
      return;
    }

    // If Supabase already has records, mark migrated
    if (typeof count === 'number' && count > 0) {
      try {
        localStorage.setItem(STORAGE_MIGRATED_KEY, 'true');
      } catch {}
      return;
    }

    // Gather all local entries
    const cached = getCachedDailyRecords();
    const allEntriesToSeed: DailyDisciplineEntry[] = [];

    Object.keys(cached).forEach(dateStr => {
      const dayData = cached[dateStr];
      if (dayData) {
        Object.values(dayData).forEach(entry => {
          allEntriesToSeed.push(entry);
        });
      }
    });

    if (allEntriesToSeed.length > 0) {
      console.log(`Seeding ${allEntriesToSeed.length} baseline discipline records to Supabase...`);
      await saveBulkDailyDisciplineEntriesToCloud(allEntriesToSeed, 'System Seeder');
    }

    try {
      localStorage.setItem(STORAGE_MIGRATED_KEY, 'true');
    } catch {}
  } catch (err) {
    console.error('Auto migration failed:', err);
  }
}
