import { supabase } from '../supabase/supabaseClient';
import type { Member, ServiceDefinition, AssignmentOverride } from '../types';

export const localDb = {
  // Members
  getMembers: async (): Promise<Member[]> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('cycle_order', { ascending: true });
      
    if (error) throw new Error(error.message);
    
    return data.map((m: any) => ({
      id: m.id,
      fullName: m.full_name,
      phone: m.phone,
      dob: m.dob,
      userId: m.user_id,
      isActive: m.is_active,
      cycleOrder: m.cycle_order,
      createdAt: m.created_at,
      updatedAt: m.updated_at
    }));
  },
  
  saveMembers: async (members: Member[]): Promise<void> => {
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
    
    const { error } = await supabase.from('members').upsert(records);
    if (error) throw new Error(error.message);
  },
  
  getMember: async (id: string): Promise<Member | null> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      throw new Error(error.message);
    }
    if (!data) return null;
    
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
  },
  
  saveMember: async (member: Member): Promise<void> => {
    const { error } = await supabase.from('members').upsert({
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
    if (error) throw new Error(error.message);
  },
  
  // Services
  getServices: async (): Promise<ServiceDefinition[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*');
      
    if (error) throw new Error(error.message);
    
    // Sort by parsing ID since they are strings like "1", "2"
    data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    
    return data.map((s: any) => ({
      id: s.id,
      nameBn: s.name_bn,
      nameEn: s.name_en,
      descBn: s.desc_bn,
      descEn: s.desc_en,
      timing: s.timing,
      isActive: s.is_active
    }));
  },
  
  saveServices: async (services: ServiceDefinition[]): Promise<void> => {
    const records = services.map(s => ({
      id: s.id,
      name_bn: s.nameBn,
      name_en: s.nameEn,
      desc_bn: s.descBn,
      desc_en: s.descEn,
      timing: s.timing,
      is_active: s.isActive
    }));
    
    const { error } = await supabase.from('services').upsert(records);
    if (error) throw new Error(error.message);
  },

  getService: async (id: string): Promise<ServiceDefinition | null> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      throw new Error(error.message);
    }
    if (!data) return null;
    
    return {
      id: data.id,
      nameBn: data.name_bn,
      nameEn: data.name_en,
      descBn: data.desc_bn,
      descEn: data.desc_en,
      timing: data.timing,
      isActive: data.is_active
    };
  },
  
  saveService: async (service: ServiceDefinition): Promise<void> => {
    const { error } = await supabase.from('services').upsert({
      id: service.id,
      name_bn: service.nameBn,
      name_en: service.nameEn,
      desc_bn: service.descBn,
      desc_en: service.descEn,
      timing: service.timing,
      is_active: service.isActive
    });
    if (error) throw new Error(error.message);
  },

  deleteService: async (id: string): Promise<void> => {
    // 1. Delete all overrides to prevent foreign key errors
    await supabase.from('assignment_overrides').delete().eq('service_id', id);
    
    // 2. Delete the service
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
  deleteMember: async (id: string): Promise<void> => {
    // 1. Delete all overrides to prevent foreign key errors
    await supabase.from('assignment_overrides').delete().eq('member_id', id);
    await supabase.from('assignment_overrides').delete().eq('replacement_member_id', id);
    
    // 2. Delete the member
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) throw new Error(error.message);

    // 3. Re-sequence cycle orders for remaining members
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
  },
  
  getOverridesByDateRange: async (dateStrs: string[]): Promise<AssignmentOverride[]> => {
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
  },
  
  saveOverride: async (override: AssignmentOverride): Promise<void> => {
    const { error } = await supabase.from('assignment_overrides').upsert({
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
    if (error) throw new Error(error.message);
  },

  deleteOverride: async (id: string): Promise<void> => {
    const { error } = await supabase.from('assignment_overrides').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  clearAll: async (): Promise<void> => {
    // Utility for wiping data in development if needed
    // You must add proper RLS / warnings for this in production
    await supabase.from('assignment_overrides').delete().neq('id', '0');
    await supabase.from('members').delete().neq('id', '0');
    await supabase.from('services').delete().neq('id', '0');
  }
};
