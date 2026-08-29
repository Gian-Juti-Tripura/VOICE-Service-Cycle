import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { addStoredNotice, type ManagerAnnouncement } from '../../utils/noticesStore';
import { 
  Send, X, AlertCircle, ShieldAlert, Sparkles, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ROLE_OPTIONS = [
  // Executive
  { key: 'COORDINATOR', titleEn: 'Overall Co-Ordinator (OC)', titleBn: 'সার্বিক সমন্বয়ক (ওসি)', inchargeEn: 'Utpol Das Khocon', inchargeBn: 'উৎপল দাস খোকন' },
  
  // Column 1: Ashram Operations
  { key: 'INTERNAL_MGR', titleEn: 'Internal Manager', titleBn: 'অভ্যন্তরীণ ব্যবস্থাপক', inchargeEn: 'Dipendranath Roy', inchargeBn: 'দীপেন্দ্রনাথ রায়' },
  { key: 'MORNING_PROG', titleEn: 'Morning Programme', titleBn: 'মর্নিং প্রোগ্রাম', inchargeEn: 'Joykanto Roy', inchargeBn: 'জয়কান্ত রায়' },
  { key: 'KITCHEN_INCHARGE', titleEn: 'Kitchen Incharge', titleBn: 'রান্নাঘর ইনচার্জ', inchargeEn: 'Antor Mohonto', inchargeBn: 'অন্তর মহন্ত' },
  { key: 'STUDY_CARE', titleEn: 'Study Care (Academic & Career)', titleBn: 'স্টাডি কেয়ার (শিক্ষা ও ক্যারিয়ার)', inchargeEn: 'Gian Juti Tripura + Pranto C Das', inchargeBn: 'জ্ঞান জ্যোতি ত্রিপুরা ও প্রান্ত চন্দ্র দাস' },
  { key: 'MEDICAL_GUEST', titleEn: 'Medical & Guest Care', titleBn: 'চিকিৎসা ও অতিথি সেবা', inchargeEn: 'Bappy C Sarkar', inchargeBn: 'বাপ্পী চন্দ্র সরকার' },
  { key: 'SECURITY_ENERGY', titleEn: 'Security & Energy Manager', titleBn: 'নিরাপত্তা ও বিদ্যুৎ ব্যবস্থাপক', inchargeEn: 'Sangakara Das', inchargeBn: 'সাঙ্গাকারা দাস' },
  
  // Column 2: Maintenance & Services
  { key: 'ACCOUNTS', titleEn: 'Accounts', titleBn: 'হিসাব বিভাগ', inchargeEn: 'Ankon Nath', inchargeBn: 'অঙ্কন নাথ' },
  { key: 'DEITY_CARE', titleEn: 'Deity Care', titleBn: 'শ্রীবিগ্রহ সেবা', inchargeEn: 'Antor Mohonto', inchargeBn: 'অন্তর মহন্ত' },
  { key: 'EASY_MEMBERSHIPS', titleEn: 'Easy Memberships', titleBn: 'সহজ সদস্যপদ ব্যবস্থাপনা', inchargeEn: 'Ankon Nath', inchargeBn: 'অঙ্কন নাথ' },
  { key: 'CLEANLINESS_WATER', titleEn: 'Cleanliness & Water', titleBn: 'পরিচ্ছন্নতা ও পানি ব্যবস্থাপনা', inchargeEn: 'Sangakara Das', inchargeBn: 'সাঙ্গাকারা দাস' },
  { key: 'TULASI_CARE', titleEn: 'Tulasi Care', titleBn: 'শ্রীতুলসী সেবা ও পরিচর্যা', inchargeEn: 'Antor Kumar Mohonta', inchargeBn: 'অন্তর কুমার মহন্ত' },
  { key: 'SADHANA_RESOURCES', titleEn: 'Sadhana Resources', titleBn: 'সাধনা সামগ্রী ব্যবস্থাপনা', inchargeEn: 'Akash Paul', inchargeBn: 'আকাশ পাল' },

  // Column 3: Preaching & Festivals
  { key: 'PREACHING_COORD', titleEn: 'Preaching Co-Ordinator', titleBn: 'প্রচার সমন্বয়ক', inchargeEn: 'US Joy + Roton C Roy', inchargeBn: 'ইউএস জয় ও রতন চন্দ্র রায়' },
  { key: 'MONTHLY_REPORT', titleEn: 'Monthly-Report Manager', titleBn: 'মাসিক প্রতিবেদন ব্যবস্থাপক', inchargeEn: 'Ankon Nath', inchargeBn: 'অঙ্কন নাথ' },
  { key: 'COURSE_CAMPS', titleEn: 'Course-Camps', titleBn: 'কোর্স ও ক্যাম্প পরিচালনা', inchargeEn: 'Preaching Co-ordinators', inchargeBn: 'প্রচার সমন্বয়কবৃন্দ' },
  { key: 'BTG_CS', titleEn: 'BTG-CS (Literature Distribution)', titleBn: 'বিটিজি-সিএস ও পারমার্থিক সাহিত্য', inchargeEn: 'Dipendranath Roy', inchargeBn: 'দীপেন্দ্রনাথ রায়' },
  { key: 'COURSE_CAMP_ASST', titleEn: 'Course-Camp-Assistant', titleBn: 'কোর্স ও ক্যাম্প সহকারী', inchargeEn: 'Roton Roy', inchargeBn: 'রতন রায়' },
  { key: 'PROGRAMME_FESTIVALS', titleEn: 'Programme & Festivals', titleBn: 'অনুষ্ঠান ও মহোৎসব পরিচালনা', inchargeEn: 'Akash Paul + Ankon Nath', inchargeBn: 'আকাশ পাল ও অঙ্কন নাথ' },
  
  // General
  { key: 'GENERAL', titleEn: 'General Ashram Notice', titleBn: 'সাধারণ আশ্রম নোটিশ', inchargeEn: 'Advaita VOICE Admin', inchargeBn: 'অদ্বৈত ভয়েস প্রশাসন' }
] as const;

export interface NoticeTemplate {
  id: string;
  roleKey: string;
  nameBn: string;
  nameEn: string;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  actionRequiredBn: string;
  actionRequiredEn: string;
}

export const NOTICE_TEMPLATES: NoticeTemplate[] = [
  // 1. Overall Coordinator
  {
    id: 't_oc_1',
    roleKey: 'COORDINATOR',
    nameBn: 'সাপ্তাহিক সাধনা অডিট ডেডলাইন',
    nameEn: 'Weekly Sadhana Audit Deadline',
    priority: 'HIGH',
    titleBn: 'সাপ্তাহিক সাধনাপত্র ও কাউন্সেলিং অডিট জমা দেওয়ার নোটিশ',
    titleEn: 'Weekly Sadhana Log Submission & Counseling Audit Deadline',
    descBn: 'আশ্রমের সকল আবাসিক শিক্ষার্থী ও ভক্তদের প্রতি শুক্রবার রাত ৮:০০ টার মধ্যে ডিজিটাল সাধনাপত্র জমা দিতে হবে। শ্রদ্ধেয় কাউন্সেলরদের ডেস্কে লগইন করে পর্যালোচনা ও আশীর্বাদ প্রদানের অনুরোধ জানানো হচ্ছে।',
    descEn: 'All ashram counsellees must submit their weekly digital sadhana log by Friday 8:00 PM. Counselors are requested to inspect the Counselor Desk and review.',
    actionRequiredBn: 'শুক্রবার রাত ৮:০০ টার মধ্যে সাধনাপত্র সাবমিট করুন',
    actionRequiredEn: 'Submit weekly sadhana log by Friday 8:00 PM'
  },
  {
    id: 't_oc_2',
    roleKey: 'COORDINATOR',
    nameBn: 'মাসিক সাধারণ সভা (ইস্টগোষ্ঠী)',
    nameEn: 'Monthly General Meeting (Ishtagosthi)',
    priority: 'HIGH',
    titleBn: 'মাসিক সাধারণ সভা (ইস্টগোষ্ঠী) ও সেবাক্রম পর্যালোচনা',
    titleEn: 'Monthly General Ashram Sanga & Seva Cycle Review',
    descBn: 'আগামী রবিবার রাত ৮:৩০ টায় মন্দিরের প্রধান সভাগৃহে সকল আশ্রমবাসীর উপস্থিতিতে মাসিক ইস্টগোষ্ঠী অনুষ্ঠিত হবে। সকল সেবক ও শিক্ষার্থীদের উপস্থিতি বাধ্যতামূলক।',
    descEn: 'Monthly general meeting (Ishtagosthi) will be held this Sunday at 8:30 PM in the temple hall. Full attendance is mandatory for all residents.',
    actionRequiredBn: 'রবিবার রাত ৮:৩০ টায় ইস্টগোষ্ঠীতে উপস্থিত থাকুন',
    actionRequiredEn: 'Attend Sunday 8:30 PM meeting'
  },

  // 2. Internal Manager (Dipendranath Roy)
  {
    id: 't_int_1',
    roleKey: 'INTERNAL_MGR',
    nameBn: 'সকাল ৬:৩০ টায় কক্ষ পরিচ্ছন্নতা ও বিছানা চেকিং',
    nameEn: 'Morning Room Cleanliness & Bed Inspection',
    priority: 'HIGH',
    titleBn: 'আশ্রম শৃঙ্খলা, বিছানা গোছানো ও কক্ষ পরিচ্ছন্নতা পরিদর্শন',
    titleEn: 'Daily Room Cleanliness & Bed Folding Inspection (6:30 AM)',
    descBn: 'প্রতিদিন সকাল ৬:৩০ টায় জপ সমাপ্তির পর প্রতিটি কক্ষ পরিদর্শন করা হবে। বিছানা সুন্দরভাবে ভাঁজ করা, পড়ার টেবিল গোছানো এবং জুতো নির্দিষ্ট র‍্যাকে রাখা বাধ্যতামূলক।',
    descEn: 'Daily morning room inspection takes place at 6:30 AM right after Japa. Bed sheets must be folded and rooms kept spotless.',
    actionRequiredBn: 'সকাল ৬:৩০ এর আগে কক্ষ পরিষ্কার রাখুন',
    actionRequiredEn: 'Ensure room is spotless by 6:30 AM'
  },

  // 3. Morning Programme (Joykanto Roy)
  {
    id: 't_mp_1',
    roleKey: 'MORNING_PROG',
    nameBn: 'ভোর ৪:১৫ টায় মঙ্গল আরতি ও নিবিড় ১৬ মালা জপ',
    nameEn: 'Mangalarati Timing & Attentive Japa Protocol',
    priority: 'HIGH',
    titleBn: 'মঙ্গল আরতি সময়সূচি (৪:১৫ AM) ও গভীর মনোযোগে জপ নিয়মাবলী',
    titleEn: 'Morning Mangalarati (4:15 AM) & Focused Japa Protocol',
    descBn: 'ভোরে জাগ্রত হওয়া: ৩:৩০ AM। ঠিক ৪:১৫ টায় মঙ্গল আরতি, তুলসী পূজা, নৃসিংহ প্রার্থনা ও ৫:০০ থেকে ৭:০০ পর্যন্ত মন্দির হলে একাসনে বসে মনোযোগ সহকারে ১৬ মালা জপ সম্পন্ন করতে হবে।',
    descEn: 'Waking time: 3:30 AM. Mangalarati begins at 4:15 AM sharp followed by focused 16 rounds Japa in the temple hall.',
    actionRequiredBn: '৪:১০ AM এর মধ্যে মন্দির হলে উপস্থিত হোন',
    actionRequiredEn: 'Be in Temple Hall by 4:10 AM'
  },

  // 4. Kitchen Incharge (Antor Mohonto)
  {
    id: 't_kitch_1',
    roleKey: 'KITCHEN_INCHARGE',
    nameBn: 'দুপুর ১২:০০ টায় রাজভোগ নিবেদন ও শুচিতা',
    nameEn: 'Midday Bhoga Offering & Kitchen Sanctity',
    priority: 'HIGH',
    titleBn: 'দুপুর ১২:০০ টায় রাজভোগ নিবেদন ও রান্নাঘরের শুচিতা রক্ষা',
    titleEn: 'Midday Bhoga Offering Protocol & Kitchen Sanctity',
    descBn: 'রান্নাঘরে সম্পূর্ণ বৈষ্ণব শুচিতা বজায় রাখতে হবে। স্নান করে ধৌত পোশাকে রান্না সম্পন্ন করতে হবে। দুপুর ১২:০০ টায় ঠিক সময়ে ভোগ নিবেদন নিশ্চিত করুন।',
    descEn: 'Maintain strict Vaishnava purity in kitchen. Cook after bath with fresh clothes. Midday offering at 12:00 PM sharp.',
    actionRequiredBn: '১২:০০ PM এর মধ্যে ভোগ নিবেদন সম্পন্ন করুন',
    actionRequiredEn: 'Complete offering by 12:00 PM sharp'
  },

  // 5. Study Care (Gian Juti Tripura + Pranto C Das)
  {
    id: 't_sc_1',
    roleKey: 'STUDY_CARE',
    nameBn: 'চবি সেমিস্টার পরীক্ষার রিভিশন সার্কেল',
    nameEn: 'CU Semester Exam Revision Circle',
    priority: 'HIGH',
    titleBn: 'চবি সেমিস্টার ফাইনাল পরীক্ষার বিষয়ভিত্তিক রিভিশন সার্কেল',
    titleEn: 'University Semester Exam Revision Circle Meeting',
    descBn: 'আসন্ন সেমিস্টার পরীক্ষার প্রস্তুতি জোরদার করতে সেবানন্দ গ্রন্থাগারে বিষয়ভিত্তিক স্টাডি গ্রুপ ও রিভিশন সার্কেল বসবে। সকল শিক্ষার্থীকে নিজেদের কোর্স নোট ও সিলেবাস নিয়ে উপস্থিত হতে বলা হচ্ছে।',
    descEn: 'Semester exam revision circles are being organized at Sebananda Library. All students are requested to attend with their academic notes and syllabus.',
    actionRequiredBn: 'শনিবার রাত ৮:০০ টায় স্টাডি সার্কেলে যোগ দিন',
    actionRequiredEn: 'Join study circle on Saturday 8:00 PM'
  },
  {
    id: 't_sc_2',
    roleKey: 'STUDY_CARE',
    nameBn: 'সাপ্তাহিক বিসিএস ও চাকরির কুইজ প্রতিযোগিতা',
    nameEn: 'Weekly BCS & Job Exam Mock Quiz',
    priority: 'MEDIUM',
    titleBn: 'সাপ্তাহিক বিসিএস, সাধারণ জ্ঞান ও ব্যাংক জব মক টেস্ট',
    titleEn: 'Weekly BCS, GK & Career Mock Test Competition',
    descBn: 'প্রতি শুক্রবার রাত ৮:১৫ টায় সাধারণ জ্ঞান, বাংলা ও গণিত বিষয়ে সাপ্তাহিক কুইজ ও বিসিএস প্রশ্ন সমাধান কর্মশালা অনুষ্ঠিত হবে।',
    descEn: 'Weekly 30-minute career mock test and BCS question solving circle will be held every Friday at 8:15 PM.',
    actionRequiredBn: 'শুক্রবার রাত ৮:১৫ টায় মক টেস্টে অংশগ্রহণ করুন',
    actionRequiredEn: 'Attend mock test on Friday 8:15 PM'
  },

  // 6. Medical & Guest Care (Bappy C Sarkar)
  {
    id: 't_med_1',
    roleKey: 'MEDICAL_GUEST',
    nameBn: 'অতিথি আগমন এন্ট্রি ও স্বাস্থ্য সেবা',
    nameEn: 'Guest Welcome & Medical Care Notice',
    priority: 'NORMAL',
    titleBn: 'আগত অতিথিদের আপ্যায়ন ও অসুস্থ ভক্তদের সেবা প্রটোকল',
    titleEn: 'Ashram Guest Hospitality & Medical Assistance Protocol',
    descBn: 'আশ্রমে আগত যেকোনো অতিথি ও অবিভাবকদের জন্য স্বাস্থ্যকর প্রসাদ ও পরিচ্ছন্ন আবাসন নিশ্চিত করা হবে। কোনো ভক্ত অসুস্থ হলে অবিলম্বে মেডিকেল ইনচার্জকে অবহিত করুন।',
    descEn: 'Ensure warm hospitality and clean lodging for all visiting devotees and guardians. Report any sickness to the medical incharge immediately.',
    actionRequiredBn: 'অসুস্থতায় অবিলম্বে মেডিকেল ইনচার্জকে জানান',
    actionRequiredEn: 'Report illness to Medical Incharge'
  },

  // 7. Security & Energy (Sangakara Das)
  {
    id: 't_sec_1',
    roleKey: 'SECURITY_ENERGY',
    nameBn: 'রাত ১০:০০ টায় প্রধান ফটক বন্ধ ও বিদ্যুৎ সাশ্রয়',
    nameEn: 'Gate Lock 10 PM & Energy Conservation',
    priority: 'HIGH',
    titleBn: 'রাত্রিকালীন প্রধান ফটক বন্ধের নিয়ম (১০:০০ PM) ও বিদ্যুৎ সাশ্রয়',
    titleEn: 'Main Gate Locking Protocol (10:00 PM) & Energy Saving',
    descBn: 'রাত ১০:০০ টায় আশ্রমের প্রধান ফটক বন্ধ করা হয়। ক্যাম্পাস ল্যাব বা পরীক্ষার কারণে দেরি হলে আগে অনুমতি নিতে হবে। অপ্রয়োজনে ফ্যান-লাইট জ্বালিয়ে রাখবেন না।',
    descEn: 'Main entrance is locked strictly at 10:00 PM. Prior permission is required for late entry. Switch off unused appliances.',
    actionRequiredBn: 'রাত ১০:০০ টার পূর্বে আশ্রমে প্রবেশ করুন',
    actionRequiredEn: 'Return to ashram before 10:00 PM'
  },

  // 8. Accounts (Ankon Nath)
  {
    id: 't_acc_1',
    roleKey: 'ACCOUNTS',
    nameBn: 'মাসিক আশ্রম হিসাব ও সেবা বিল সমন্বয়',
    nameEn: 'Monthly Accounts & Expense Settlement',
    priority: 'MEDIUM',
    titleBn: 'চলতি মাসের আশ্রম ব্যয় ভাউচার ও সেবা বিল জমাদানের নোটিশ',
    titleEn: 'Monthly Ashram Expense Vouchers & Bill Submission',
    descBn: 'বাজার, গ্যাস, বিদ্যুৎ বা যেকোনো সেবামূলক খরচের ভাউচার প্রতি মাসের ২৫ তারিখের মধ্যে হিসাব ইনচার্জের নিকট জমা দেওয়ার অনুরোধ করা হচ্ছে।',
    descEn: 'All department expense vouchers and bills must be submitted to the accounts incharge by the 25th of this month.',
    actionRequiredBn: '২৫ তারিখের মধ্যে সকল ভাউচার জমা দিন',
    actionRequiredEn: 'Submit all expense vouchers by 25th'
  },

  // 9. Deity Care (Antor Mohonto)
  {
    id: 't_deity_1',
    roleKey: 'DEITY_CARE',
    nameBn: 'বিগ্রহের অভিষেক ও পূজার পবিত্রতা প্রটোকল',
    nameEn: 'Deity Seva Sanctity & Abhisheka Schedule',
    priority: 'HIGH',
    titleBn: 'শ্রীশ্রী রাধামাধব ও গৌর-নিতাই বিগ্রহ সেবার শুচিতা বিধান',
    titleEn: 'Deity Altar Purity & Scheduled Puja Protocol',
    descBn: 'বেদীতে প্রবেশের পূর্বে অবশ্যই স্নান ও শুদ্ধ বস্ত্র পরিধান করতে হবে। সন্ধ্যারতির পূর্বে কর্পূর, চন্দন ও পুষ্পমাল্য প্রস্তুত রাখতে হবে।',
    descEn: 'Devotees entering the altar must take bath and wear fresh Vaishnava attire. Fresh garlands and incense must be ready before Arati.',
    actionRequiredBn: 'আরতির ৩০ মিনিট পূর্বে পুষ্পমাল্য প্রস্তুত রাখুন',
    actionRequiredEn: 'Keep flower garlands ready 30 min before arati'
  },

  // 10. Cleanliness & Water (Sangakara Das)
  {
    id: 't_cw_1',
    roleKey: 'CLEANLINESS_WATER',
    nameBn: 'পানির রিজার্ভ ট্যাংক পরিষ্কার ও পাম্প শিডিউল',
    nameEn: 'Water Tank Cleaning & Pump Schedule',
    priority: 'MEDIUM',
    titleBn: 'আশ্রমের পানির ফিল্টার ও ট্যাংক পরিচ্ছন্নতা অভিযান',
    titleEn: 'Ashram Water Filtration & Tank Maintenance Drive',
    descBn: 'পানির নিরবচ্ছিন্ন সরবরাহ ও বিশুদ্ধতা বজায় রাখতে নির্ধারিত সময়ে পাম্প চালু ও বন্ধ করা হয়। কোনো পানির ট্যাপ নষ্ট হলে অবিলম্বে মেরামত সেলে জানান।',
    descEn: 'Maintaining pure drinking water and pump schedule. Report any leaking taps immediately.',
    actionRequiredBn: 'পানির অপচয় রোধ করুন ও ট্যাপ বন্ধ রাখুন',
    actionRequiredEn: 'Conserve water & close taps tightly'
  },

  // 11. Tulasi Care (Antor Kumar Mohonta)
  {
    id: 't_tc_1',
    roleKey: 'TULASI_CARE',
    nameBn: 'শ্রীতুলসী সেবা, জলদান ও মঞ্জরী চয়ন বিধি',
    nameEn: 'Tulasi Care, Watering & Manjari Plucking',
    priority: 'NORMAL',
    titleBn: 'শ্রীতুলসী মহারানীর দৈনিক জলসেচন ও স্বাস্থ্য পরিচর্যা',
    titleEn: 'Daily Tulasi Maharani Watering & Manjari Offering',
    descBn: 'প্রতিদিন সকাল ৭:০০ টার পূর্বে তুলসী মহারানীকে জলদান করতে হবে। শুকিয়ে যাওয়া মঞ্জরী নিয়মিত চয়ন করে শ্রীভগবানের চরণে নিবেদন করুন।',
    descEn: 'Water Tulasi Maharani daily before 7:00 AM. Pluck dry manjaris with devotion and offer to the Lord.',
    actionRequiredBn: 'সকাল ৭:০০ টার পূর্বে তুলসী সেবা সম্পন্ন করুন',
    actionRequiredEn: 'Complete Tulasi seva before 7:00 AM'
  },

  // 12. Preaching Coordinator (US Joy + Roton C Roy)
  {
    id: 't_pr_1',
    roleKey: 'PREACHING_COORD',
    nameBn: 'ক্যাম্পাসে ডিওয়াইএস (DYS) কোর্স বুথ ও সেমিনার',
    nameEn: 'DYS Campus Outreach & Seminar Booth',
    priority: 'HIGH',
    titleBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় ক্যাম্পাসে Discover Your Self (DYS) প্রচার বুথ',
    titleEn: 'DYS Course Registration & Campus Preaching Booth',
    descBn: 'বিশ্ববিদ্যালয়ের বিভিন্ন অনুষদে নতুন শিক্ষার্থীদের মাঝে ডিওয়াইএস কোর্সের প্রচার ও রেজিস্ট্রেশন বুথ পরিচালিত হবে। সকল প্রচারককে নির্ধারিত শিফটে অংশ নেওয়ার অনুরোধ করা হলো।',
    descEn: 'DYS course registration booths will be active across university faculties. Preachers are requested to attend their assigned shifts.',
    actionRequiredBn: 'প্রচার বুথে যথাসময়ে উপস্থিত থাকুন',
    actionRequiredEn: 'Report to preaching booth on time'
  },

  // 13. Programme & Festivals (Akash Paul + Ankon Nath)
  {
    id: 't_fest_1',
    roleKey: 'PROGRAMME_FESTIVALS',
    nameBn: 'রবিবাসরীয় যুব মহোৎসব ও বিশেষ সংকীর্তন',
    nameEn: 'Sunday Youth Fest & Special Sankirtan',
    priority: 'HIGH',
    titleBn: 'রবিবার সাপ্তাহিক যুব মহোৎসব ও আনন্দভোজের প্রস্তুতি',
    titleEn: 'Sunday Mega Youth Festival & Feast Arrangements',
    descBn: 'আগামী রবিবার দুপুর ৩:০০ টা থেকে চবি ক্যাম্পাসের শিক্ষার্থীদের অংশগ্রহণে যুব উৎসব ও মহা সংকীর্তন অনুষ্ঠিত হবে। সংশ্লিষ্ট সকল সেবকদের দায়িত্ব পালনের জন্য অনুরোধ জানানো হচ্ছে।',
    descEn: 'Sunday Youth Festival begins at 3:00 PM for university students. All assigned seva teams are requested to complete setup on time.',
    actionRequiredBn: 'দুপুর ১:০০ টার মধ্যে স্টেজ ও সাউন্ড প্রস্তুত রাখুন',
    actionRequiredEn: 'Ensure stage & sound ready by 1:00 PM'
  }
];

interface PostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoleKey?: string;
  onNoticePosted?: (notice: ManagerAnnouncement) => void;
}

