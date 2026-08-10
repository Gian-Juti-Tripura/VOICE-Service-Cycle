import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple dictionary
const translations: Record<Language, Record<string, string>> = {
  bn: {
    'app.title': 'ভয়েস সেবা ব্যবস্থাপনা',
    'nav.logout': 'লগআউট',
    'nav.login': 'লগইন',
    'login.title': 'সাইন ইন করুন',
    'login.email': 'ইমেইল',
    'login.password': 'পাসওয়ার্ড',
    'login.button': 'লগইন',
    'login.loading': 'অপেক্ষা করুন...',
    'login.error': 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    'signup.title': 'নতুন একাউন্ট তৈরি করুন',
    'signup.name': 'পুরো নাম',
    'signup.phone': 'মোবাইল নম্বর',
    'signup.dob': 'জন্ম তারিখ',
    'signup.button': 'সাইন আপ',
    'signup.error': 'সাইন আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    'auth.toggle.toSignup': 'একাউন্ট নেই? সাইন আপ করুন',
    'auth.toggle.toLogin': 'একাউন্ট আছে? লগইন করুন',
    'auth.showPassword': 'পাসওয়ার্ড দেখুন',
    'auth.hidePassword': 'পাসওয়ার্ড লুকান',
    'manager.dashboard': 'ম্যানেজার ড্যাশবোর্ড',
    'manager.today': 'আজ',
    'manager.totalMembers': 'মোট সদস্য',
    'manager.activeServices': 'সক্রিয় সেবা',
    'manager.absentServices': 'অনুপস্থিত সেবা',
    'manager.replacementServices': 'বিকল্প সেবা',
    'member.dashboard': 'সদস্য ড্যাশবোর্ড',
    'member.greeting': '🙏 হরে কৃষ্ণ',
    'member.todayService': 'আজকের সেবা',
    'member.tomorrowService': 'আগামীকালের সেবা',
    
    // Phase 2
    'membersTitle': 'সদস্য তালিকা',
    'addMember': 'নতুন সদস্য যোগ করুন',
    'editMember': 'সদস্য সম্পাদনা করুন',
    'servicesTitle': 'সেবা তালিকা',
    'addService': 'নতুন সেবা যোগ করুন',
    'editService': 'সেবা সম্পাদনা করুন',
    'name': 'নাম',
    'phone': 'ফোন নম্বর',
    'dob': 'জন্ম তারিখ',
    'status': 'অবস্থা',
    'actions': 'পদক্ষেপ',
    'timing': 'সময়',
    'save': 'সংরক্ষণ করুন',
    'loading': 'লোড হচ্ছে...',
    'noMembers': 'কোন সদস্য পাওয়া যায়নি',
    'noServices': 'কোন সেবা পাওয়া যায়নি',
  },
  en: {
    'app.title': 'VOICE Service Management',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'login.title': 'Sign In',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.loading': 'Please wait...',
    'login.error': 'Login failed. Please try again.',
    'signup.title': 'Create Account',
    'signup.name': 'Full Name',
    'signup.phone': 'Mobile Number',
    'signup.dob': 'Date of Birth',
    'signup.button': 'Sign Up',
    'signup.error': 'Sign Up failed. Please try again.',
    'auth.toggle.toSignup': 'Need an account? Sign Up',
    'auth.toggle.toLogin': 'Already have an account? Login',
    'auth.showPassword': 'Show password',
    'auth.hidePassword': 'Hide password',
    'manager.dashboard': 'Manager Dashboard',
    'manager.today': 'Today',
    'manager.totalMembers': 'Total Members',
    'manager.activeServices': 'Active Services',
    'manager.absentServices': 'Absent Services',
    'manager.replacementServices': 'Replacement Services',
    'member.dashboard': 'Member Dashboard',
    'member.greeting': '🙏 Hare Krishna',
    'member.todayService': 'Today\'s Service',
    'member.tomorrowService': 'Tomorrow\'s Service',
    
    // Phase 2
    'membersTitle': 'Members List',
    'addMember': 'Add New Member',
    'editMember': 'Edit Member',
    'servicesTitle': 'Services List',
    'addService': 'Add New Service',
    'editService': 'Edit Service',
    'name': 'Name',
    'phone': 'Phone',
    'dob': 'Date of Birth',
    'status': 'Status',
    'actions': 'Actions',
    'timing': 'Timing',
    'save': 'Save',
    'loading': 'Loading...',
    'noMembers': 'No members found',
    'noServices': 'No services found',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');

  useEffect(() => {
    // Load preference from local storage if available
    const savedLang = localStorage.getItem('voice_lang') as Language;
    if (savedLang === 'bn' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('voice_lang', newLang);
      return newLang;
    });
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
