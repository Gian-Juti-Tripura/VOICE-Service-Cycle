export interface Member {
  id: string; // Document ID
  fullName: string;
  phone?: string;
  dob?: string;
  userId?: string; // If linked to an auth account
  isActive: boolean;
  cycleOrder: number; // 0 to 11, critical for the cycle engine rotation
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDefinition {
  id: string; // The service number as string (e.g., '1', '4')
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  timing: string;
  isActive: boolean;
}

export interface AssignmentOverride {
  id: string;
  dateStr: string; // "YYYY-MM-DD"
  memberId: string;
  serviceId: string;
  status: 'ACTIVE' | 'ABSENT' | 'REPLACED';
  absenceReason?: string;
  replacementMemberId?: string;
  managerId: string;
  timestamp: string;
}

export interface DailyAssignment {
  member: Member;
  service: ServiceDefinition;
  isAbsent: boolean;
  absenceReason?: string;
  replacementMember?: Member; // If someone else is replacing them
  isReplacementFor?: Member; // If this member is replacing someone else for this service
}
