
import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'uk' | 'cs';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, section?: string) => string;
}

const translations = {
  uploadButton: {
    uk: "Завантажити будь-які файли",
    cs: "Nahraj jakékoli soubory"
  },
  uploading: {
    uk: "Завантаження...",
    cs: "Nahrávání..."
  },
  dragHere: {
    uk: "Перетягніть файли сюди",
    cs: "Přetáhni soubory sem"
  },
  introText: {
    uk: "Клацніть на кнопку, щоб завантажити файли",
    cs: "Klikni na tlačítko pro nahrání souborů"
  },
  chooseSong: {
    uk: "Виберіть пісню, яку ви хочете",
    cs: "Vyberte píseň, kterou chcete"
  },
  search: {
    uk: "Пошук...",
    cs: "Hledat..."
  },
  submit: {
    uk: "Відправити",
    cs: "Odeslat"
  },
  accepted: {
    uk: "Прийнято",
    cs: "Přijato"
  },
  rejected: {
    uk: "Відхилено",
    cs: "Odmítnuto"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'cs',
  toggleLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('app-language');
    return (savedLanguage as Language) || 'cs';
  });

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'cs' ? 'uk' : 'cs';
    setLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const t = (key: string, section?: string): string => {
    if (section && translations[section] && translations[section][key]) {
      return translations[section][key][language];
    }
    
    if (translations[key]) {
      return translations[key][language];
    }
    
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
