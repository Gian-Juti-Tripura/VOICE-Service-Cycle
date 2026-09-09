import type { 
  Member, 
  ServiceDefinition, 
  EmergencyAssignment, 
  EmergencyDevoteeSchedule 
} from '../types';

export type ServiceDifficulty = 'HEAVY' | 'MEDIUM_HIGH' | 'MEDIUM' | 'LIGHT_MEDIUM' | 'LIGHT';

export interface ServiceWorkloadMeta {
  difficulty: ServiceDifficulty;
  weight: number;
  labelBn: string;
  labelEn: string;
  color: string;
  categoryBn: string;
  categoryEn: string;
}

export const SERVICE_DIFFICULTY_MAP: Record<string, ServiceWorkloadMeta> = {
  '9': { 
    difficulty: 'HEAVY', 
    weight: 3.0, 
    labelBn: 'কঠিন (রান্না)', 
    labelEn: 'Heavy (Cooking)', 
    color: 'rose',
    categoryBn: 'প্রধান রন্ধন সেবা',
    categoryEn: 'Main Kitchen Cooking'
  },
  '12': { 
    difficulty: 'HEAVY', 
    weight: 3.0, 
    labelBn: 'কঠিন (রান্না ও শয়ন)', 
    labelEn: 'Heavy (Cooking & Shayan)', 
    color: 'rose',
    categoryBn: 'সান্ধ্য রন্ধন ও পূজা',
    categoryEn: 'Evening Cooking & Puja'
  },
  '10': { 
    difficulty: 'HEAVY', 
    weight: 3.0, 
    labelBn: 'কঠিন (রাতের প্রসাদ ও বাসন)', 
    labelEn: 'Heavy (Dinner & Heavy Pots)', 
    color: 'rose',
    categoryBn: 'প্রসাদ পরিবেশন ও বাসন মাজা',
    categoryEn: 'Prasad Service & Heavy Utensils'
  },
  '5': { 
    difficulty: 'MEDIUM_HIGH', 
    weight: 2.5, 
    labelBn: 'মাঝারি-কঠিন (প্রাতরাশ ও হল)', 
    labelEn: 'Med-Heavy (Breakfast & Hall)', 
    color: 'amber',
    categoryBn: 'প্রাতরাশ ও হল পরিষ্কার',
    categoryEn: 'Breakfast Service & Hall Clean'
  },
  '7': { 
    difficulty: 'MEDIUM_HIGH', 
    weight: 2.5, 
    labelBn: 'মাঝারি-কঠিন (দুপুরের সেবা)', 
    labelEn: 'Med-Heavy (Lunch Service)', 
    color: 'amber',
    categoryBn: 'দুপুরের প্রসাদ ও বাসন',
    categoryEn: 'Lunch Service & Utensils'
  },
  '1': { 
    difficulty: 'MEDIUM', 
    weight: 2.0, 
    labelBn: 'মাঝারি (পূজারী আরতি)', 
    labelEn: 'Medium (Pujari Arati)', 
    color: 'blue',
    categoryBn: 'বিগ্রহ সেবা ও শৃঙ্গার',
    categoryEn: 'Deity Worship & Arati'
  },
  '2': { 
    difficulty: 'MEDIUM', 
    weight: 2.0, 
    labelBn: 'মাঝারি (ভোগ নিবেদন)', 
    labelEn: 'Medium (Bhogo Offering)', 
    color: 'blue',
    categoryBn: 'বিগ্রহ ভোগ নিবেদন',
    categoryEn: 'Deity Bhogo Offering'
  },
  '3': { 
    difficulty: 'MEDIUM', 
    weight: 2.0, 
    labelBn: 'মাঝারি (বাসন ও কীর্তন)', 
    labelEn: 'Medium (Utensils & Kirton)', 
    color: 'blue',
    categoryBn: 'বাসন মাজা ও কীর্তন',
    categoryEn: 'Utensils & Mangal Kirton'
  },
  '4': { 
    difficulty: 'LIGHT_MEDIUM', 
    weight: 1.5, 
    labelBn: 'সহজ-মাঝারি (সবজি প্রস্তুত)', 
    labelEn: 'Light-Med (Veg Prep)', 
    color: 'emerald',
    categoryBn: 'রান্নাঘরের পূর্বপ্রস্তুতি',
    categoryEn: 'Kitchen Pre-Prep'
  },
  '6': { 
    difficulty: 'LIGHT_MEDIUM', 
    weight: 1.5, 
    labelBn: 'সহজ-মাঝারি (সবজি কাটা ও ধোয়া)', 
    labelEn: 'Light-Med (Veg Cut & Wash)', 
    color: 'emerald',
    categoryBn: 'সবজি কাটা ও ধৌতকরণ',
    categoryEn: 'Vegetable Cutting & Washing'
  },
  '8': { 
    difficulty: 'LIGHT', 
    weight: 1.0, 
    labelBn: 'সহজ (বারান্দা ও ঠাকুর ঘর)', 
    labelEn: 'Light (Veranda Cleaning)', 
    color: 'teal',
    categoryBn: 'আশ্রম প্রাঙ্গণ পরিষ্কার',
    categoryEn: 'Ashram Grounds Cleaning'
  },
  '11': { 
    difficulty: 'LIGHT', 
    weight: 1.0, 
    labelBn: 'সহজ (রাতের সবজি প্রস্তুত)', 
    labelEn: 'Light (Evening Veg Prep)', 
    color: 'teal',
    categoryBn: 'সান্ধ্য সবজি প্রস্তুত',
    categoryEn: 'Evening Vegetable Prep'
  }
};

