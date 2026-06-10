'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

type Language = 'th' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// A nested key lookup helper
const getTranslation = (dict: any, path: string): string => {
  const keys = path.split('.');
  let current = dict;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Fallback to path key itself if not found
    }
  }
  return typeof current === 'string' ? current : path;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Default to 'th', but load from localStorage if set
    const saved = localStorage.getItem('system_language') as Language;
    if (saved === 'th' || saved === 'en') {
      setLanguageState(saved);
    } else {
      localStorage.setItem('system_language', 'th');
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('system_language', lang);
  };

  const t = (path: string): string => {
    if (!mounted) {
      // Prioritize Thai translation on initial hydration to match the user default request
      return getTranslation(translations.th, path);
    }
    return getTranslation(translations[language], path);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