export const PostNoticeModal: React.FC<PostNoticeModalProps> = ({
  isOpen,
  onClose,
  initialRoleKey = 'COORDINATOR',
  onNoticePosted
}) => {
  const { language } = useLanguage();
  const [roleKey, setRoleKey] = useState<any>(initialRoleKey);
  const [inchargeNameEn, setInchargeNameEn] = useState('');
  const [inchargeNameBn, setInchargeNameBn] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'NORMAL'>('HIGH');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descBn, setDescBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [actionRequiredBn, setActionRequiredBn] = useState('');
  const [actionRequiredEn, setActionRequiredEn] = useState('');

  // Sync role defaults when initialRoleKey changes or roleKey is selected
  useEffect(() => {
    const selectedRole = ROLE_OPTIONS.find(r => r.key === (initialRoleKey || roleKey)) || ROLE_OPTIONS[0];
    setRoleKey(selectedRole.key);
    setInchargeNameEn(selectedRole.inchargeEn);
    setInchargeNameBn(selectedRole.inchargeBn);
  }, [initialRoleKey, isOpen]);

  const handleRoleChange = (key: string) => {
    setRoleKey(key);
    const selectedRole = ROLE_OPTIONS.find(r => r.key === key);
    if (selectedRole) {
      setInchargeNameEn(selectedRole.inchargeEn);
      setInchargeNameBn(selectedRole.inchargeBn);
    }
  };

  const applyTemplate = (t: NoticeTemplate) => {
    setPriority(t.priority);
    setTitleBn(t.titleBn);
    setTitleEn(t.titleEn);
    setDescBn(t.descBn);
    setDescEn(t.descEn);
    setActionRequiredBn(t.actionRequiredBn);
    setActionRequiredEn(t.actionRequiredEn);
    toast.success(language === 'bn' ? '✨ টেমপ্লেট লোড হয়েছে!' : '✨ Template loaded!');
  };

  const relevantTemplates = NOTICE_TEMPLATES.filter(t => t.roleKey === roleKey);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() && !titleEn.trim()) {
      toast.error(language === 'bn' ? 'অনুগ্রহ করে নোটিশের শিরোনাম দিন' : 'Please enter notice title');
      return;
    }
    if (!descBn.trim() && !descEn.trim()) {
      toast.error(language === 'bn' ? 'অনুগ্রহ করে নোটিশের বিস্তারিত বিবরণ দিন' : 'Please enter notice description');
      return;
    }

    const selectedRole = ROLE_OPTIONS.find(r => r.key === roleKey) || ROLE_OPTIONS[0];

    const finalTitleBn = titleBn.trim() || titleEn.trim();
    const finalTitleEn = titleEn.trim() || titleBn.trim();
    const finalDescBn = descBn.trim() || descEn.trim();
    const finalDescEn = descEn.trim() || descBn.trim();

    const created = addStoredNotice({
      roleKey,
      roleTitleEn: selectedRole.titleEn,
      roleTitleBn: selectedRole.titleBn,
      inchargeNameEn: inchargeNameEn || selectedRole.inchargeEn,
      inchargeNameBn: inchargeNameBn || selectedRole.inchargeBn,
      priority,
      titleEn: finalTitleEn,
      titleBn: finalTitleBn,
      descEn: finalDescEn,
      descBn: finalDescBn,
      actionRequiredBn: actionRequiredBn.trim() || undefined,
      actionRequiredEn: actionRequiredEn.trim() || undefined,
    });

    toast.success(language === 'bn' ? '📢 নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!' : '📢 Notice published successfully!');
    if (onNoticePosted) onNoticePosted(created);
    
    // Reset inputs & close
    setTitleBn('');
    setTitleEn('');
    setDescBn('');
    setDescEn('');
    setActionRequiredBn('');
    setActionRequiredEn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600/15 text-rose-600 dark:text-rose-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'bn' ? '📢 নতুন ব্যবস্থাপনা নোটিশ প্রকাশ' : '📢 Post Official Manager Notice'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'সকল আশ্রমবাসী ও শিক্ষার্থীদের জন্য জরুরি নির্দেশনা ও এসওপি' : 'Broadcast official directives & SOPs to all residents'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Department / Manager Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'বিভাগ / ম্যানেজারের ভূমিকা নির্বাচন করুন *' : 'Select Department / Manager Section *'}
            </label>
            <select
              value={roleKey}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              <optgroup label="Executive Leadership">
                <option value="COORDINATOR">Overall Co-Ordinator (Utpol Das Khocon)</option>
              </optgroup>
              <optgroup label="Column 1: Ashram & Daily Operations">
                <option value="INTERNAL_MGR">Internal Manager (Dipendranath Roy)</option>
                <option value="MORNING_PROG">Morning Programme (Joykanto Roy)</option>
                <option value="KITCHEN_INCHARGE">Kitchen Incharge (Antor Mohonto)</option>
                <option value="STUDY_CARE">Study Care (Gian Juti Tripura + Pranto C Das)</option>
                <option value="MEDICAL_GUEST">Medical & Guest Care (Bappy C Sarkar)</option>
                <option value="SECURITY_ENERGY">Security & Energy Manager (Sangakara Das)</option>
              </optgroup>
              <optgroup label="Column 2: Maintenance & Services">
                <option value="ACCOUNTS">Accounts (Ankon Nath)</option>
                <option value="DEITY_CARE">Deity Care (Antor Mohonto)</option>
                <option value="EASY_MEMBERSHIPS">Easy Memberships (Ankon Nath)</option>
                <option value="CLEANLINESS_WATER">Cleanliness & Water (Sangakara Das)</option>
                <option value="TULASI_CARE">Tulasi Care (Antor Kumar Mohonta)</option>
                <option value="SADHANA_RESOURCES">Sadhana Resources (Akash Paul)</option>
              </optgroup>
              <optgroup label="Column 3: Preaching, Courses & Festivals">
                <option value="PREACHING_COORD">Preaching Co-Ordinator (US Joy + Roton C Roy)</option>
                <option value="MONTHLY_REPORT">Monthly-Report Manager (Ankon Nath)</option>
                <option value="COURSE_CAMPS">Course-Camps (Preaching Co-ordinators)</option>
                <option value="BTG_CS">BTG-CS (Dipendranath Roy)</option>
                <option value="COURSE_CAMP_ASST">Course-Camp-Assistant (Roton Roy)</option>
                <option value="PROGRAMME_FESTIVALS">Programme & Festivals (Akash Paul + Ankon Nath)</option>
              </optgroup>
              <optgroup label="General">
                <option value="GENERAL">General Ashram Notice (Advaita VOICE Admin)</option>
              </optgroup>
            </select>
          </div>

          {/* Quick Notice Templates for Selected Role */}
          {relevantTemplates.length > 0 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span>{language === 'bn' ? '⚡ দ্রুত নোটিশ টেমপ্লেট (১ ক্লিকে লোড করুন)' : '⚡ Quick Templates (Click to Autoload)'}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {relevantTemplates.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 border border-amber-300/60 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={11} className="text-amber-500" />
                    <span>{language === 'bn' ? t.nameBn : t.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Incharge Name & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'ইনচার্জের নাম (বাংলা)' : 'Incharge Name (Bangla)'}
              </label>
              <input
                type="text"
                value={inchargeNameBn}
                onChange={(e) => setInchargeNameBn(e.target.value)}
                placeholder="যেমন: জ্ঞান জ্যোতি ত্রিপুরা"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'অগ্রাধিকার (Priority) *' : 'Notice Priority *'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['HIGH', 'MEDIUM', 'NORMAL'] as const).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                      priority === p
                        ? p === 'HIGH' ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : p === 'MEDIUM' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notice Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'নোটিশের শিরোনাম (বাংলা) *' : 'Notice Title (Bangla) *'}
            </label>
            <input
              type="text"
              required
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="যেমন: আগামী শুক্রবারের বিশেষ স্টাডি কেয়ার ও রিভিশন মিটিং"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Notice Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'বিস্তারিত নোটিশ বিবরণ ও নির্দেশনা *' : 'Detailed Notice Description & Instructions *'}
            </label>
            <textarea
              required
              rows={4}
              value={descBn}
              onChange={(e) => setDescBn(e.target.value)}
              placeholder="সকল আশ্রমবাসী ও শিক্ষার্থীদের উদ্দেশ্যে প্রয়োজনীয় নির্দেশনা ও সময়সূচি লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-normal text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Action Required */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-amber-500" />
              <span>{language === 'bn' ? 'বাধ্যতামূলক করণীয় (Action Required)' : 'Action Required / Deadline'}</span>
            </label>
            <input
              type="text"
              value={actionRequiredBn}
              onChange={(e) => setActionRequiredBn(e.target.value)}
              placeholder="যেমন: রাত ৮:০০ টার মধ্যে উপস্থিতি নিশ্চিত করুন"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>{language === 'bn' ? '📢 এখনই নোটিশ প্রকাশ করুন' : '📢 Publish Notice Now'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default PostNoticeModal;