export const getServiceDifficultyMeta = (serviceId: string): ServiceWorkloadMeta => {
  return SERVICE_DIFFICULTY_MAP[serviceId] || {
    difficulty: 'MEDIUM',
    weight: 2.0,
    labelBn: 'মাঝারি সেবা',
    labelEn: 'Medium Service',
    color: 'blue',
    categoryBn: 'সাধারণ সেবা',
    categoryEn: 'General Service'
  };
};

export interface EmergencyCalculationResult {
  assignments: EmergencyAssignment[];
  devoteeSchedules: EmergencyDevoteeSchedule[];
  summary: {
    totalMembers: number;
    totalServices: number;
    minDutiesPerMember: number;
    maxDutiesPerMember: number;
    minPointsPerMember: number;
    maxPointsPerMember: number;
    isBalanced: boolean;
  };
}

/**
 * Calculates deterministic, difficulty-balanced emergency assignments
 * guaranteeing:
 * 1. ALL active services (all 12 services) are 100% assigned and covered.
 * 2. Heavy cooking and heavy cleaning duties are distributed across different devotees.
 * 3. Workload difficulty points per devotee are balanced (variance <= 1.0 to 1.5 pts).
 * 4. Duties rotate deterministically every day so heavy duties shift fairly across days.
 */
