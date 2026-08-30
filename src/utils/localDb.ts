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

export const CANONICAL_MEMBERS_LIST: Member[] = [
  { id: 'member_0', fullName: 'UTPOL P.', cycleOrder: 0, isActive: true, phone: '01790839891', dob: '2001-09-18' },
  { id: 'member_1', fullName: 'CHAITANYA P.', cycleOrder: 1, isActive: true, phone: '01331982443', dob: '2003-11-02' },
  { id: 'member_2', fullName: 'GIAN P.', cycleOrder: 2, isActive: true, phone: '01571328549', dob: '2002-11-25' },
  { id: 'member_3', fullName: 'PRANTO P.', cycleOrder: 3, isActive: true, phone: '01609302008', dob: '2003-02-14' },
  { id: 'member_4', fullName: 'SANGA P.', cycleOrder: 4, isActive: true, phone: '01722711849', dob: '2001-12-05' },
  { id: 'member_5', fullName: 'DIPEN P.', cycleOrder: 5, isActive: true, phone: '01320903062', dob: '2002-07-08' },
  { id: 'member_6', fullName: 'ANKON P.', cycleOrder: 6, isActive: true, phone: '01933503979', dob: '2002-01-20' },
  { id: 'member_7', fullName: 'ANTOR P.', cycleOrder: 7, isActive: true, phone: '01704370139', dob: '2003-04-15' },
  { id: 'member_8', fullName: 'ROTON P.', cycleOrder: 8, isActive: true, phone: '01750504601', dob: '2002-10-10' },
  { id: 'member_9', fullName: 'JOY S. P.', cycleOrder: 9, isActive: true, phone: '01734550288', dob: '2002-08-28' },
  { id: 'member_10', fullName: 'JOYKANT P.', cycleOrder: 10, isActive: true, phone: '01754034183', dob: '2002-06-18' },
  { id: 'member_11', fullName: 'BAPPI C. P.', cycleOrder: 11, isActive: true, phone: '01331982443', dob: '2003-11-02' }
];

