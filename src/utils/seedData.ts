import type { Member, ServiceDefinition } from '../types';
import { localDb } from './localDb';

const INITIAL_MEMBERS = [
  { fullName: 'UTPOL P.', cycleOrder: 0 },
  { fullName: 'CHAITANYA', cycleOrder: 1 },
  { fullName: 'GIAN P.', cycleOrder: 2 },
  { fullName: 'PRANTOR', cycleOrder: 3 },
  { fullName: 'SANGA P.', cycleOrder: 4 },
  { fullName: 'DIPEN P.', cycleOrder: 5 },
  { fullName: 'ANKON P.', cycleOrder: 6 },
  { fullName: 'ANTAR P.', cycleOrder: 7 },
  { fullName: 'ROTON P.', cycleOrder: 8 },
  { fullName: 'JOY\'S P.', cycleOrder: 9 },
  { fullName: 'JOYKAN P.', cycleOrder: 10 },
  { fullName: 'ARNOB P.', cycleOrder: 11 },
];

const INITIAL_SERVICES: Partial<ServiceDefinition>[] = [
  {
    id: '1',
    nameEn: 'Offering Arati & Sringer',
    nameBn: 'আরতি এবং শৃঙ্গার নিবেদন',
    descEn: 'Offering Arati & Sringer',
    descBn: 'আরতি এবং শৃঙ্গার নিবেদন',
    timing: '6:00 AM'
  },
  {
    id: '2',
    nameEn: 'Offering Bhogo (+ 5th Absent)',
    nameBn: 'ভোগ নিবেদন (+ সেবা ৫ অনুপস্থিত)',
    descEn: 'Offering Bhogo (Fallback for Service 5)',
    descBn: 'ভোগ নিবেদন (সেবা ৫ এর অবর্তমানে)',
    timing: 'Flexible'
  },
  {
    id: '3',
    nameEn: 'Cleaning utensils at night + Kirton + Room',
    nameBn: 'রাতে বাসন মাজা + কীর্তন + রুম পরিষ্কার',
    descEn: 'Cleaning utensils at night + Kirtan + Room cleaning',
    descBn: 'রাতে বাসন মাজা + কীর্তন + রুম পরিষ্কার',
    timing: 'Night'
  },
  {
    id: '4',
    nameEn: 'Preparing veg at night for morning (+ 2nd Absent)',
    nameBn: 'আগামী সকালের জন্য রাতে সবজি প্রস্তুত করা (+ সেবা ২ অনুপস্থিত)',
    descEn: 'Preparing vegetables at night for next morning (Fallback for Service 2)',
    descBn: 'আগামী সকালের জন্য রাতে সবজি প্রস্তুত করা (সেবা ২ এর অবর্তমানে)',
    timing: 'Night'
  },
  {
    id: '5',
    nameEn: 'Cleaning utensils + Prasad hall + Breakfast',
    nameBn: 'বাসন মাজা + প্রসাদ হল পরিষ্কার + প্রাতরাশ',
    descEn: 'Cleaning utensils + Prasad hall cleaning + Breakfast service',
    descBn: 'বাসন মাজা + প্রসাদ হল পরিষ্কার + প্রাতরাশ সেবা',
    timing: 'Before 8:00 AM'
  },
  {
    id: '6',
    nameEn: 'Making veg at night for morning + Wash (+ 3rd Absent)',
    nameBn: 'আগামী সকালের জন্য রাতে সবজি কাটা + ধোয়া (+ সেবা ৩ অনুপস্থিত)',
    descEn: 'Making vegetables at night for next morning + Washing veg (Fallback for Service 3)',
    descBn: 'আগামী সকালের জন্য রাতে সবজি কাটা + সবজি ধোয়া (সেবা ৩ এর অবর্তমানে)',
    timing: 'Night'
  },
  {
    id: '7',
    nameEn: 'Lunch service + Gather utensils',
    nameBn: 'দুপুরের প্রসাদ সেবা + বাসন সংগ্রহ',
    descEn: 'Lunch service + Gather utensils',
    descBn: 'দুপুরের প্রসাদ সেবা + বাসন সংগ্রহ',
    timing: '8:00 AM - 2:00 PM'
  },
  {
    id: '8',
    nameEn: 'Veranda cleaning + Deities room (+ 6th Absent)',
    nameBn: 'বারান্দা পরিষ্কার + ঠাকুর ঘর পরিষ্কার (+ সেবা ৬ অনুপস্থিত)',
    descEn: 'Veranda cleaning + Deities room cleaning (Fallback for Service 6)',
    descBn: 'বারান্দা পরিষ্কার + ঠাকুর ঘর পরিষ্কার (সেবা ৬ এর অবর্তমানে)',
    timing: 'Before 10:00 AM'
  },
  {
    id: '9',
    nameEn: 'Cooking in the morning',
    nameBn: 'সকালে রান্না করা',
    descEn: 'Cooking in the morning',
    descBn: 'সকালে রান্না করা',
    timing: '5:30 AM - 8:30 AM'
  },
  {
    id: '10',
    nameEn: 'Dinner service + Prasad hall + Utensils (+ 9th Absent)',
    nameBn: 'রাতের প্রসাদ সেবা + প্রসাদ হল + বাসন মাজা (+ সেবা ৯ অনুপস্থিত)',
    descEn: 'Dinner service + Prasad hall cleaning + Utensils cleaning (Fallback for Service 9)',
    descBn: 'রাতের প্রসাদ সেবা + প্রসাদ হল পরিষ্কার + বাসন মাজা (সেবা ৯ এর অবর্তমানে)',
    timing: 'Night'
  },
  {
    id: '11',
    nameEn: 'Making veg for night + Wash (+ 4th Absent)',
    nameBn: 'রাতের জন্য সবজি কাটা + ধোয়া (+ সেবা ৪ অনুপস্থিত)',
    descEn: 'Making vegetables for night + Wash (Fallback for Service 4)',
    descBn: 'রাতের জন্য সবজি কাটা + ধোয়া (সেবা ৪ এর অবর্তমানে)',
    timing: 'Evening'
  },
  {
    id: '12',
    nameEn: 'Cooking at night + Shayan + Nrisimha Kirton',
    nameBn: 'রাতে রান্না করা + শয়ন + নৃসিংহ কীর্তন',
    descEn: 'Cooking at night + Shayan + Nrisimha Kirtan',
    descBn: 'রাতে রান্না করা + শয়ন + নৃসিংহ কীর্তন',
    timing: 'Before 10:30 PM'
  }
];

export const seedInitialData = async () => {
  const now = new Date().toISOString();
  
  // 1. Seed Members
  const existingMembers = await localDb.getMembers();
  
  if (existingMembers.length === 0) {
    const newMembers: Member[] = INITIAL_MEMBERS.map(m => ({
      id: `member_${m.cycleOrder}`,
      fullName: m.fullName,
      isActive: true,
      cycleOrder: m.cycleOrder,
      createdAt: now,
      updatedAt: now
    }));
    await localDb.saveMembers(newMembers);
    console.log('Seeding 12 members...');
  }

  // 2. Seed Services
  const existingServices = await localDb.getServices();
  
  if (existingServices.length === 0) {
    const newServices: ServiceDefinition[] = INITIAL_SERVICES.map(s => ({
      ...(s as ServiceDefinition),
      isActive: true
    }));
    await localDb.saveServices(newServices);
    console.log('Seeding 12 services...');
  }
  
  console.log('Seeding completed successfully!');
};