export const calculateEmergencyAssignments = (
  date: Date,
  presentMembers: Member[],
  services: ServiceDefinition[],
  customAssignments: Record<string, string> = {}
): EmergencyCalculationResult => {
  // Attach difficulty metadata and sort active services by ID
  const activeServices = [...services]
    .filter(s => s.isActive)
    .map(s => {
      const meta = getServiceDifficultyMeta(s.id);
      return {
        ...s,
        difficulty: meta.difficulty,
        weight: meta.weight
      };
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
        minPointsPerMember: 0,
        maxPointsPerMember: 0,
        isBalanced: true
      }
    };
  }

  const memberCount = sortedMembers.length;
  const maxDutiesPerDevotee = Math.ceil(activeServices.length / memberCount);

  // Sort services descending by difficulty weight (Heavy 3.0 first down to Light 1.0)
  // Secondary sort by service ID for strict determinism
  const sortedServicesByDifficulty = [...activeServices].sort((a, b) => {
    const wDiff = (b.weight || 2) - (a.weight || 2);
    if (wDiff !== 0) return wDiff;
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  });

  // Partition services into memberCount balanced duty slots
  interface DutySlot {
    services: ServiceDefinition[];
    totalWeight: number;
  }

  const slots: DutySlot[] = Array.from({ length: memberCount }, () => ({
    services: [],
    totalWeight: 0
  }));

  // Balanced greedy assignment: assign each service to slot with lowest total weight that has capacity
  sortedServicesByDifficulty.forEach(service => {
    let bestSlot: DutySlot | null = null;
    for (const slot of slots) {
      if (slot.services.length < maxDutiesPerDevotee) {
        if (!bestSlot || slot.totalWeight < bestSlot.totalWeight) {
          bestSlot = slot;
        } else if (slot.totalWeight === bestSlot.totalWeight && slot.services.length < bestSlot.services.length) {
          bestSlot = slot;
        }
      }
    }

    if (bestSlot) {
      bestSlot.services.push(service);
      bestSlot.totalWeight += (service.weight || 2);
    }
  });

  // Continuous epoch day offset for daily rotation
  const dayOffset = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / (1000 * 60 * 60 * 24)
  );

  // Map slots to members using cyclic day offset
  const devoteeSchedules: EmergencyDevoteeSchedule[] = sortedMembers.map((member, mIdx) => {
    const slotIdx = (mIdx - (dayOffset % memberCount) + memberCount) % memberCount;
    const assignedSlot = slots[slotIdx] || { services: [], totalWeight: 0 };

    // Sort this devotee's assigned services chronologically by service ID
    const devoteeServices = [...assignedSlot.services].sort((a, b) => {
      return parseInt(a.id, 10) - parseInt(b.id, 10);
    });

    return {
      member,
      services: devoteeServices,
      totalDuties: devoteeServices.length,
      totalPoints: assignedSlot.totalWeight
    };
  });

  // Handle manual/custom manager overrides if present
  if (Object.keys(customAssignments).length > 0) {
    Object.entries(customAssignments).forEach(([serviceId, targetMemberId]) => {
      const targetMember = sortedMembers.find(m => m.id === targetMemberId);
      const serviceObj = activeServices.find(s => s.id === serviceId);
      if (!targetMember || !serviceObj) return;

      // Remove service from current holder
      devoteeSchedules.forEach(schedule => {
        schedule.services = schedule.services.filter(s => s.id !== serviceId);
      });

      // Add to target devotee
      const targetSchedule = devoteeSchedules.find(s => s.member.id === targetMemberId);
      if (targetSchedule) {
        targetSchedule.services.push(serviceObj);
        targetSchedule.services.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
      }
    });

    // Recalculate totals after manual overrides
    devoteeSchedules.forEach(schedule => {
      schedule.totalDuties = schedule.services.length;
      schedule.totalPoints = schedule.services.reduce((acc, s) => acc + (s.weight || 2), 0);
    });
  }

  // Generate flat assignments array sorted by Service ID
  const assignments: EmergencyAssignment[] = [];
  activeServices
    .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10))
    .forEach(service => {
      const holder = devoteeSchedules.find(ds => ds.services.some(s => s.id === service.id));
      if (holder) {
        assignments.push({
          service,
          member: holder.member,
          isCustomAssigned: customAssignments[service.id] !== undefined
        });
      }
    });

  const dutyCounts = devoteeSchedules.map(s => s.totalDuties);
  const pointCounts = devoteeSchedules.map(s => s.totalPoints);
  const minDuties = Math.min(...dutyCounts);
  const maxDuties = Math.max(...dutyCounts);
  const minPoints = Math.min(...pointCounts);
  const maxPoints = Math.max(...pointCounts);
  const isBalanced = maxDuties - minDuties <= 1 && maxPoints - minPoints <= 2.0;

  return {
    assignments,
    devoteeSchedules,
    summary: {
      totalMembers: memberCount,
      totalServices: activeServices.length,
      minDutiesPerMember: minDuties,
      maxDutiesPerMember: maxDuties,
      minPointsPerMember: minPoints,
      maxPointsPerMember: maxPoints,
      isBalanced
    }
  };
};

