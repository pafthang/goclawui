import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import { LOCAL_STORAGE_KEYS, SUPPORTED_LANGUAGES, type Language } from '../constants';

type Namespace = 
  | 'common' | 'sidebar' | 'topbar' | 'login' | 'overview' | 'chat'
  | 'agents' | 'teams' | 'sessions' | 'skills' | 'cron' | 'config'
  | 'channels' | 'providers' | 'traces' | 'events' | 'usage' | 'approvals'
  | 'nodes' | 'logs' | 'tools' | 'mcp' | 'tts' | 'setup' | 'memory'
  | 'vault' | 'storage' | 'pending-messages' | 'contacts' | 'activity'
  | 'api-keys' | 'cli-credentials' | 'packages' | 'tenants'
  | 'system-settings' | 'import-export' | 'v3-capabilities'
  | 'backup' | 'hooks' | 'workstations';

interface Translations {
  [key: string]: Record<string, string>;
}

interface AllTranslations {
  en: Translations;
  vi: Translations;
  zh: Translations;
}

const translations: AllTranslations = {
  en: {},
  vi: {},
  zh: {}
};

// Load translations dynamically in browser
if (browser) {
  for (const lang of SUPPORTED_LANGUAGES) {
    const namespaces: Namespace[] = [
      'common', 'sidebar', 'topbar', 'login', 'overview', 'chat',
      'agents', 'teams', 'sessions', 'skills', 'cron', 'config',
      'channels', 'providers', 'traces', 'events', 'usage', 'approvals',
      'nodes', 'logs', 'tools', 'mcp', 'tts', 'setup', 'memory',
      'vault', 'storage', 'pending-messages', 'contacts', 'activity',
      'api-keys', 'cli-credentials', 'packages', 'tenants',
      'system-settings', 'import-export', 'v3-capabilities',
      'backup', 'hooks', 'workstations'
    ];
    
    for (const ns of namespaces) {
      try {
        const module = await import(`./locales/${lang}/${ns}.json`);
        translations[lang][ns] = module.default;
      } catch (e) {
        console.warn(`Failed to load ${lang}/${ns}:`, e);
      }
    }
  }
}

function createI18nStore() {
  const defaultLang: Language = 'en';
  
  let initialLang: Language = defaultLang;
  if (browser) {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE);
    if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
      initialLang = stored as Language;
    } else {
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('vi')) initialLang = 'vi';
      else if (navLang.startsWith('zh')) initialLang = 'zh';
    }
  }
  
  const { subscribe, set, update } = writable<Language>(initialLang);

  const store = {
    subscribe,
    
    setLanguage: (lang: Language) => {
      if (SUPPORTED_LANGUAGES.includes(lang)) {
        set(lang);
        if (browser) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
          document.documentElement.lang = lang;
        }
      }
    },
    
    t: (key: string, namespace: Namespace = 'common', params: Record<string, string> = {}) => {
      let currentLang: Language;
      const unsub = subscribe(value => currentLang = value)();
      unsub();
      
      const ns = translations[currentLang!]?.[namespace];
      let translation = ns?.[key] || key;
      
      // Replace parameters like {{param}}
      for (const [param, value] of Object.entries(params)) {
        translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), value);
      }
      
      return translation;
    },
    
    getLocale: () => {
      let currentLang: Language;
      const unsub = subscribe(value => currentLang = value)();
      unsub();
      return currentLang!;
    }
  };

  // Persist changes to localStorage
  if (browser) {
    let unsubscribe: (() => void) | undefined;
    unsubscribe = subscribe((lang) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
      document.documentElement.lang = lang;
    });
  }

  return store;
}

export const i18nStore = createI18nStore();

// Helper hook-like function for components
export function useTranslation(namespace: Namespace = 'common') {
  let currentLang: Language;
  let unsubscribe: (() => void) | undefined;
  
  if (browser) {
    unsubscribe = i18nStore.subscribe(lang => currentLang = lang);
  }
  
  const t = (key: string, params: Record<string, string> = {}) => {
    const ns = translations[currentLang!]?.[namespace];
    let translation = ns?.[key] || key;
    
    for (const [param, value] of Object.entries(params)) {
      translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), value);
    }
    
    return translation;
  };
  
  return {
    t,
    i18n: {
      language: currentLang || 'en',
      changeLanguage: (lang: Language) => i18nStore.setLanguage(lang)
    },
    destroy: () => unsubscribe?.()
  };
}

// Legacy API compatibility - simple t function using store
let _currentLang: Language = 'en';
if (browser) {
  i18nStore.subscribe(lang => _currentLang = lang);
}

export function t(key: string, namespace: Namespace = 'common', params: Record<string, string> = {}) {
  const ns = translations[_currentLang]?.[namespace];
  let translation = ns?.[key] || key;
  
  for (const [param, value] of Object.entries(params)) {
    translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), value);
  }
  
  return translation;
}

// Legacy setupI18n function (no-op now, kept for compatibility)
export function setupI18n() {
  // Initialization is now automatic via i18nStore creation
}

export type { Namespace };
