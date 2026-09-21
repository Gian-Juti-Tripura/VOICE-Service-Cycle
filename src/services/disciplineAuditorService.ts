import { supabase } from '../supabase/supabaseClient';
import type { DisciplineAuditorRole } from '../data/groupDisciplineData';

export interface DisciplineAuditorAssignment {
  id: string;
  email: string;
  name: string;
  role: DisciplineAuditorRole;
  assignedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const STORAGE_AUDITOR_ASSIGNMENTS_KEY = 'voice_discipline_auditor_assignments_v1';

// Master Admin emails that unconditionally have ADMIN rights
export const MASTER_ADMIN_EMAILS = [
  'gianjuti.csecu@gmail.com',
  'gianjyoti.cse.cu@gmail.com',
  'rasvihari.voice@gmail.com'
];

export const INITIAL_AUDITOR_ASSIGNMENTS: DisciplineAuditorAssignment[] = [
  {
    id: 'assign_admin_gian',
    email: 'gianjuti.csecu@gmail.com',
    name: 'Gian Juti Tripura (Admin)',
    role: 'ADMIN',
    assignedBy: 'System',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'assign_admin_ras',
    email: 'rasvihari.voice@gmail.com',
    name: 'Rasvihari Das (Admin)',
    role: 'ADMIN',
    assignedBy: 'System',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'assign_morning_dipen',
    email: 'dipendranath.roy@gmail.com',
    name: 'Dipendranath Roy (Dipen P.)',
    role: 'MORNING_INCHARGE',
    assignedBy: 'Gian Juti (Admin)',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'assign_security_sanga',
    email: 'sangakara.das@gmail.com',
    name: 'Sangakara Das (Sanga P.)',
    role: 'SECURITY_MANAGER',
    assignedBy: 'Gian Juti (Admin)',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z'
  }
];

export const isMasterAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return MASTER_ADMIN_EMAILS.includes(normalized);
};

export const getCachedAuditorAssignments = (): DisciplineAuditorAssignment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_AUDITOR_ASSIGNMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached auditor assignments:', err);
  }
  return INITIAL_AUDITOR_ASSIGNMENTS;
};

export const setCachedAuditorAssignments = (assignments: DisciplineAuditorAssignment[]): void => {
  try {
    localStorage.setItem(STORAGE_AUDITOR_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Failed to cache auditor assignments:', err);
  }
};

export const getAuditorAssignments = async (): Promise<DisciplineAuditorAssignment[]> => {
  const currentList = getCachedAuditorAssignments();

  try {
    const { data, error } = await supabase
      .from('discipline_auditor_assignments')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: DisciplineAuditorAssignment[] = data.map((item: any) => ({
        id: item.id,
        email: item.email?.trim().toLowerCase(),
        name: item.name,
        role: item.role as DisciplineAuditorRole,
        assignedBy: item.assigned_by,
        isActive: item.is_active ?? true,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      setCachedAuditorAssignments(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase auditor assignments fetch error (using local cache):', err);
  }

  return currentList;
};

export const saveAuditorAssignment = async (
  item: Omit<DisciplineAuditorAssignment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<DisciplineAuditorAssignment> => {
  const normalizedEmail = item.email.trim().toLowerCase();
  const id = item.id || ('assign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
  const now = new Date().toISOString();

  const newAssignment: DisciplineAuditorAssignment = {
    id,
    email: normalizedEmail,
    name: item.name.trim(),
    role: item.role,
    assignedBy: item.assignedBy || 'Admin',
    isActive: item.isActive ?? true,
    createdAt: now,
    updatedAt: now
  };

  const current = getCachedAuditorAssignments();
  const existingIdx = current.findIndex(a => a.id === id || a.email.toLowerCase() === normalizedEmail);
  let updatedList: DisciplineAuditorAssignment[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...newAssignment,
      createdAt: updatedList[existingIdx].createdAt,
      updatedAt: now
    };
  } else {
    updatedList = [...current, newAssignment];
  }

  setCachedAuditorAssignments(updatedList);

  try {
    await supabase.from('discipline_auditor_assignments').upsert({
      id: newAssignment.id,
      email: newAssignment.email,
      name: newAssignment.name,
      role: newAssignment.role,
      assigned_by: newAssignment.assignedBy,
      is_active: newAssignment.isActive,
      updated_at: now
    });
  } catch (err) {
    console.warn('Supabase upsert auditor assignment error:', err);
  }

  return newAssignment;
};

export const deleteAuditorAssignment = async (id: string): Promise<boolean> => {
  const current = getCachedAuditorAssignments();
  const updatedList = current.filter(a => a.id !== id);
  setCachedAuditorAssignments(updatedList);

  try {
    await supabase.from('discipline_auditor_assignments').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete auditor assignment error:', err);
  }

  return true;
};

export const getAuditorRoleForEmail = (
  email: string | null | undefined,
  assignments?: DisciplineAuditorAssignment[]
): DisciplineAuditorRole => {
  if (!email) return 'VIEWER';
  const normalized = email.trim().toLowerCase();

  if (isMasterAdmin(normalized)) {
    return 'ADMIN';
  }

  const list = assignments || getCachedAuditorAssignments();
  const found = list.find(a => a.email.trim().toLowerCase() === normalized && a.isActive);

  if (found) {
    return found.role;
  }

  return 'VIEWER';
};