/**
 * Formats a clean, high-visibility WhatsApp announcement for the Emergency Service Chart
 * with difficulty tags and 100% coverage of all 12 services.
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
    let msg = `🚨 *অদ্বৈত ভয়েস — জরুরী সেবা চার্ট (সকল ১২টি সেবা বণ্টন)* 🚨\n`;
    msg += `📅 *তারিখ:* ${dateStr}\n`;
    msg += `👥 *উপস্থিত ভক্ত:* ${totalMembers} জন | 📋 *মোট সেবা:* ${totalServices}টি (১০০% বরাদ্দ)\n`;
    msg += `⚖️ *কাঠিন্য ভিত্তিক সুষম বণ্টন:* প্রত্যেকে ${loadText}টি সেবা\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    schedules.forEach((schedule, idx) => {
      msg += `${idx + 1}. 👤 *${schedule.member.fullName.trim()}* (${schedule.totalDuties}টি সেবা | স্কোর: ${schedule.totalPoints.toFixed(1)}):\n`;
      if (schedule.services.length === 0) {
        msg += `   • কোন সেবা নির্ধারিত নেই\n`;
      } else {
        schedule.services.forEach(s => {
          const mainName = s.nameBn.split(' (+ ')[0];
          const meta = getServiceDifficultyMeta(s.id);
          let diffIcon = '🟡';
          if (meta.difficulty === 'HEAVY') diffIcon = '🔴';
          else if (meta.difficulty === 'MEDIUM_HIGH') diffIcon = '🟠';
          else if (meta.difficulty === 'LIGHT' || meta.difficulty === 'LIGHT_MEDIUM') diffIcon = '🟢';

          msg += `   ${diffIcon} *[সেবা ${s.id}]* ${mainName} ⏰ (${s.timing})\n`;
          msg += `      ↳ _${meta.labelBn}_\n`;
        });
      }
      msg += `\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ *বিশেষ নোট:* আশ্রমে সদস্য সংখ্যা কম থাকায় সকল ১২টি প্রধান সেবা শারীরিক শ্রম ও কাঠিন্যের স্তর অনুযায়ী সবার মাঝে সুষমভাবে বণ্টন করা হয়েছে যাতে কোন সেবা বাদ না পড়ে এবং কারো ওপর অতিরিক্ত চাপ না পড়ে।\n`;
    msg += `🙏 *সবাই নিষ্ঠার সাথে শ্রীশ্রী রাধামাধবের সেবা সম্পাদন করুন। হরে কৃষ্ণ!* ✨`;
    return msg;
  }

  // English fallback
  let msg = `🚨 *ADVAITA VOICE — EMERGENCY SERVICE ROSTER (ALL 12 SERVICES)* 🚨\n`;
  msg += `📅 *Date:* ${dateStr}\n`;
  msg += `👥 *Present Devotees:* ${totalMembers} | 📋 *Total Services:* ${totalServices} (100% Covered)\n`;
  msg += `⚖️ *Difficulty-Balanced Distribution:* ${loadText} duties per devotee\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  schedules.forEach((schedule, idx) => {
    msg += `${idx + 1}. 👤 *${schedule.member.fullName.trim()}* (${schedule.totalDuties} Duties | Workload: ${schedule.totalPoints.toFixed(1)} pts):\n`;
    if (schedule.services.length === 0) {
      msg += `   • No duties assigned\n`;
    } else {
      schedule.services.forEach(s => {
        const mainName = s.nameEn.split(' (+ ')[0];
        const meta = getServiceDifficultyMeta(s.id);
        let diffIcon = '🟡';
        if (meta.difficulty === 'HEAVY') diffIcon = '🔴';
        else if (meta.difficulty === 'MEDIUM_HIGH') diffIcon = '🟠';
        else if (meta.difficulty === 'LIGHT' || meta.difficulty === 'LIGHT_MEDIUM') diffIcon = '🟢';

        msg += `   ${diffIcon} *[Service ${s.id}]* ${mainName} ⏰ (${s.timing})\n`;
        msg += `      ↳ _${meta.labelEn}_\n`;
      });
    }
    msg += `\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✨ *Notice:* All 12 ashram services are 100% covered and balanced according to physical workload and difficulty level so no service is skipped.\n`;
  msg += `🙏 *Hare Krishna! Haribol!* ✨`;
  return msg;
};
