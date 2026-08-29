export interface ManagerAnnouncement {
  id: string;
  roleKey: 'COORDINATOR' | 'INTERNAL_MGR' | 'MORNING_PROG' | 'SECURITY_MGR' | 'STUDY_CARE' | 'KITCHEN_MGR' | 'PREACHING' | 'LIBRARY' | 'GENERAL';
  roleTitleEn: string;
  roleTitleBn: string;
  inchargeNameEn: string;
  inchargeNameBn: string;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  date: string;
  actionRequiredEn?: string;
  actionRequiredBn?: string;
}

const STORAGE_KEY = 'advaita_voice_real_notices_v2';

export const getStoredNotices = (): ManagerAnnouncement[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading notices:', e);
    return [];
  }
};

export const saveStoredNotices = (notices: ManagerAnnouncement[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    window.dispatchEvent(new Event('advaita_notices_updated'));
  } catch (e) {
    console.error('Error saving notices:', e);
  }
};

export const addStoredNotice = (newNotice: Omit<ManagerAnnouncement, 'id' | 'date'>): ManagerAnnouncement => {
  const notices = getStoredNotices();
  const noticeItem: ManagerAnnouncement = {
    ...newNotice,
    id: 'notice_' + Date.now(),
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };
  const updated = [noticeItem, ...notices];
  saveStoredNotices(updated);
  return noticeItem;
};

export const deleteStoredNotice = (id: string): void => {
  const notices = getStoredNotices();
  const updated = notices.filter(n => n.id !== id);
  saveStoredNotices(updated);
};

export const clearAllStoredNotices = (): void => {
  saveStoredNotices([]);
};
