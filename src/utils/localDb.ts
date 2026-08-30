import { supabase } from '../supabase/supabaseClient';
import type { Member, ServiceDefinition, AssignmentOverride } from '../types';

export interface SadhanaLogRecord {
  id?: string;
  userId?: string;
  memberId?: string;
  logDate: string;
  scaleId: number;
  bodyScore: number;
  bodyAvg: number;
  soulScore: number;
  soulAvg: number;
  sevaScore: number;
  othersScore: number;
  grandTotal: number;
  percentage: number;
  toBedTime?: string;
  wakeUpTime?: string;
  daySleepMin?: number;
  japaFinishTime?: string;
  spBookReadingMin?: number;
  lectureHearingMin?: number;
  studyAcademicMin?: number;
  cleaningDone?: boolean;
  followUpCount?: number;
  btgCount?: number;
  notes?: string;
  counselorFeedback?: string;
  isVerified?: boolean;
}

export interface DepartmentTaskRecord {
  id: string;
  departmentId: string;
  title: string;
  description?: string;
  inchargeName: string;
  isDone: boolean;
  dueDate?: string;
}

export interface AnnouncementRecord {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  type: 'SEVA' | 'EKADASHI' | 'STUDY' | 'ANNOUNCEMENT';
  isPinned: boolean;
  createdAt: string;
}