export const CANONICAL_SERVICES_LIST: ServiceDefinition[] = [
  { id: '1', nameEn: 'Offering Arati & Sringer', nameBn: 'আরতি এবং শৃঙ্গার নিবেদন', descEn: 'Offering Arati & Sringer', descBn: 'আরতি এবং শৃঙ্গার নিবেদন', timing: '6:00 AM', isActive: true },
  { id: '2', nameEn: 'Offering Bhogo (+ 5th Absent)', nameBn: 'ভোগ নিবেদন (+ সেবা ৫ অনুপস্থিত)', descEn: 'Offering Bhogo (Fallback for Service 5)', descBn: 'ভোগ নিবেদন (সেবা ৫ এর অবর্তমানে)', timing: 'Complete before 8 AM', isActive: true },
  { id: '3', nameEn: 'Cleaning utensils at night + Mangal Arati Kirton + Room', nameBn: 'রাতে বাসন মাজা + মঙ্গল আরতি কীর্তন + রুম পরিষ্কার', descEn: 'Cleaning utensils at night + Mangal Arati Kirton + Room cleaning', descBn: 'রাতে বাসন মাজা + মঙ্গল আরতি কীর্তন + রুম পরিষ্কার', timing: 'Night', isActive: true },
  { id: '4', nameEn: 'Preparing veg at night for morning+throwing away vegetables peels.(+ 2nd Absent)', nameBn: 'আগামী সকালের জন্য রাতে সবজি প্রস্তুত করা (+ সেবা ২ অনুপস্থিত)', descEn: 'Preparing vegetables at night for next morning (Fallback for Service 2)', descBn: 'আগামী সকালের জন্য রাতে সবজি প্রস্তুত করা (সেবা ২ এর অবর্তমানে)', timing: 'Night', isActive: true },
  { id: '5', nameEn: 'Cleaning utensils + Prasad hall + Breakfast', nameBn: 'বাসন মাজা + প্রসাদ হল পরিষ্কার + প্রাতরাশ', descEn: 'Cleaning utensils + Prasad hall cleaning + Breakfast service', descBn: 'বাসন মাজা + প্রসাদ হল পরিষ্কার + প্রাতরাশ সেবা', timing: 'Before 8:00 AM', isActive: true },
  { id: '6', nameEn: 'Making veg at night for morning + Washing vegetables (+ 3rd Absent)', nameBn: 'আগামী সকালের জন্য রাতে সবজি কাটা + ধোয়া (+ সেবা ৩ অনুপস্থিত)', descEn: 'Making vegetables at night for next morning + Washing veg (Fallback for Service 3)', descBn: 'আগামী সকালের জন্য রাতে সবজি কাটা + সবজি ধোয়া (সেবা ৩ এর অবর্তমানে)', timing: 'Night', isActive: true },
  { id: '7', nameEn: 'Lunch service + Gather utensils', nameBn: 'দুপুরের প্রসাদ সেবা + বাসন সংগ্রহ', descEn: 'Lunch service + Gather utensils', descBn: 'দুপুরের প্রসাদ সেবা + বাসন সংগ্রহ', timing: '8:00 AM - 2:00 PM', isActive: true },
  { id: '8', nameEn: 'Veranda cleaning + Deities room (+ 6th Absent)', nameBn: 'বারান্দা পরিষ্কার + ঠাকুর ঘর পরিষ্কার (+ সেবা ৬ অনুপস্থিত)', descEn: 'Veranda cleaning + Deities room cleaning (Fallback for Service 6)', descBn: 'বারান্দা পরিষ্কার + ঠাকুর ঘর পরিষ্কার (সেবা ৬ এর অবর্তমানে)', timing: 'Before 10:00 AM', isActive: true },
  { id: '9', nameEn: 'Cooking in the morning', nameBn: 'সকালে রান্না করা', descEn: 'Cooking in the morning', descBn: 'সকালে রান্না করা', timing: '5:30 AM - 8:30 AM', isActive: true },
  { id: '10', nameEn: 'Dinner service + Prasad hall + Utensils (+ 1st Absent)', nameBn: 'রাতের প্রসাদ সেবা + প্রসাদ হল + বাসন মাজা (+ সেবা ১ অনুপস্থিত)', descEn: 'Dinner service + Prasad hall cleaning + Utensils cleaning (Fallback for 1st Absent)', descBn: 'রাতের প্রসাদ সেবা + প্রসাদ হল পরিষ্কার + বাসন মাজা (১ম অনুপস্থিত ব্যক্তির জন্য)', timing: 'Night', isActive: true },
  { id: '11', nameEn: 'Making veg for night + Wash (+ 4th Absent)', nameBn: 'রাতের জন্য সবজি কাটা + ধোয়া (+ সেবা ৪ অনুপস্থিত)', descEn: 'Making vegetables for night + Wash (Fallback for Service 4)', descBn: 'রাতের জন্য সবজি কাটা + ধোয়া (সেবা ৪ এর অবর্তমানে)', timing: 'Evening', isActive: true },
  { id: '12', nameEn: 'Cooking at night + Shayan + Nrisimha Arati Kirton', nameBn: 'রাতে রান্না করা + শয়ন + নৃসিংহ আরতি কীর্তন', descEn: 'Cooking at night + Shayan + Nrisimha Arati Kirton', descBn: 'রাতে রান্না করা + শয়ন + নৃসিংহ আরতি কীর্তন', timing: 'Enter Before 7:00 PM', isActive: true }
];

