import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { addStoredNotice, type ManagerAnnouncement } from '../../utils/noticesStore';
import { 
  Send, X, AlertCircle, ShieldAlert, Sparkles, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ROLE_OPTIONS = [
  { key: 'COORDINATOR', titleEn: 'Central Coordinator', titleBn: 'সার্বিক সমন্বয়ক (ওসি)', inchargeEn: 'Utpol Das Khocon', inchargeBn: 'উৎপল দাস খোকন' },
  { key: 'STUDY_CARE', titleEn: 'Study Care (Academic & Career)', titleBn: 'স্টাডি কেয়ার (শিক্ষা ও ক্যারিয়ার)', inchargeEn: 'Gian Juti Tripura + Pranto C Das', inchargeBn: 'জ্ঞান জ্যোতি ত্রিপুরা ও প্রান্ত চন্দ্র দাস' },
  { key: 'INTERNAL_MGR', titleEn: 'Internal Manager', titleBn: 'অভ্যন্তরীণ ব্যবস্থাপক', inchargeEn: 'Dipendranath Roy', inchargeBn: 'দীপেন্দ্রনাথ রায়' },
  { key: 'MORNING_PROG', titleEn: 'Morning Program Incharge', titleBn: 'মর্নিং প্রোগ্রাম ইনচার্জ', inchargeEn: 'Jaydev Sebamoy Das', inchargeBn: 'জয়দেব সেবাময় দাস' },
  { key: 'SECURITY_MGR', titleEn: 'Security Manager', titleBn: 'নিরাপত্তা ব্যবস্থাপক', inchargeEn: 'Bappa Mohury', inchargeBn: 'বাপ্পা মহুরী' },
  { key: 'KITCHEN_MGR', titleEn: 'Kitchen & Prasadam Incharge', titleBn: 'রান্না ও প্রসাদম ইনচার্জ', inchargeEn: 'Ramanath Shyam Das', inchargeBn: 'রমানাথ শ্যাম দাস' },
  { key: 'PREACHING', titleEn: 'Preaching & Youth Outreach', titleBn: 'প্রচার ও যুব উন্নয়ন', inchargeEn: 'Preaching Council', inchargeBn: 'প্রচার পরিষদ' },
  { key: 'LIBRARY', titleEn: 'Sebananda Library & Books', titleBn: 'সেবানন্দ গ্রন্থাগার ও গ্রন্থ বিতরণ', inchargeEn: 'Library Incharge', inchargeBn: 'গ্রন্থাগার ইনচার্জ' },
  { key: 'GENERAL', titleEn: 'General Management Notice', titleBn: 'সাধারণ ব্যবস্থাপনা নোটিশ', inchargeEn: 'Advaita VOICE Admin', inchargeBn: 'অদ্বৈত ভয়েস প্রশাসন' },
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
  // 1. COORDINATOR
  {
    id: 't_coord_1',
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
    id: 't_coord_2',
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

  // 2. STUDY CARE (Gian Juti Tripura & Pranto C Das)
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
  {
    id: 't_sc_3',
    roleKey: 'STUDY_CARE',
    nameBn: 'দৈনিক ২ ঘণ্টার বাধ্যতামূলক পড়াশোনা',
    nameEn: 'Daily 2-Hour Mandatory Academic Study',
    priority: 'NORMAL',
    titleBn: 'দৈনিক ২ ঘণ্টার নিয়মিত পড়াশোনা ও লাইব্রেরি ঘণ্টা নিশ্চিতকরণ',
    titleEn: 'Daily 2-Hour Academic Study Commitment',
    descBn: 'আশ্রমের সকল শিক্ষার্থীকে দৈনিক কমপক্ষে ২ ঘণ্টা বিশ্ববিদ্যালয়ের পড়ালেখায় মনোনিবেশ করার নির্দেশ দেওয়া হলো। পড়াশোনার সময় মোবাইল ফোন সাইলেন্ট রাখতে হবে।',
    descEn: 'All student residents must maintain a minimum of 2 hours daily focused academic study with digital distractions turned off.',
    actionRequiredBn: 'পড়ার টেবিলে মোবাইল সাইলেন্ট রাখুন',
    actionRequiredEn: 'Keep phones silent during study hours'
  },

  // 3. INTERNAL MANAGER (Dipendranath Roy)
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
  {
    id: 't_int_2',
    roleKey: 'INTERNAL_MGR',
    nameBn: 'বিদ্যুৎ ও পানির অপচয় রোধ সংক্রান্ত নোটিশ',
    nameEn: 'Electricity & Water Conservation Notice',
    priority: 'MEDIUM',
    titleBn: 'কক্ষ ত্যাগকালে লাইট-ফ্যান বন্ধ ও পানির অপচয় রোধের নির্দেশ',
    titleEn: 'Switch Off Lights/Fans When Leaving & Save Water',
    descBn: 'কক্ষ থেকে বের হওয়ার সময় অবশ্যই লাইট, ফ্যান ও চার্জার সুইচ বন্ধ করুন। পানির ট্যাপ ব্যবহারের পর ভালোভাবে বন্ধ করুন। আশ্রমের সম্পদ রক্ষা আমাদের সকলের বৈষ্ণবীয় সেবা।',
    descEn: 'Always switch off lights and fans before leaving the room. Turn off water taps properly. Conserving ashram resources is devotional service.',
    actionRequiredBn: 'রুম ত্যাগের সময় সকল সুইচ বন্ধ করুন',
    actionRequiredEn: 'Switch off all electrical appliances before leaving'
  },

  // 4. MORNING PROGRAM (Jaydev Sebamoy Das)
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
  {
    id: 't_mp_2',
    roleKey: 'MORNING_PROG',
    nameBn: 'সাপ্তাহিক ভাগবত প্রবচন ও শ্লোক পাঠ',
    nameEn: 'Daily Srimad Bhagavatam Discourse & Verses',
    priority: 'NORMAL',
    titleBn: 'প্রাতঃকালীন শ্রীমদ্ভাগবত প্রবচন ও শ্লোক আবৃত্তি সেশন',
    titleEn: 'Daily Srimad Bhagavatam Class & Verse Memorization',
    descBn: 'প্রতিদিন সকাল ৭:৩০ টায় শ্রীমদ্ভাগবত প্রবচন অনুষ্ঠিত হয়। সকল শিক্ষার্থীকে নির্ধারিত শ্লোক মুখস্থ করে ক্লাসে যোগ দেওয়ার অনুরোধ করা হচ্ছে।',
    descEn: 'Daily Srimad Bhagavatam discourse starts at 7:30 AM. Students are encouraged to memorize the daily verse.',
    actionRequiredBn: 'সকাল ৭:৩০ টায় ভাগবত ক্লাসে উপস্থিত হোন',
    actionRequiredEn: 'Attend 7:30 AM Bhagavatam Class'
  },

  // 5. SECURITY MANAGER (Bappa Mohury)
  {
    id: 't_sec_1',
    roleKey: 'SECURITY_MGR',
    nameBn: 'রাত ১০:০০ টায় প্রধান ফটক বন্ধ ও গেস্ট এন্ট্রি',
    nameEn: 'Night Gate Locking Protocol (10:00 PM)',
    priority: 'HIGH',
    titleBn: 'রাত্রিকালীন প্রধান ফটক বন্ধের নিয়ম (১০:০০ PM) ও গেস্ট রেজিস্ট্রি',
    titleEn: 'Main Entrance Gate Locking (10:00 PM) & Visitor Registry',
    descBn: 'রাত ১০:০০ টায় আশ্রমের প্রধান ফটক তালাবদ্ধ করা হয়। ক্যাম্পাস ল্যাব বা বিশেষ প্রয়োজনে দেরিতে প্রবেশের জন্য আগেই ইনচার্জকে জানাতে হবে। বহিরাগত সকল অতিথির রেজিস্টারে এন্ট্রি বাধ্যতামূলক।',
    descEn: 'Main entrance is locked strictly at 10:00 PM. Prior permission is required for late entry due to university lab/exams. Visitors must sign the logbook.',
    actionRequiredBn: 'রাত ১০:০০ টার পূর্বে আশ্রমে প্রবেশ করুন',
    actionRequiredEn: 'Return to ashram before 10:00 PM'
  },

  // 6. KITCHEN & PRASADAM (Ramanath Shyam Das)
  {
    id: 't_kitch_1',
    roleKey: 'KITCHEN_MGR',
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
  {
    id: 't_kitch_2',
    roleKey: 'KITCHEN_MGR',
    nameBn: 'রবিবাসরীয় যুব ফিস্ট সবজি কাটা ও রান্না প্রস্তুতি',
    nameEn: 'Sunday Youth Feast Veg Prep & Cooking',
    priority: 'HIGH',
    titleBn: 'রবিবার সাপ্তাহিক যুব ফিস্ট সবজি কাটা ও রন্ধন সেবা',
    titleEn: 'Sunday Youth Feast Vegetable Prep & Seva Call',
    descBn: 'রবিবাসরীয় বৃহৎ যুব উৎসবের জন্য সকাল ৮:০০ টায় সবজি কাটা ও রন্ধন সেবা শুরু হবে। নির্ধারিত সেবকদের যথাসময়ে রান্নাঘরে উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।',
    descEn: 'Vegetable prep for Sunday Youth Feast starts at 8:00 AM. Assigned devotees are requested to report on time.',
    actionRequiredBn: 'সকাল ৮:০০ টায় রান্নাঘরে উপস্থিত থাকুন',
    actionRequiredEn: 'Report to kitchen at 8:00 AM'
  },

  // 7. PREACHING (Preaching Council)
  {
    id: 't_pr_1',
    roleKey: 'PREACHING',
    nameBn: 'ক্যাম্পাসে ডিওয়াইএস (DYS) কোর্স বুথ',
    nameEn: 'DYS Campus Outreach & Seminar Booth',
    priority: 'HIGH',
    titleBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় ক্যাম্পাসে Discover Your Self (DYS) কোর্স বুথ',
    titleEn: 'DYS Course Registration & Campus Preaching Booth',
    descBn: 'বিশ্ববিদ্যালয়ের বিভিন্ন অনুষদে নতুন শিক্ষার্থীদের মাঝে ডিওয়াইএস কোর্সের প্রচার ও রেজিস্ট্রেশন বুথ পরিচালিত হবে। সকল প্রচারককে নির্ধারিত শিফটে অংশ নেওয়ার অনুরোধ করা হলো।',
    descEn: 'DYS course registration booths will be active across university faculties. Preachers are requested to attend their assigned shifts.',
    actionRequiredBn: 'প্রচার বুথে যথাসময়ে উপস্থিত থাকুন',
    actionRequiredEn: 'Report to preaching booth on time'
  },

  // 8. LIBRARY (Sebananda Library)
  {
    id: 't_lib_1',
    roleKey: 'LIBRARY',
    nameBn: 'গ্রন্থাগার থেকে বই ইস্যু ও ৭ দিনের মধ্যে ফেরত',
    nameEn: 'Library Book Return & Borrowing Policy',
    priority: 'MEDIUM',
    titleBn: 'সেবানন্দ গ্রন্থাগারের বই ইস্যু ও সময়মত ফেরত সংক্রান্ত নির্দেশিকা',
    titleEn: 'Sebananda Library Borrowing & 7-Day Return Policy',
    descBn: 'গ্রন্থাগার থেকে গৃহীত যেকোনো শাস্ত্রীয় বা একাডেমিক বই সর্বোচ্চ ৭ দিনের জন্য রাখা যাবে। বই ব্যবহারের পর রেজিস্টারে ফেরত এন্ট্রি নিশ্চিত করুন।',
    descEn: 'Books borrowed from Sebananda Library can be retained for maximum 7 days. Return entries must be recorded.',
    actionRequiredBn: '৭ দিনের মধ্যে বই ফেরত প্রদান করুন',
    actionRequiredEn: 'Return borrowed books within 7 days'
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
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {language === 'bn' ? `${opt.titleBn} (${opt.inchargeBn})` : `${opt.titleEn} (${opt.inchargeEn})`}
                </option>
              ))}
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