export const localDb = {
  // Members
  getMembers: async (): Promise<Member[]> => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('cycle_order', { ascending: true });
        
      if (error) throw new Error(error.message);
      
      // Filter strictly for the 12 active student devotees (excluding Counselor / Mentor)
      const members = data
        .filter((m: any) => m.is_active !== false && m.role !== 'ADMIN' && m.id !== 'dev_caretaker' && m.cycle_order >= 0)
        .map((m: any) => ({
          id: m.id,
          fullName: m.full_name,
          phone: m.phone,
          dob: m.dob,
          userId: m.user_id,
          isActive: m.is_active,
          cycleOrder: m.cycle_order,
          createdAt: m.created_at,
          updatedAt: m.updated_at
        }))
        .sort((a: any, b: any) => a.cycleOrder - b.cycleOrder)
        .slice(0, 12); // Exactly 12 active students

      localStorage.setItem('voice_cached_members', JSON.stringify(members));
      return members;
    } catch {
      const cached = localStorage.getItem('voice_cached_members');
      return cached ? JSON.parse(cached) : [];
    }
  },
  
  saveMembers: async (members: Member[]): Promise<void> => {
    localStorage.setItem('voice_cached_members', JSON.stringify(members));
    const records = members.map(m => ({
      id: m.id,
      full_name: m.fullName,
      phone: m.phone,
      dob: m.dob,
      user_id: m.userId,
      is_active: m.isActive,
      cycle_order: m.cycleOrder,
      created_at: m.createdAt,
      updated_at: m.updatedAt
    }));
    
    await supabase.from('members').upsert(records);
  },
  
  getMember: async (id: string): Promise<Member | null> => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) return null;
      
      return {
        id: data.id,
        fullName: data.full_name,
        phone: data.phone,
        dob: data.dob,
        userId: data.user_id,
        isActive: data.is_active,
        cycleOrder: data.cycle_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch {
      const members = await localDb.getMembers();
      return members.find(m => m.id === id) || null;
    }
  },
  
  saveMember: async (member: Member): Promise<void> => {
    await supabase.from('members').upsert({
      id: member.id,
      full_name: member.fullName,
      phone: member.phone,
      dob: member.dob,
      user_id: member.userId,
      is_active: member.isActive,
      cycle_order: member.cycleOrder,
      created_at: member.createdAt,
      updated_at: member.updatedAt
    });
  },
  
  // Services
  getServices: async (): Promise<ServiceDefinition[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) throw new Error(error.message);
      
      // Filter strictly for the 12 active physical seva cycle slots (IDs 1 to 12)
      const services = data
        .filter((s: any) => s.is_active !== false && parseInt(s.id) >= 1 && parseInt(s.id) <= 12)
        .map((s: any) => ({
          id: s.id,
          nameBn: s.name_bn,
          nameEn: s.name_en,
          descBn: s.desc_bn,
          descEn: s.desc_en,
          timing: s.timing,
          isActive: s.is_active
        }))
        .sort((a: any, b: any) => parseInt(a.id) - parseInt(b.id));

      localStorage.setItem('voice_cached_services', JSON.stringify(services));
      return services;
    } catch {
      const cached = localStorage.getItem('voice_cached_services');
      return cached ? JSON.parse(cached) : [];
    }
  },
  
  saveServices: async (services: ServiceDefinition[]): Promise<void> => {
    localStorage.setItem('voice_cached_services', JSON.stringify(services));
    const records = services.map(s => ({
      id: s.id,
      name_bn: s.nameBn,
      name_en: s.nameEn,
      desc_bn: s.descBn,
      desc_en: s.descEn,
      timing: s.timing,
      is_active: s.isActive
    }));
    
    await supabase.from('services').upsert(records);
  },

  getService: async (id: string): Promise<ServiceDefinition | null> => {
    const services = await localDb.getServices();
    return services.find(s => s.id === id) || null;
  },
  
  saveService: async (service: ServiceDefinition): Promise<void> => {
    await supabase.from('services').upsert({
      id: service.id,
      name_bn: service.nameBn,
      name_en: service.nameEn,
      desc_bn: service.descBn,
      desc_en: service.descEn,
      timing: service.timing,
      is_active: service.isActive
    });
  },

  deleteService: async (id: string): Promise<void> => {
    await supabase.from('assignment_overrides').delete().eq('service_id', id);
    await supabase.from('services').delete().eq('id', id);
  },

  deleteMember: async (id: string): Promise<void> => {
    await supabase.from('assignment_overrides').delete().eq('member_id', id);
    await supabase.from('assignment_overrides').delete().eq('replacement_member_id', id);
    await supabase.from('members').delete().eq('id', id);

    const members = await localDb.getMembers();
    for (let i = 0; i < members.length; i++) {
      members[i].cycleOrder = i;
      members[i].updatedAt = new Date().toISOString();
    }
    
    if (members.length > 0) {
      await localDb.saveMembers(members);
    }
  },

  // Overrides
  getOverridesByDate: async (dateStr: string): Promise<AssignmentOverride[]> => {
    try {
      const { data, error } = await supabase
        .from('assignment_overrides')
        .select('*')
        .in('date_str', [dateStr, 'CONTINUOUS']);
        
      if (error) throw new Error(error.message);
      
      return data.map((o: any) => ({
        id: o.id,
        dateStr: o.date_str,
        memberId: o.member_id,
        serviceId: o.service_id,
        status: o.status,
        absenceReason: o.absence_reason,
        replacementMemberId: o.replacement_member_id,
        managerId: o.manager_id,
        timestamp: o.timestamp
      }));
    } catch {
      return [];
    }
  },
  
  getOverridesByDateRange: async (dateStrs: string[]): Promise<AssignmentOverride[]> => {
    try {
      const { data, error } = await supabase
        .from('assignment_overrides')
        .select('*')
        .in('date_str', [...dateStrs, 'CONTINUOUS']);
        
      if (error) throw new Error(error.message);
      
      return data.map((o: any) => ({
        id: o.id,
        dateStr: o.date_str,
        memberId: o.member_id,
        serviceId: o.service_id,
        status: o.status,
        absenceReason: o.absence_reason,
        replacementMemberId: o.replacement_member_id,
        managerId: o.manager_id,
        timestamp: o.timestamp
      }));
    } catch {
      return [];
    }
  },
  
  saveOverride: async (override: AssignmentOverride): Promise<void> => {
    await supabase.from('assignment_overrides').upsert({
      id: override.id,
      date_str: override.dateStr,
      member_id: override.memberId,
      service_id: override.serviceId,
      status: override.status,
      absence_reason: override.absenceReason,
      replacement_member_id: override.replacementMemberId,
      manager_id: override.managerId,
      timestamp: override.timestamp
    });
  },

  deleteOverride: async (id: string): Promise<void> => {
    await supabase.from('assignment_overrides').delete().eq('id', id);
  },

  // Sadhana Logs
  saveSadhanaLog: async (log: SadhanaLogRecord): Promise<void> => {
    localStorage.setItem(`voice_sadhana_${log.logDate}`, JSON.stringify(log));
    try {
      await supabase.from('sadhana_logs').upsert({
        log_date: log.logDate,
        scale_id: log.scaleId,
        body_score: log.bodyScore,
        body_avg: log.bodyAvg,
        soul_score: log.soulScore,
        soul_avg: log.soulAvg,
        seva_score: log.sevaScore,
        others_score: log.othersScore,
        grand_total: log.grandTotal,
        percentage: log.percentage,
        to_bed_time: log.toBedTime,
        wake_up_time: log.wakeUpTime,
        day_sleep_min: log.daySleepMin,
        japa_finish_time: log.japaFinishTime,
        study_academic_min: log.studyAcademicMin,
        notes: log.notes
      });
    } catch (e) {
      console.warn("Supabase offline, saved to local cache", e);
    }
  },

  // Department Tasks
  getDepartmentTasks: async (departmentId: string): Promise<DepartmentTaskRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('department_tasks')
        .select('*')
        .eq('department_id', departmentId)
        .order('created_at', { ascending: true });

      if (error || !data) throw new Error();
      return data.map((t: any) => ({
        id: t.id,
        departmentId: t.department_id,
        title: t.title,
        description: t.description,
        inchargeName: t.incharge_name,
        isDone: t.is_done,
        dueDate: t.due_date
      }));
    } catch {
      const saved = localStorage.getItem(`voice_tasks_${departmentId}`);
      return saved ? JSON.parse(saved) : [];
    }
  },

  saveDepartmentTask: async (task: DepartmentTaskRecord): Promise<void> => {
    try {
      await supabase.from('department_tasks').upsert({
        id: task.id,
        department_id: task.departmentId,
        title: task.title,
        description: task.description,
        incharge_name: task.inchargeName,
        is_done: task.isDone
      });
    } catch {
      // local fallback handled
    }
  },

  // Announcements
  getAnnouncements: async (): Promise<AnnouncementRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error || !data) throw new Error();
      return data.map((a: any) => ({
        id: a.id,
        titleEn: a.title_en,
        titleBn: a.title_bn,
        descEn: a.desc_en,
        descBn: a.desc_bn,
        type: a.type,
        isPinned: a.is_pinned,
        createdAt: a.created_at
      }));
    } catch {
      return [];
    }
  }
};
