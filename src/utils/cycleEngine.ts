import type { Member, ServiceDefinition, DailyAssignment, AssignmentOverride } from '../types';

/**
 * Calculates the service assignments for a given date.
 * Based on the physical chart rules: 
 * Service ID = ((memberIndex + dayOfMonth + 3) % 12) + 1
 */
export const calculateDailyAssignments = (
  date: Date,
  members: Member[],
  services: ServiceDefinition[],
  overrides: AssignmentOverride[] = []
): DailyAssignment[] => {
  const dayOfMonth = date.getDate();
  const assignments: DailyAssignment[] = [];

  // Sort members by their cycleOrder (0 to 11) to ensure deterministic results
  const sortedMembers = [...members].sort((a, b) => a.cycleOrder - b.cycleOrder);

  // First pass: Calculate base assignments
  sortedMembers.forEach((member) => {
    if (!member.isActive) return;

    const activeServicesCount = services.length;
    // We use the array index instead of the raw ID string. This handles gaps in IDs natively.
    // e.g. If services = [1, 2, 4], services[0] is ID '1', services[2] is ID '4'.
    const serviceIndex = (member.cycleOrder + dayOfMonth + 3) % activeServicesCount;
    const service = services[serviceIndex];
    
    if (service) {
      assignments.push({
        member,
        service,
        isAbsent: false
      });
    }
  });

  // 2. Identify absences
  const absentAssignments = assignments.filter(baseAssignment => {
    const override = overrides.find(o => 
      o.memberId === baseAssignment.member.id && 
      (o.serviceId === baseAssignment.service.id || o.dateStr === 'CONTINUOUS')
    );
    return override && (override.status === 'ABSENT' || override.status === 'REPLACED');
  });

  // Sort absent assignments by the member's cycleOrder (rank)
  absentAssignments.sort((a, b) => a.member.cycleOrder - b.member.cycleOrder);

  // Mapping of Nth absent -> Service ID that covers it
  const fallbackServiceMap = ['10', '4', '6', '11', '2', '8', '7'];

  // Calculate available replacements (members on fallback services who are NOT absent)
  const availableReplacements: Member[] = [];
  fallbackServiceMap.forEach(fallbackServiceId => {
    const fallbackBaseAssignment = assignments.find(a => a.service.id === fallbackServiceId);
    if (fallbackBaseAssignment) {
      const isFallbackAbsent = absentAssignments.some(a => a.member.id === fallbackBaseAssignment.member.id);
      if (!isFallbackAbsent) {
        availableReplacements.push(fallbackBaseAssignment.member);
      }
    }
  });

  const finalAssignments: DailyAssignment[] = [];
  const replacementAssignments: DailyAssignment[] = [];

  // 3. Process assignments
  assignments.forEach((baseAssignment) => {
    const override = overrides.find(o => 
      o.memberId === baseAssignment.member.id && 
      (o.serviceId === baseAssignment.service.id || o.dateStr === 'CONTINUOUS')
    );
    const isAbsent = override && (override.status === 'ABSENT' || override.status === 'REPLACED');

    if (isAbsent) {
      const absentIndex = absentAssignments.findIndex(a => a.member.id === baseAssignment.member.id);
      
      let replacementMember: Member | undefined = undefined;

      if (absentIndex >= 0 && absentIndex < availableReplacements.length) {
        replacementMember = availableReplacements[absentIndex];
        
        // Create a new assignment entry for the person doing the replacement
        replacementAssignments.push({
          member: replacementMember,
          service: baseAssignment.service,
          isAbsent: false,
          isReplacementFor: baseAssignment.member
        });
      }

      finalAssignments.push({
        ...baseAssignment,
        isAbsent: true,
        absenceReason: override?.absenceReason,
        replacementMember
      });
    } else {
      finalAssignments.push(baseAssignment);
    }
  });

  return [...finalAssignments, ...replacementAssignments];
};
