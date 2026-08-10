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

    // Formula: ((i + d + 3) % 12) + 1
    const rawServiceNum = ((member.cycleOrder + dayOfMonth + 3) % 12) + 1;
    const serviceId = rawServiceNum.toString();

    const service = services.find(s => s.id === serviceId);
    
    if (service) {
      assignments.push({
        member,
        service,
        isAbsent: false
      });
    }
  });

  // Second pass: Apply overrides (absences and manual replacements)
  const finalAssignments: DailyAssignment[] = [];
  
  // We need to build the list, adding replacement assignments where necessary
  assignments.forEach((baseAssignment) => {
    // Check if there is an override for this specific assignment
    const override = overrides.find(o => 
      o.memberId === baseAssignment.member.id && 
      o.serviceId === baseAssignment.service.id
    );

    if (override) {
      if (override.status === 'ABSENT' || override.status === 'REPLACED') {
        const modifiedAssignment = {
          ...baseAssignment,
          isAbsent: true,
          absenceReason: override.absenceReason
        };
        
        finalAssignments.push(modifiedAssignment);

        // If replaced, we need to add the replacement member to the list for this service
        if (override.status === 'REPLACED' && override.replacementMemberId) {
          const replacementMember = members.find(m => m.id === override.replacementMemberId);
          if (replacementMember) {
            // Link the replacement in the absent assignment
            modifiedAssignment.replacementMember = replacementMember;
            
            // Create a new assignment entry for the person doing the replacement
            finalAssignments.push({
              member: replacementMember,
              service: baseAssignment.service,
              isAbsent: false,
              isReplacementFor: baseAssignment.member
            });
          }
        }
      } else if (override.status === 'ACTIVE') {
        // Technically an override back to active, so just push base
        finalAssignments.push(baseAssignment);
      }
    } else {
      // No override, push normal assignment
      finalAssignments.push(baseAssignment);
    }
  });

  return finalAssignments;
};
