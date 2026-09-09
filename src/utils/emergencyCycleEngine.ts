import type { 
  Member, 
  ServiceDefinition, 
  EmergencyAssignment, 
  EmergencyDevoteeSchedule 
} from '../types';

export interface EmergencyCalculationResult {
  assignments: EmergencyAssignment[];
  devoteeSchedules: EmergencyDevoteeSchedule[];
  summary: {
    totalMembers: number;
    totalServices: number;
    minDutiesPerMember: number;
    maxDutiesPerMember: number;
    isBalanced: boolean;
  };
}

/**
 * Calculates deterministic, perfectly balanced emergency assignments
 * for when the ashram operates with 6 or fewer (<=6) members.
 * 
 * Guarantees:
 * 1. The difference in duty count between any two members is at most 1.
 * 2. Duties rotate deterministically every day based on date offset.
 * 3. Does not affect or rely on the 12-day replacement hierarchy.
 */
export const calculateEmergencyAssignments = (
  date: Date,
  presentMembers: Member[],
  services: ServiceDefinition[],
  customAssignments: Record<string, string> = {}
): EmergencyCalculationResult => {
  // Filter active services and sort by service ID numerically
  const activeServices = [...services]
    .filter(s => s.isActive)
    .sort((a, b) => {
      const numA = parseInt(a.id, 10);
      const numB = parseInt(b.id, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.id.localeCompare(b.id);
    });

  // Sort present members deterministically by cycleOrder
  const sortedMembers = [...presentMembers].sort((a, b) => a.cycleOrder - b.cycleOrder);

  if (sortedMembers.length === 0 || activeServices.length === 0) {
    return {
      assignments: [],
      devoteeSchedules: [],
      summary: {
        totalMembers: sortedMembers.length,
        totalServices: activeServices.length,
        minDutiesPerMember: 0,
        maxDutiesPerMember: 0,
        isBalanced: true
      }
    };
  }

  // Calculate day-based rotation offset
  // Using continuous epoch days ensures smooth daily shifting across months and years
  const dayOffset = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / (1000 * 60 * 60 * 24)
  );

  const memberCount = sortedMembers.length;
  const assignments: EmergencyAssignment[] = [];
  const devoteeDutyMap = new Map<string, ServiceDefinition[]>();

  sortedMembers.forEach(m => {
    devoteeDutyMap.set(m.id, []);
  });

  // Round-robin equal distribution
  activeServices.forEach((service, index) => {
    let assignedMember: Member | undefined;
    let isCustom = false;

    // Check if manager explicitly assigned a custom devotee to this service
    if (customAssignments[service.id]) {
      const customId = customAssignments[service.id];
      assignedMember = sortedMembers.find(m => m.id === customId);
      if (assignedMember) {
        isCustom = true;
      }
    }

    // Default round-robin distribution with daily offset
    if (!assignedMember) {
      const memberIndex = (index + dayOffset) % memberCount;
      assignedMember = sortedMembers[memberIndex];
    }

    if (assignedMember) {
      assignments.push({
        service,
        member: assignedMember,
        isCustomAssigned: isCustom
      });

      const currentDuties = devoteeDutyMap.get(assignedMember.id) || [];
      currentDuties.push(service);
      devoteeDutyMap.set(assignedMember.id, currentDuties);
    }
  });

  // Build devotee-centric schedules
  const devoteeSchedules: EmergencyDevoteeSchedule[] = sortedMembers.map(member => {
    const assignedDuties = devoteeDutyMap.get(member.id) || [];
    return {
      member,
      services: assignedDuties,
      totalDuties: assignedDuties.length
    };
  });

  // Calculate load metrics
  const dutyCounts = devoteeSchedules.map(s => s.totalDuties);
  const minDuties = Math.min(...dutyCounts);
  const maxDuties = Math.max(...dutyCounts);
  const isBalanced = maxDuties - minDuties <= 1;

  return {
    assignments,
    devoteeSchedules,
    summary: {
      totalMembers: memberCount,
      totalServices: activeServices.length,
      minDutiesPerMember: minDuties,
      maxDutiesPerMember: maxDuties,
      isBalanced
    }
  };
};

/**
 * Formats a clean, high-visibility WhatsApp announcement for the Emergency Service Chart.
 */
export const generateEmergencyWhatsAppMessage = (
  date: Date,
  schedules: EmergencyDevoteeSchedule[],
  language: 'bn' | 'en' = 'bn'
): string => {
  const dateStr = date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalMembers = schedules.length;
  const totalServices = schedules.reduce((acc, s) => acc + s.services.length, 0);
  const minDuties = Math.min(...schedules.map(s => s.totalDuties));
  const maxDuties = Math.max(...schedules.map(s => s.totalDuties));
  const loadText = minDuties === maxDuties 
    ? `${minDuties}` 
    : `${minDuties}-${maxDuties}`;

  if (language === 'bn') {
    let msg = `🚨 *অদ্বৈত ভয়েস — জরুরী সেবা বণ্টন তালিকা* 🚨\n`;
    msg += `📅 *তারিখ:* ${dateStr}\n`;
    msg += `👥 *উপস্থিত সদস্য:* ${totalMembers} জন | 📋 *মোট সেবা:* ${totalServices}টি\n`;
    msg += `⚖️ *সুষম বণ্টন:* প্রত্যেকে ${loadText}টি করে সেবা\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    schedules.forEach((schedule, idx) => {
      msg += `${idx + 1}. 👤 *${schedule.member.fullName.trim()}* (${schedule.totalDuties}টি সেবা):\n`;
      if (schedule.services.length === 0) {
        msg += `   • কোন সেবা নির্ধারিত নেই\n`;
      } else {
        schedule.services.forEach(s => {
          const mainName = s.nameBn.split(' (+ ')[0];
          msg += `   🟢 *[সেবা ${s.id}]* ${mainName} ⏰ (${s.timing})\n`;
        });
      }
      msg += `\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ *বিশেষ নির্দেশিকা:* আশ্রমে সদস্য সংখ্যা কম থাকায় সেবা সমূহ সবার মাঝে সমানভাবে বণ্টন করা হয়েছে। সবাই নিষ্ঠার সাথে শ্রীশ্রী রাধামাধবের সেবা সম্পাদন করুন।\n`;
    msg += `🙏 *হরে কৃষ্ণ! হরিবোল!* ✨`;
    return msg;
  }

  // English fallback
  let msg = `🚨 *ADVAITA VOICE — EMERGENCY SERVICE ROSTER* 🚨\n`;
  msg += `📅 *Date:* ${dateStr}\n`;
  msg += `👥 *Present Members:* ${totalMembers} | 📋 *Active Services:* ${totalServices}\n`;
  msg += `⚖️ *Equal Load Distribution:* ${loadText} duties per devotee\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  schedules.forEach((schedule, idx) => {
    msg += `${idx + 1}. 👤 *${schedule.member.fullName.trim()}* (${schedule.totalDuties} Duties):\n`;
    if (schedule.services.length === 0) {
      msg += `   • No duties assigned\n`;
    } else {
      schedule.services.forEach(s => {
        const mainName = s.nameEn.split(' (+ ')[0];
        msg += `   🟢 *[Service ${s.id}]* ${mainName} ⏰ (${s.timing})\n`;
      });
    }
    msg += `\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✨ *Guideline:* Due to limited devotees in the ashram, duties are equally distributed. Please perform your services with loving devotion.\n`;
  msg += `🙏 *Hare Krishna! Haribol!* ✨`;
  return msg;
};
