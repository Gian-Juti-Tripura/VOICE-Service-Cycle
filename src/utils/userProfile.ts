/**
 * User Profile Utility for Advaita VOICE Hub
 * Supports:
 * - Sacred spiritual flower avatar presets (Sacred Lotus default, Rose, Marigold, Hibiscus, Jasmine, Sunflower)
 * - Custom device photo upload with client-side canvas compression
 * - Name editing with localStorage persistence & reactive window events
 */

export interface FlowerPreset {
  id: string;
  nameEn: string;
  nameBn: string;
  svg: string;
  dataUri: string;
}

const svgToUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

export const FLOWER_PRESETS: FlowerPreset[] = [
  {
    id: 'lotus',
    nameEn: 'Sacred Lotus (Default)',
    nameBn: 'পবিত্র পদ্ম (ডিফল্ট)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="lotusBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#134e4a"/>
      <stop offset="100%" stop-color="#042f2e"/>
    </radialGradient>
    <linearGradient id="lotusPetal1" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
    <linearGradient id="lotusPetal2" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#db2777"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
    <radialGradient id="lotusCenter" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="70%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#lotusBg)"/>
  <path d="M50 18 C42 34 30 48 32 64 C34 74 45 78 50 78 C55 78 66 74 68 64 C70 48 58 34 50 18 Z" fill="url(#lotusPetal2)" opacity="0.9"/>
  <path d="M24 42 C32 52 40 62 42 72 C35 76 22 72 18 65 C14 58 18 48 24 42 Z" fill="url(#lotusPetal1)" opacity="0.85"/>
  <path d="M76 42 C68 52 60 62 58 72 C65 76 78 72 82 65 C86 58 82 48 76 42 Z" fill="url(#lotusPetal1)" opacity="0.85"/>
  <path d="M34 30 C40 42 45 58 46 70 C38 72 28 68 26 60 C24 50 28 38 34 30 Z" fill="url(#lotusPetal1)"/>
  <path d="M66 30 C60 42 55 58 54 70 C62 72 72 68 74 60 C76 50 72 38 66 30 Z" fill="url(#lotusPetal1)"/>
  <path d="M50 22 C45 36 43 52 45 68 C47 72 53 72 55 68 C57 52 55 36 50 22 Z" fill="#fdf2f8"/>
  <circle cx="50" cy="63" r="7" fill="url(#lotusCenter)"/>
  <circle cx="48" cy="61" r="1.2" fill="#713f12"/>
  <circle cx="52" cy="61" r="1.2" fill="#713f12"/>
  <circle cx="50" cy="65" r="1.2" fill="#713f12"/>
</svg>`,
    dataUri: ''
  },
  {
    id: 'rose',
    nameEn: 'Vrindavan Rose',
    nameBn: 'বৃন্দাবন গোলাপ',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="roseBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4c0519"/>
      <stop offset="100%" stop-color="#1f0208"/>
    </radialGradient>
    <linearGradient id="roseRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#roseBg)"/>
  <path d="M50 20 C28 20 18 38 23 58 C28 78 72 78 77 58 C82 38 72 20 50 20 Z" fill="#9f1239"/>
  <path d="M50 26 C33 26 26 40 30 56 C34 70 66 70 70 56 C74 40 67 26 50 26 Z" fill="url(#roseRed)"/>
  <path d="M40 36 C36 46 43 60 55 58 C65 56 68 44 60 36 C53 30 45 30 40 36 Z" fill="#fecdd3" opacity="0.9"/>
  <path d="M45 42 C44 48 49 54 54 52 C58 50 59 44 55 41 C52 38 47 38 45 42 Z" fill="#be123c"/>
</svg>`,
    dataUri: ''
  },
  {
    id: 'marigold',
    nameEn: 'Golden Marigold / Kadamba',
    nameBn: 'সোনালী গাঁদা / কদম্ব',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="marigoldBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1a0601"/>
    </radialGradient>
    <radialGradient id="goldPetal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#marigoldBg)"/>
  <g fill="url(#goldPetal)" stroke="#78350f" stroke-width="0.5">
    <ellipse cx="50" cy="24" rx="8" ry="14"/>
    <ellipse cx="50" cy="76" rx="8" ry="14"/>
    <ellipse cx="24" cy="50" rx="14" ry="8"/>
    <ellipse cx="76" cy="50" rx="14" ry="8"/>
    <ellipse cx="31" cy="31" rx="9" ry="14" transform="rotate(-45 31 31)"/>
    <ellipse cx="69" cy="69" rx="9" ry="14" transform="rotate(-45 69 69)"/>
    <ellipse cx="69" cy="31" rx="9" ry="14" transform="rotate(45 69 31)"/>
    <ellipse cx="31" cy="69" rx="9" ry="14" transform="rotate(45 31 69)"/>
  </g>
  <circle cx="50" cy="50" r="14" fill="#f59e0b"/>
  <circle cx="50" cy="50" r="10" fill="#d97706"/>
  <circle cx="50" cy="50" r="6" fill="#78350f"/>
</svg>`,
    dataUri: ''
  },
  {
    id: 'hibiscus',
    nameEn: 'Divine Hibiscus (Jaba)',
    nameBn: 'দিব্য জবা কুসুম',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="hibiscusBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3f101d"/>
      <stop offset="100%" stop-color="#170308"/>
    </radialGradient>
    <linearGradient id="hibiscusRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#hibiscusBg)"/>
  <path d="M50 50 C40 30 45 15 55 15 C65 15 65 30 50 50 Z" fill="url(#hibiscusRed)"/>
  <path d="M50 50 C70 40 85 45 85 55 C85 65 70 65 50 50 Z" fill="url(#hibiscusRed)"/>
  <path d="M50 50 C60 70 55 85 45 85 C35 85 35 70 50 50 Z" fill="url(#hibiscusRed)"/>
  <path d="M50 50 C30 60 15 55 15 45 C15 35 30 35 50 50 Z" fill="url(#hibiscusRed)"/>
  <path d="M50 50 C25 35 25 20 35 20 C45 20 45 35 50 50 Z" fill="url(#hibiscusRed)"/>
  <circle cx="50" cy="50" r="8" fill="#881337"/>
  <path d="M50 50 Q60 34 72 28" stroke="#fde047" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="72" cy="28" r="2.5" fill="#facc15"/>
</svg>`,
    dataUri: ''
  },
  {
    id: 'jasmine',
    nameEn: 'Fragrant Jasmine / Lily',
    nameBn: 'সুগন্ধি জুঁই / বকুল',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="jasmineBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f2922"/>
      <stop offset="100%" stop-color="#041712"/>
    </radialGradient>
    <linearGradient id="whitePetal" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#jasmineBg)"/>
  <path d="M50 18 C46 32 44 42 50 50 C56 42 54 32 50 18 Z" fill="url(#whitePetal)"/>
  <path d="M82 50 C68 46 58 44 50 50 C58 56 68 54 82 50 Z" fill="url(#whitePetal)"/>
  <path d="M50 82 C54 68 56 58 50 50 C44 58 46 68 50 82 Z" fill="url(#whitePetal)"/>
  <path d="M18 50 C32 54 42 56 50 50 C42 44 32 46 18 50 Z" fill="url(#whitePetal)"/>
  <path d="M28 28 C38 38 44 44 50 50 C44 44 38 38 28 28 Z" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
  <path d="M72 72 C62 62 56 56 50 50 C56 56 62 62 72 72 Z" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="8" fill="#fde047"/>
  <circle cx="50" cy="50" r="4" fill="#ca8a04"/>
</svg>`,
    dataUri: ''
  },
  {
    id: 'sunflower',
    nameEn: 'Golden Sunflower',
    nameBn: 'সূর্যমুখী ফুল',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="sunBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </radialGradient>
    <linearGradient id="sunGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#sunBg)"/>
  <g fill="url(#sunGold)">
    <polygon points="50,15 54,32 50,40 46,32"/>
    <polygon points="50,85 54,68 50,60 46,68"/>
    <polygon points="15,50 32,54 40,50 32,46"/>
    <polygon points="85,50 68,54 60,50 68,46"/>
    <polygon points="25,25 40,36 43,43 36,40"/>
    <polygon points="75,75 60,64 57,57 64,60"/>
    <polygon points="75,25 64,40 57,43 60,36"/>
    <polygon points="25,75 36,60 43,57 40,64"/>
  </g>
  <circle cx="50" cy="50" r="15" fill="#78350f"/>
  <circle cx="50" cy="50" r="11" fill="#451a03"/>
</svg>`,
    dataUri: ''
  }
];

