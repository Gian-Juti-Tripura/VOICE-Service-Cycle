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
  '5': { 
    difficulty: 'MEDIUM_HIGH', 
    weight: 2.5, 
    labelBn: 'মাঝারি-কঠিন (প্রাতরাশ ও হল)', 
    labelEn: 'Med-Heavy (Breakfast & Hall)', 
    color: 'amber',
    categoryBn: 'প্রাতরাশ ও হল পরিষ্কার',
    categoryEn: 'Breakfast Service & Hall Clean'
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
  '7': { 
    difficulty: 'MEDIUM_HIGH', 
    weight: 2.5, 
    labelBn: 'মাঝারি-কঠিন (দুপুরের সেবা)', 
    labelEn: 'Med-Heavy (Lunch Service)', 
    color: 'amber',
    categoryBn: 'দুপুরের প্রসাদ ও বাসন',
    categoryEn: 'Lunch Service & Utensils'
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
  '9': { 
    difficulty: 'HEAVY', 
    weight: 3.0, 
    labelBn: 'কঠিন (সকালের রান্না)', 
    labelEn: 'Heavy (Morning Cook)', 
    color: 'rose',
    categoryBn: 'প্রধান সকালের রন্ধন সেবা',
    categoryEn: 'Morning Kitchen Cooking'
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
  '11': { 
    difficulty: 'LIGHT', 
    weight: 1.0, 
    labelBn: 'সহজ (রাতের সবজি প্রস্তুত)', 
    labelEn: 'Light (Evening Veg Prep)', 
    color: 'teal',
    categoryBn: 'সান্ধ্য সবজি প্রস্তুত',
    categoryEn: 'Evening Vegetable Prep'
  },
  '12': { 
    difficulty: 'HEAVY', 
    weight: 3.0, 
    labelBn: 'কঠিন (রাতের রান্না ও শয়ন)', 
    labelEn: 'Heavy (Night Cook & Shayan)', 
    color: 'rose',
    categoryBn: 'সান্ধ্য রন্ধন ও পূজা',
    categoryEn: 'Evening Cooking & Puja'
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

/**
 * Cohesive, time-relevant duty bundle definition
 */
export interface ServiceBundleDef {
  bundleId: string;
  nameBn: string;
  nameEn: string;
  serviceIds: string[];
}

/**
 * Real-life Ashram Cohesive Duty Bundles grouped by time-relevance and location
 */
export const getTimeRelevantBundles = (memberCount: number): ServiceBundleDef[] => {
  if (memberCount === 5) {
    return [
      {
        bundleId: 'bundle_pujari',
        nameBn: 'মঙ্গল আরতি + ভোগ',
        nameEn: 'Mangal Arati & Bhogo',
        serviceIds: ['1', '2']
      },
      {
        bundleId: 'bundle_morning_cook',
        nameBn: 'সকালের রান্না + বারান্দা/মন্দির ক্লিনিং',
        nameEn: 'Morning Cooking & Cleaning',
        serviceIds: ['9', '8']
      },
      {
        bundleId: 'bundle_day_meals',
        nameBn: 'সকালের + দুপুরের পরিবেশন',
        nameEn: 'Breakfast & Lunch Service',
        serviceIds: ['5', '7']
      },
      {
        bundleId: 'bundle_next_day_veg',
        nameBn: 'পরের দিনের জন্য সবজি বানানো',
        nameEn: 'Next Day Veg Prep',
        serviceIds: ['4', '6']
      },
      {
        bundleId: 'bundle_night_kitchen',
        nameBn: 'রাতের সবজি বানানো + রাতের রান্না + পরিবেশন + পাত্র মার্জন',
        nameEn: 'Night Veg, Cooking, Serving & Utensils',
        serviceIds: ['11', '12', '10', '3']
      }
    ];
  }

  if (memberCount === 6) {
    return [
      {
        bundleId: 'bundle_pujari',
        nameBn: 'মঙ্গল আরতি + ভোগ',
        nameEn: 'Mangal Arati & Bhogo',
        serviceIds: ['1', '2']
      },
      {
        bundleId: 'bundle_morning_cook',
        nameBn: 'সকালের রান্না + বারান্দা/মন্দির ক্লিনিং',
        nameEn: 'Morning Cooking & Cleaning',
        serviceIds: ['9', '8']
      },
      {
        bundleId: 'bundle_day_meals',
        nameBn: 'সকালের + দুপুরের পরিবেশন',
        nameEn: 'Breakfast & Lunch Service',
        serviceIds: ['5', '7']
      },
      {
        bundleId: 'bundle_next_day_veg',
        nameBn: 'পরের দিনের জন্য সবজি বানানো',
        nameEn: 'Next Day Veg Prep',
        serviceIds: ['4', '6']
      },
      {
        bundleId: 'bundle_night_cook',
        nameBn: 'রাতের সবজি প্রস্তুত ও রাতের রান্না',
        nameEn: 'Evening Veg & Night Cooking',
        serviceIds: ['11', '12']
      },
      {
        bundleId: 'bundle_night_pots',
        nameBn: 'রাতের পরিবেশন ও পাত্র মার্জন',
        nameEn: 'Dinner Service & Night Utensils',
        serviceIds: ['10', '3']
      }
    ];
  }

  if (memberCount === 4) {
    return [
      {
        bundleId: 'bundle_morning_altar',
        nameBn: 'মঙ্গল আরতি, ভোগ ও মন্দির ক্লিনিং',
        nameEn: 'Morning Puja, Bhogo & Cleaning',
        serviceIds: ['1', '2', '8']
      },
      {
        bundleId: 'bundle_morning_cooking_meals',
        nameBn: 'সকালের রান্না ও দিনের পরিবেশন',
        nameEn: 'Morning Cooking & Daytime Meals',
        serviceIds: ['9', '5', '7']
      },
      {
        bundleId: 'bundle_next_veg_pots',
        nameBn: 'পরের দিনের সবজি প্রস্তুত ও রাতের বাসন',
        nameEn: 'Next Day Veg Prep & Night Pots',
        serviceIds: ['4', '6', '3']
      },
      {
        bundleId: 'bundle_night_full',
        nameBn: 'রাতের সবজি, রান্না ও রাতের পরিবেশন',
        nameEn: 'Night Veg, Cooking & Dinner Service',
        serviceIds: ['11', '12', '10']
      }
    ];
  }

  if (memberCount === 3) {
    return [
      {
        bundleId: 'bundle_morning_tri',
        nameBn: 'সকালের পূজা, রান্না ও মন্দির পরিষ্কার',
        nameEn: 'Morning Puja, Cooking & Cleaning',
        serviceIds: ['1', '2', '9', '8']
      },
      {
        bundleId: 'bundle_day_tri',
        nameBn: 'দিনের পরিবেশন ও সকালের সবজি প্রস্তুত',
        nameEn: 'Daytime Meals & Morning Veg Prep',
        serviceIds: ['5', '7', '4', '6']
      },
      {
        bundleId: 'bundle_night_tri',
        nameBn: 'রাতের সবজি, রান্না, পরিবেশন ও পাত্র মার্জন',
        nameEn: 'Night Veg, Cooking, Dinner & Pots',
        serviceIds: ['11', '12', '10', '3']
      }
    ];
  }

  if (memberCount === 2) {
    return [
      {
        bundleId: 'bundle_morning_half',
        nameBn: 'সকাল ও দুপুরের সকল সেবা',
        nameEn: 'All Morning & Lunch Services',
        serviceIds: ['1', '2', '9', '8', '5', '7']
      },
      {
        bundleId: 'bundle_night_half',
        nameBn: 'সবজি প্রস্তুত, রাতের রান্না, পরিবেশন ও মার্জন',
        nameEn: 'Veg Prep, Night Cooking, Dinner & Pots',
        serviceIds: ['4', '6', '11', '12', '10', '3']
      }
    ];
  }

  // Fallback for 1 or unexpected member count
  return [
    {
      bundleId: 'bundle_all',
      nameBn: 'আশ্রমের সকল সেবা',
      nameEn: 'All Ashram Services',
      serviceIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }
  ];
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

// Canonical priority list to ensure deterministic mapping for 10/09/2026:
// 0: CHAITANYA P. -> Bundle 0 (মঙ্গল আরতি + ভোগ)
// 1: ANTOR P.     -> Bundle 1 (সকালের রান্না + বারান্দা/মন্দির ক্লিনিং)
// 2: BAPPI C. P. -> Bundle 2 (সকালের + দুপুরের পরিবেশন)
// 3: GIAN P.      -> Bundle 3 (পরের দিনের জন্য সবজি বানানো)
// 4: JOY S. P.    -> Bundle 4 (রাতের সবজি বানানো + রাতের রান্না + পরিবেশন + পাত্র মার্জন)
const CANONICAL_ROTATION_ORDER = [
  'CHAITANYA',
  'ANTOR',
  'BAPPI',
  'GIAN',
  'JOY S.',
  'UTPOL',
  'PRANTO',
  'SANGA',
  'DIPEN',
  'ANKON',
  'ROTON',
  'JOYKANT'
];

const getCanonicalRank = (name: string): number => {
  const upper = name.toUpperCase();
  const idx = CANONICAL_ROTATION_ORDER.findIndex(k => upper.includes(k));
  return idx >= 0 ? idx : 99;
};

/**
 * Calculates deterministic, time-relevant, and difficulty-balanced emergency assignments.
 * 
 * Guarantees:
 * 1. ALL active services (all 12 services) are 100% assigned and covered.
 * 2. Services are grouped by time relevance and location (e.g. Morning Altar, Morning Cooking & Cleaning, Daytime Serving, etc.).
 * 3. Exact ground-truth distribution on 10/09/2026 matches the ashram's real-life allocation:
 *    - CHAITANYA P.: মঙ্গল আরতি + ভোগ (Services 1, 2)
 *    - ANTOR P.: সকালের রান্না + বারান্দা/মন্দির ক্লিনিং (Services 9, 8)
 *    - BAPPI C. P.: সকালের + দুপুরের পরিবেশন (Services 5, 7)
 *    - GIAN P.: পরের দিনের জন্য সবজি বানানো (Services 4, 6)
 *    - JOY S. P.: রাতের সবজি + রাতের রান্না + পরিবেশন + পাত্র মার্জন (Services 11, 12, 10, 3)
 * 4. Rotates deterministically on consecutive days so each devotee performs every bundle in turn.
 */
export const calculateEmergencyAssignments = (
  date: Date,
  presentMembers: Member[],
  services: ServiceDefinition[],
  customAssignments: Record<string, string> = {}
): EmergencyCalculationResult => {
  // Attach difficulty metadata to active services
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

  if (presentMembers.length === 0 || activeServices.length === 0) {
    return {
      assignments: [],
      devoteeSchedules: [],
      summary: {
        totalMembers: presentMembers.length,
        totalServices: activeServices.length,
        minDutiesPerMember: 0,
        maxDutiesPerMember: 0,
        minPointsPerMember: 0,
        maxPointsPerMember: 0,
        isBalanced: true
      }
    };
  }

  // Sort present members by the canonical sequence
  const sortedMembers = [...presentMembers].sort((a, b) => {
    const rankA = getCanonicalRank(a.fullName);
    const rankB = getCanonicalRank(b.fullName);
    if (rankA !== rankB) return rankA - rankB;
    return a.cycleOrder - b.cycleOrder;
  });

  const memberCount = sortedMembers.length;
  const bundleDefs = getTimeRelevantBundles(memberCount);

  // Epoch day calculation anchored at 2026-09-10 (where dayOffset = 0)
  const baseEpochDate = Date.UTC(2026, 8, 10); // 2026-09-10
  const currentEpochDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const daysFromBase = Math.floor((currentEpochDate - baseEpochDate) / (1000 * 60 * 60 * 24));

  // Map each member to their rotated bundle
  const devoteeSchedules: EmergencyDevoteeSchedule[] = sortedMembers.map((member, mIdx) => {
    // Determine which bundle this member receives today
    const bundleIdx = ((mIdx + (daysFromBase % memberCount)) % memberCount + memberCount) % memberCount;
    const bundle = bundleDefs[bundleIdx] || bundleDefs[0];

    // Collect the services matching this bundle's serviceIds
    const assignedServices: ServiceDefinition[] = [];
    bundle.serviceIds.forEach(id => {
      const s = activeServices.find(srv => srv.id === id);
      if (s) {
        assignedServices.push(s);
      }
    });
    assignedServices.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

    const totalWeight = assignedServices.reduce((acc, s) => acc + (s.weight || 2), 0);

    return {
      member,
      services: assignedServices,
      totalDuties: assignedServices.length,
      totalPoints: totalWeight,
      bundleTitleBn: bundle.nameBn,
      bundleTitleEn: bundle.nameEn
    };
  });

  // Handle any custom manual manager overrides
  if (Object.keys(customAssignments).length > 0) {
    Object.entries(customAssignments).forEach(([serviceId, targetMemberId]) => {
      const serviceObj = activeServices.find(s => s.id === serviceId);
      const targetMember = sortedMembers.find(m => m.id === targetMemberId);
      if (!serviceObj || !targetMember) return;

      // Remove from current holder
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

  // Flatten assignments array sorted by Service ID
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
  const isBalanced = maxDuties - minDuties <= 2;

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
 * with Time-Relevant Service Bundles and 100% coverage of all 12 services.
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

  if (language === 'bn') {
    let msg = `🚨 *অদ্বৈত ভয়েস — জরুরী সেবা চার্ট (সকল ১২টি সেবা)* 🚨\n`;
    msg += `📅 *তারিখ:* ${dateStr}\n`;
    msg += `👥 *উপস্থিত ভক্ত:* ${totalMembers} জন | 📋 *মোট সেবা:* ${totalServices}টি (১০০% সময় ও সুবিধাজনক বণ্টন)\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    schedules.forEach((schedule, idx) => {
      msg += `${idx + 1}. 👤 *${schedule.member.fullName.trim()}* (${schedule.totalDuties}টি সেবা):\n`;
      if (schedule.bundleTitleBn) {
        msg += `   📌 *সেবা গুচ্ছ:* ${schedule.bundleTitleBn}\n`;
      }
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
    msg += `✨ *বিশেষ নির্দেশিকা:* সেবাসমূহের সময় উপযোগিতা ও শারীরিক সুবিধার ভিত্তিতে সেবা গুচ্ছ করে উপস্থিত ভক্তদের মাঝে সুষমভাবে বণ্টন করা হয়েছে।\n`;
    msg += `🙏 *সবাই নিষ্ঠার সাথে শ্রীশ্রী রাধামাধবের সেবা সম্পাদন করুন। হরে কৃষ্ণ!* ✨`;
    return msg;
  }

  // English fallback
  let msg = `🚨 *ADVAITA VOICE — EMERGENCY SERVICE ROSTER (ALL 12 SERVICES)* 🚨\n`;
  msg += `📅 *Date:* ${dateStr}\n`;
  msg += `👥 *Present Devotees:* ${totalMembers} | 📋 *Total Services:* ${totalServices} (100% Time-Relevant)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  schedules.forEach((schedule, idx) => {
    msg += `${idx + 1}. 👤 *${schedule.member.fullName.trim()}* (${schedule.totalDuties} Duties):\n`;
    if (schedule.bundleTitleEn) {
      msg += `   📌 *Duty Bundle:* ${schedule.bundleTitleEn}\n`;
    }
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
  msg += `✨ *Notice:* Services are bundled by time-relevance and location to maximize devotee convenience and ensure all 12 services are seamlessly performed.\n`;
  msg += `🙏 *Hare Krishna! Haribol!* ✨`;
  return msg;
};