export const localDb = {
  // Members
  getMembers: async (): Promise<Member[]> => {
    try {
      // 1. Proactive cloud cleanup for Supabase database
      try {
        supabase.from('services').delete().eq('id', '0').then(() => {});
        supabase.from('members').delete().like('id', 'dev_%').neq('id', 'dev_caretaker').then(() => {});
        supabase.from('members').delete().ilike('full_name', '%Akash Paul%').then(() => {});
        supabase.from('members').delete().ilike('full_name', '%Utpol Das Khocon%').then(() => {});
        supabase.from('members').delete().ilike('full_name', '%Gianjyoti Tripura%').then(() => {});
        supabase.from('members').delete().ilike('full_name', '%Dipendranath Roy%').then(() => {});
        supabase.from('members').update({ role: 'ADMIN', cycle_order: -1 }).eq('id', 'dev_caretaker').then(() => {});
      } catch {
        // non-blocking
      }

      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('cycle_order', { ascending: true });
        
      if (error) throw new Error(error.message);
      
      // Filter strictly for the 12 active student devotees (excluding Counselor HG Rasvihari KC Das & Alumni)
      const validMembers: Member[] = [];
      const seenOrders = new Set<number>();

      data.forEach((m: any) => {
        if (
          m.id === 'dev_caretaker' || 
          m.id === 'alumni_akash' ||
          m.role === 'ADMIN' || 
          m.full_name?.toLowerCase().includes('rasvihari') || 
          m.full_name?.toLowerCase().includes('akash paul')
        ) {
          return;
        }

        const canonicalMatch = CANONICAL_MEMBERS_LIST.find(c => 
          c.id === m.id || 
          c.fullName.toLowerCase() === m.full_name?.trim().toLowerCase() ||
          c.cycleOrder === m.cycle_order
        );

        const order = canonicalMatch ? canonicalMatch.cycleOrder : (typeof m.cycle_order === 'number' && m.cycle_order >= 0 ? m.cycle_order : -1);
        if (order >= 0 && order < 12 && !seenOrders.has(order)) {
          seenOrders.add(order);
          validMembers.push({
            id: `member_${order}`,
            fullName: canonicalMatch ? canonicalMatch.fullName : m.full_name,
            phone: m.phone || (canonicalMatch?.phone ?? ''),
            dob: m.dob || (canonicalMatch?.dob ?? ''),
            userId: m.user_id,
            isActive: true,
            cycleOrder: order,
            createdAt: m.created_at || new Date().toISOString(),
            updatedAt: m.updated_at || new Date().toISOString()
          });
        }
      });

      // Guarantee all 12 slots 0 to 11 are filled
      CANONICAL_MEMBERS_LIST.forEach(canonical => {
        if (!seenOrders.has(canonical.cycleOrder)) {
          seenOrders.add(canonical.cycleOrder);
          validMembers.push(canonical);
        }
      });

      validMembers.sort((a, b) => a.cycleOrder - b.cycleOrder);
      localStorage.setItem('voice_cached_members_v4', JSON.stringify(validMembers));
      return validMembers;
    } catch {
      const cached = localStorage.getItem('voice_cached_members_v4');
      return cached ? JSON.parse(cached) : CANONICAL_MEMBERS_LIST;
    }
  },
  
  saveMembers: async (members: Member[]): Promise<void> => {
    localStorage.setItem('voice_cached_members_v4', JSON.stringify(members));
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
      
      const serviceMap = new Map<string, ServiceDefinition>();
      data.forEach((s: any) => {
        const numId = parseInt(s.id);
        if (numId >= 1 && numId <= 12 && !serviceMap.has(s.id)) {
          const canonical = CANONICAL_SERVICES_LIST.find(c => c.id === s.id);
          serviceMap.set(s.id, {
            id: s.id,
            nameBn: s.name_bn || canonical?.nameBn || '',
            nameEn: s.name_en || canonical?.nameEn || '',
            descBn: s.desc_bn || canonical?.descBn || '',
            descEn: s.desc_en || canonical?.descEn || '',
            timing: s.timing || canonical?.timing || '',
            isActive: true
          });
        }
      });

      // Fill any missing service with CANONICAL_SERVICES_LIST
      CANONICAL_SERVICES_LIST.forEach(c => {
        if (!serviceMap.has(c.id)) {
          serviceMap.set(c.id, c);
        }
      });

      const services = Array.from(serviceMap.values())
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .slice(0, 12);

      localStorage.setItem('voice_cached_services_v4', JSON.stringify(services));
      return services;
    } catch {
      const cached = localStorage.getItem('voice_cached_services_v4');
      return cached ? JSON.parse(cached) : CANONICAL_SERVICES_LIST;
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