// Initialize dataUris
FLOWER_PRESETS.forEach(p => {
  p.dataUri = svgToUri(p.svg);
});

export const DEFAULT_AVATAR_URI = FLOWER_PRESETS[0].dataUri;

export interface UserProfileState {
  displayName: string;
  avatarUrl: string;
  presetId?: string;
  updatedAt: string;
}

const STORAGE_KEY = 'advaita_user_custom_profile';
export const PROFILE_UPDATED_EVENT = 'advaita_user_profile_updated';

/**
 * Retrieve current user profile from localStorage with fallback
 */
export const getUserProfile = (fallbackName = 'Gian Juti Tripura'): UserProfileState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.displayName === 'string') {
        return {
          displayName: parsed.displayName || fallbackName,
          avatarUrl: parsed.avatarUrl || DEFAULT_AVATAR_URI,
          presetId: parsed.presetId || 'lotus',
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    }
  } catch (e) {
    console.error('Error loading user profile:', e);
  }

  return {
    displayName: fallbackName,
    avatarUrl: DEFAULT_AVATAR_URI,
    presetId: 'lotus',
    updatedAt: new Date().toISOString()
  };
};

/**
 * Save user profile to localStorage and broadcast event
 */
export const saveUserProfile = (profile: Partial<UserProfileState>): UserProfileState => {
  const current = getUserProfile();
  const updated: UserProfileState = {
    ...current,
    ...profile,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to save profile to localStorage:', e);
  }

  return updated;
};

/**
 * Compress an image file to max 256x256 using an offscreen canvas
 * Returns a lightweight data URL
 */
export const compressImageFile = (file: File, maxDim = 256, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Output clean JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};
