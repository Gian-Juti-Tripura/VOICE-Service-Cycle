/**
 * Theme & Visual Experience Engine for Advaita VOICE Hub
 * Supports:
 * - Appearance Mode: Light / Dark / System
 * - Personal Choice Color Palettes (Chrome-style spiritual themes)
 * - Toggling Flower Showering Effects (Pushpa Vrishti)
 * - Toggling Ambient Divine Lighting & Sunrays Effects
 * - Toggling Sri Krishna & Vrindavan Background Atmosphere
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemePaletteId = 
  | 'saffron'  // Vedic Saffron & Royal Gold (Default)
  | 'lotus'    // Vrindavan Rose & Lotus
  | 'emerald'  // Govardhan & Sacred Tulasi
  | 'ocean'    // Yamuna & Shyam Sundar Blue
  | 'royal'    // Navadvipa Royal Purple
  | 'sunrise'; // Braja Dawn & Radiant Marigold

export interface ThemePaletteConfig {
  id: ThemePaletteId;
  nameEn: string;
  nameBn: string;
  taglineEn: string;
  taglineBn: string;
  previewColors: string[]; // 3 preview swatches
  primaryHex: string;
  accentHex: string;
  lightBannerGradient: string;
  darkBannerGradient: string;
  activeRing: string;
  activeBorder: string;
  badgeBg: string;
  badgeText: string;
  cardGlow: string;
}

export const THEME_PALETTES: ThemePaletteConfig[] = [
  {
    id: 'saffron',
    nameEn: 'Vedic Saffron & Gold (Default)',
    nameBn: 'বৈদিক জাফরান ও স্বর্ণ (ডিফল্ট)',
    taglineEn: 'Classic Chaitanya Mahaprabhu golden radiance',
    taglineBn: 'শ্রীশ্রী গৌরাঙ্গের স্বর্ণদ্যুতি ও আনন্দময় রূপ',
    previewColors: ['#f59e0b', '#d97706', '#b45309'],
    primaryHex: '#f59e0b',
    accentHex: '#d97706',
    lightBannerGradient: 'from-amber-600 via-orange-600 to-amber-700',
    darkBannerGradient: 'from-slate-950 via-slate-900 to-amber-950',
    activeRing: 'ring-amber-500',
    activeBorder: 'border-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-700 dark:text-amber-400',
    cardGlow: 'rgba(245, 158, 11, 0.25)'
  },
  {
    id: 'lotus',
    nameEn: 'Vrindavan Rose & Lotus',
    nameBn: 'বৃন্দাবন পদ্ম ও গোলাপ',
    taglineEn: 'Srimati Radharani lotus petals & garland',
    taglineBn: 'শ্রীমতী রাধারাণীর চরণপদ্ম ও দিব্য কুসুমাবলী',
    previewColors: ['#f43f5e', '#e11d48', '#be123c'],
    primaryHex: '#f43f5e',
    accentHex: '#e11d48',
    lightBannerGradient: 'from-rose-600 via-pink-600 to-rose-700',
    darkBannerGradient: 'from-slate-950 via-slate-900 to-rose-950',
    activeRing: 'ring-rose-500',
    activeBorder: 'border-rose-500',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-700 dark:text-rose-400',
    cardGlow: 'rgba(244, 63, 94, 0.25)'
  },
  {
    id: 'emerald',
    nameEn: 'Govardhan & Sacred Tulasi',
    nameBn: 'গোবর্ধন ও তুলসী কানন',
    taglineEn: 'Sacred peacocks, Vrinda devi & Govardhana hill',
    taglineBn: 'শ্রীগিরিরাজ গোবর্ধন ও শ্রীমতী তুলসী দেবীর কুঞ্জ',
    previewColors: ['#10b981', '#059669', '#047857'],
    primaryHex: '#10b981',
    accentHex: '#059669',
    lightBannerGradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    darkBannerGradient: 'from-slate-950 via-slate-900 to-emerald-950',
    activeRing: 'ring-emerald-500',
    activeBorder: 'border-emerald-500',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    cardGlow: 'rgba(16, 185, 129, 0.25)'
  },
  {
    id: 'ocean',
    nameEn: 'Yamuna & Shyam Sundar Blue',
    nameBn: 'যমুনা ও শ্যামসুন্দর নীল',
    taglineEn: 'Lord Krishna divine Shyam complexion & river Yamuna',
    taglineBn: 'শ্রীকৃষ্ণের শ্যামল বর্ণ ও পুণ্যতোয়া কালিন্দী যমুনা',
    previewColors: ['#3b82f6', '#2563eb', '#1d4ed8'],
    primaryHex: '#3b82f6',
    accentHex: '#2563eb',
    lightBannerGradient: 'from-blue-600 via-indigo-600 to-blue-700',
    darkBannerGradient: 'from-slate-950 via-slate-900 to-blue-950',
    activeRing: 'ring-blue-500',
    activeBorder: 'border-blue-500',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-700 dark:text-blue-400',
    cardGlow: 'rgba(59, 130, 246, 0.25)'
  },
  {
    id: 'royal',
    nameEn: 'Navadvipa Royal Purple',
    nameBn: 'শ্রীধাম রাজকীয় নীলাম্বর',
    taglineEn: 'Regal devotion & Navadvipa dham majesty',
    taglineBn: 'শ্রীধাম নবদ্বীপের রাজকীয় গাম্ভীর্য ও সেবা মহিমা',
    previewColors: ['#8b5cf6', '#7c3aed', '#6d28d9'],
    primaryHex: '#8b5cf6',
    accentHex: '#7c3aed',
    lightBannerGradient: 'from-purple-600 via-violet-600 to-indigo-700',
    darkBannerGradient: 'from-slate-950 via-slate-900 to-purple-950',
    activeRing: 'ring-purple-500',
    activeBorder: 'border-purple-500',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-700 dark:text-purple-400',
    cardGlow: 'rgba(139, 92, 246, 0.25)'
  },
  {
    id: 'sunrise',
    nameEn: 'Braja Dawn & Radiant Marigold',
    nameBn: 'ব্রজ প্রভাত ও সিঁদুর অরুণ',
    taglineEn: 'Mangala arotik dawn & vibrant devotional energy',
    taglineBn: 'মঙ্গলারতির অপূর্ব ব্রাহ্মমুহূর্ত ও প্রাণবন্ত অরুণালোক',
    previewColors: ['#f97316', '#ea580c', '#c2410c'],
    primaryHex: '#f97316',
    accentHex: '#ea580c',
    lightBannerGradient: 'from-orange-600 via-amber-600 to-red-600',
    darkBannerGradient: 'from-slate-950 via-slate-900 to-orange-950',
    activeRing: 'ring-orange-500',
    activeBorder: 'border-orange-500',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-700 dark:text-orange-400',
    cardGlow: 'rgba(249, 115, 22, 0.25)'
  }
];

export interface ThemeSettingsState {
  mode: ThemeMode;
  palette: ThemePaletteId;
  flowerShower: boolean;
  lightingEffects: boolean;
  backgroundAtmosphere: boolean;
}

export const THEME_UPDATED_EVENT = 'advaita_theme_updated';

const STORAGE_KEYS = {
  MODE: 'advaita_theme_mode',
  PALETTE: 'advaita_theme_palette',
  FLOWERS: 'advaita_theme_flower_shower',
  LIGHTING: 'advaita_theme_lighting_effects',
  BACKGROUND: 'advaita_theme_bg_atmosphere'
};

/**
 * Determine if dark class should be applied based on mode
 */
