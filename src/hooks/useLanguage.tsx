
import { useState, createContext, useContext } from 'react';

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
  submitting: {
    uk: "Відправляється...",
    cs: "Odesílání..."
  },
  accepted: {
    uk: "Прийнято",
    cs: "Přijato"
  },
  rejected: {
    uk: "Відхилено",
    cs: "Odmítnuto"
  },
  songAdded: {
    uk: "Пісню додано",
    cs: "Píseň přidána"
  },
  songs: {
    uk: "пісні",
    cs: "písní"
  },
  song: {
    uk: "пісня",
    cs: "píseň"
  },
  searching: {
    uk: "Пошук...",
    cs: "Vyhledávání..."
  },
  searchError: {
    uk: "Помилка пошуку",
    cs: "Chyba hledání"
  },
  searchErrorDescription: {
    uk: "Не вдалося знайти пісні. Спробуйте знову.",
    cs: "Nepodařilo se najít písně. Zkuste to znovu."
  },
  by: {
    uk: "від",
    cs: "od"
  },
  platform: {
    uk: "Платформа",
    cs: "Platforma"
  },
  allPlatforms: {
    uk: "Всі платформи",
    cs: "Všechny platformy"
  },
  creator: {
    uk: "Творець",
    cs: "Tvůrce"
  },
  enterCreator: {
    uk: "Введіть ім'я творця",
    cs: "Zadejte jméno tvůrce"
  },
  unknownCreator: {
    uk: "Невідомий творець",
    cs: "Neznámý tvůrce"
  },
  customPlatform: {
    uk: "Власна платформа",
    cs: "Vlastní platforma"
  },
  enterCustomPlatform: {
    uk: "Введіть назву платформи",
    cs: "Zadejte název platformy"
  },
  yourName: {
    uk: "Ваше ім'я",
    cs: "Vaše jméno"
  },
  enterYourName: {
    uk: "Введіть ваше ім'я",
    cs: "Zadejte své jméno"
  },
  comment: {
    uk: "Коментар",
    cs: "Komentář"
  },
  comments: {
    uk: "Коментарі",
    cs: "Komentáře"
  },
  enterComment: {
    uk: "Введіть ваш коментар...",
    cs: "Zadejte svůj komentář..."
  },
  addComment: {
    uk: "Додати коментар...",
    cs: "Přidat komentář..."
  },
  post: {
    uk: "Опубліковати",
    cs: "Odeslat"
  },
  commentAdded: {
    uk: "Коментар додано",
    cs: "Komentář přidán"
  },
  commentAddedDescription: {
    uk: "Ваш коментар був успішно доданий",
    cs: "Váš komentář byl úspěšně přidán"
  },
  anonymousUser: {
    uk: "Анонімний користувач",
    cs: "Anonymní uživatel"
  },
  error: {
    uk: "Помилка",
    cs: "Chyba"
  },
  enterSongTitle: {
    uk: "Будь ласка, введіть назву пісні",
    cs: "Prosím, zadejte název písně"
  },
  songTitle: {
    uk: "Назва пісні",
    cs: "Název písně"
  },
  selectPlatform: {
    uk: "Виберіть платформу",
    cs: "Vyberte platformu"
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
