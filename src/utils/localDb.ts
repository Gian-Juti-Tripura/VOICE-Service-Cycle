import type { Member, ServiceDefinition, AssignmentOverride } from '../types';

const MEMBERS_KEY = 'voice_members';
const SERVICES_KEY = 'voice_services';
const OVERRIDES_KEY = 'voice_overrides';

// Helper to simulate network delay for realistic UI loading states
const delay = (ms: number = 300) => new Promise(res => setTimeout(res, ms));

export const localDb = {
  // Members
  getMembers: async (): Promise<Member[]> => {
    await delay();
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveMembers: async (members: Member[]): Promise<void> => {
    await delay(100);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  },
  
  getMember: async (id: string): Promise<Member | null> => {
    const members = await localDb.getMembers();
    return members.find(m => m.id === id) || null;
  },
  
  saveMember: async (member: Member): Promise<void> => {
    const members = await localDb.getMembers();
    const existingIndex = members.findIndex(m => m.id === member.id);
    if (existingIndex >= 0) {
      members[existingIndex] = member;
    } else {
      members.push(member);
    }
    await localDb.saveMembers(members);
  },
  
  // Services
  getServices: async (): Promise<ServiceDefinition[]> => {
    await delay();
    const data = localStorage.getItem(SERVICES_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveServices: async (services: ServiceDefinition[]): Promise<void> => {
    await delay(100);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  getService: async (id: string): Promise<ServiceDefinition | null> => {
    const services = await localDb.getServices();
    return services.find(s => s.id === id) || null;
  },
  
  saveService: async (service: ServiceDefinition): Promise<void> => {
    const services = await localDb.getServices();
    const existingIndex = services.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }
    await localDb.saveServices(services);
  },

  // Overrides
  getOverridesByDate: async (dateStr: string): Promise<AssignmentOverride[]> => {
    await delay();
    const data = localStorage.getItem(OVERRIDES_KEY);
    const overrides: AssignmentOverride[] = data ? JSON.parse(data) : [];
    return overrides.filter(o => o.dateStr === dateStr);
  },
  
  saveOverride: async (override: AssignmentOverride): Promise<void> => {
    await delay();
    const data = localStorage.getItem(OVERRIDES_KEY);
    const overrides: AssignmentOverride[] = data ? JSON.parse(data) : [];
    
    // Replace if same override
    const existingIndex = overrides.findIndex(o => o.id === override.id);
    if (existingIndex >= 0) {
      overrides[existingIndex] = override;
    } else {
      overrides.push(override);
    }
    
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  },

  clearAll: async (): Promise<void> => {
    localStorage.removeItem(MEMBERS_KEY);
    localStorage.removeItem(SERVICES_KEY);
    localStorage.removeItem(OVERRIDES_KEY);
  }
};
