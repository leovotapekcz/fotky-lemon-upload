
import { createContext, useContext, useState, ReactNode } from "react";

type Language = "cs" | "uk";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    cs: string;
    uk: string;
  };
}

const translations: Translations = {
  introText: {
    cs: "Vítejte na stránce fotografií",
    uk: "Ласкаво просимо на сторінку фотографій",
  },
  dragHere: {
    cs: "Přetáhněte soubor zde",
    uk: "Перетягніть файл сюди",
  },
  uploadFile: {
    cs: "Nahrát soubor",
    uk: "Завантажити файл",
  },
  chooseSong: {
    cs: "Vyberte píseň",
    uk: "Виберіть пісню",
  },
  search: {
    cs: "Hledat",
    uk: "Пошук",
  },
  enterSongTitle: {
    cs: "Zadejte název písně",
    uk: "Введіть назву пісні",
  },
  enterCreator: {
    cs: "Zadejte jméno tvůrce",
    uk: "Введіть ім'я творця",
  },
  noResults: {
    cs: "Žádné výsledky",
    uk: "Немає результатів",
  },
  error: {
    cs: "Chyba",
    uk: "Помилка",
  },
  songAdded: {
    cs: "Píseň přidána",
    uk: "Пісня додана",
  },
  submit: {
    cs: "Přidat",
    uk: "Додати",
  },
  submitting: {
    cs: "Přidávám...",
    uk: "Додавання...",
  },
  platform: {
    cs: "Platforma",
    uk: "Платформа",
  },
  selectPlatform: {
    cs: "Vyberte platformu",
    uk: "Виберіть платформу",
  },
  customPlatform: {
    cs: "Vlastní platforma",
    uk: "Власна платформа",
  },
  enterCustomPlatform: {
    cs: "Zadejte název platformy",
    uk: "Введіть назву платформи",
  },
  creator: {
    cs: "Tvůrce",
    uk: "Творець",
  },
  yourName: {
    cs: "Vaše jméno",
    uk: "Ваше ім'я",
  },
  enterYourName: {
    cs: "Zadejte své jméno",
    uk: "Введіть своє ім'я",
  },
  rememberName: {
    cs: "Zapamatovat jméno",
    uk: "Запам'ятати ім'я",
  },
  comment: {
    cs: "Komentář",
    uk: "Коментар",
  },
  enterComment: {
    cs: "Zadejte komentář",
    uk: "Введіть коментар",
  },
  commentAdded: {
    cs: "Komentář přidán",
    uk: "Коментар додано",
  },
  commentAddedDescription: {
    cs: "Váš komentář byl úspěšně přidán",
    uk: "Ваш коментар був успішно доданий",
  },
  songs: {
    cs: "písní",
    uk: "пісень",
  },
  song: {
    cs: "píseň",
    uk: "пісня",
  },
  addComment: {
    cs: "Přidat komentář",
    uk: "Додати коментар",
  },
  post: {
    cs: "Odeslat",
    uk: "Надіслати",
  },
  comments: {
    cs: "Komentáře",
    uk: "Коментарі",
  },
  unknownCreator: {
    cs: "Neznámý tvůrce",
    uk: "Невідомий творець",
  },
  anonymousUser: {
    cs: "Anonymní uživatel",
    uk: "Анонімний користувач",
  },
  songTitle: {
    cs: "Název písně",
    uk: "Назва пісні",
  },
  addNewSong: {
    cs: "Přidat novou píseň",
    uk: "Додати нову пісню",
  },
  optional: {
    cs: "nepovinné",
    uk: "необов'язково",
  },
  voteAccepted: {
    cs: "Hlas přijat",
    uk: "Голос прийнято",
  },
  voteRejected: {
    cs: "Hlas odmítnut",
    uk: "Голос відхилено",
  },
  acceptedVotes: {
    cs: "Pro",
    uk: "За",
  },
  rejectedVotes: {
    cs: "Proti",
    uk: "Проти",
  },
  uploading: {
    cs: "Nahrávám...",
    uk: "Завантаження...",
  },
  uploadButton: {
    cs: "Nahrát fotky",
    uk: "Завантажити фото",
  },
  filesUploaded: {
    cs: "Soubory nahrány",
    uk: "Файли завантажено",
  },
  fileUploaded: {
    cs: "Soubor nahrán",
    uk: "Файл завантажено",
  },
  filesUploadedSuccess: {
    cs: "soubory byly nahrány úspěšně",
    uk: "файлів завантажено успішно",
  },
  fileUploadedSuccess: {
    cs: "soubor byl nahrán úspěšně",
    uk: "файл завантажено успішно",
  },
  errorUploading: {
    cs: "Chyba při nahrávání",
    uk: "Помилка при завантаженні",
  },
  errorUploadingFiles: {
    cs: "Nastala chyba při nahrávání souborů.",
    uk: "Сталася помилка під час завантаження файлів.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("cs");

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "cs" ? "uk" : "cs"));
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation for "${key}" not found.`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