export const isDarkEffective = (mode: ThemeMode): boolean => {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  // system
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

/**
 * Load current theme settings from localStorage with robust fallbacks
 */
export const getThemeSettings = (): ThemeSettingsState => {
  try {
    const rawMode = (localStorage.getItem(STORAGE_KEYS.MODE) || localStorage.getItem('theme')) as ThemeMode;
    const mode: ThemeMode = (rawMode === 'dark' || rawMode === 'light' || rawMode === 'system') ? rawMode : 'light';

    const rawPalette = localStorage.getItem(STORAGE_KEYS.PALETTE) as ThemePaletteId;
    const validPalettes: ThemePaletteId[] = ['saffron', 'lotus', 'emerald', 'ocean', 'royal', 'sunrise'];
    const palette: ThemePaletteId = validPalettes.includes(rawPalette) ? rawPalette : 'saffron';

    const rawFlowers = localStorage.getItem(STORAGE_KEYS.FLOWERS);
    const flowerShower = rawFlowers === null ? true : rawFlowers === 'true';

    const rawLighting = localStorage.getItem(STORAGE_KEYS.LIGHTING);
    const lightingEffects = rawLighting === null ? true : rawLighting === 'true';

    const rawBg = localStorage.getItem(STORAGE_KEYS.BACKGROUND);
    const backgroundAtmosphere = rawBg === null ? true : rawBg === 'true';

    return {
      mode,
      palette,
      flowerShower,
      lightingEffects,
      backgroundAtmosphere
    };
  } catch (e) {
    console.error('Failed to load theme settings:', e);
    return {
      mode: 'light',
      palette: 'saffron',
      flowerShower: true,
      lightingEffects: true,
      backgroundAtmosphere: true
    };
  }
};

/**
 * Apply theme settings to DOM (HTML root, classes, data attributes, CSS variables)
 */
export const applyThemeToDOM = (settings: ThemeSettingsState) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = isDarkEffective(settings.mode);

  // Apply dark class
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Apply attributes
  root.setAttribute('data-theme-palette', settings.palette);
  root.setAttribute('data-lighting', settings.lightingEffects ? 'on' : 'off');
  root.setAttribute('data-flowers', settings.flowerShower ? 'on' : 'off');
  root.setAttribute('data-bg-atmosphere', settings.backgroundAtmosphere ? 'on' : 'off');

  // Find palette config and apply primary CSS variables
  const config = THEME_PALETTES.find(p => p.id === settings.palette) || THEME_PALETTES[0];
  root.style.setProperty('--advaita-primary', config.primaryHex);
  root.style.setProperty('--advaita-accent', config.accentHex);
  root.style.setProperty('--advaita-glow', config.cardGlow);
};

/**
 * Save theme settings and broadcast updates
 */
export const saveThemeSettings = (newSettings: Partial<ThemeSettingsState>): ThemeSettingsState => {
  const current = getThemeSettings();
  const updated: ThemeSettingsState = {
    ...current,
    ...newSettings
  };

  try {
    localStorage.setItem(STORAGE_KEYS.MODE, updated.mode);
    localStorage.setItem('theme', isDarkEffective(updated.mode) ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEYS.PALETTE, updated.palette);
    localStorage.setItem(STORAGE_KEYS.FLOWERS, String(updated.flowerShower));
    localStorage.setItem(STORAGE_KEYS.LIGHTING, String(updated.lightingEffects));
    localStorage.setItem(STORAGE_KEYS.BACKGROUND, String(updated.backgroundAtmosphere));

    applyThemeToDOM(updated);

    window.dispatchEvent(new CustomEvent(THEME_UPDATED_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to save theme settings:', e);
  }

  return updated;
};

/**
 * Get active palette config
 */
export const getActivePaletteConfig = (paletteId: ThemePaletteId): ThemePaletteConfig => {
  return THEME_PALETTES.find(p => p.id === paletteId) || THEME_PALETTES[0];
};
