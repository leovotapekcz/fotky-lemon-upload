import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);
  const [themeButtonAnimating, setThemeButtonAnimating] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const [titleHovered, setTitleHovered] = useState(false);
  const [languageSwitching, setLanguageSwitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition(prev => (prev + 0.5) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setThemeButtonAnimating(true);
    setTimeout(() => setThemeButtonAnimating(false), 1000);
  };

  const handleLanguageToggle = () => {
    setLanguageSwitching(true);
    toggleLanguage();
    setTimeout(() => setLanguageSwitching(false), 500);
  };

  const translations = {
    title: {
      uk: "Фотки 9.C",
      cs: "Fotky 9.C"
    }
  };

  return (
    <div className="relative z-20">
      {isMinimized ? (
        <div className="flex justify-center">
          <button
            onClick={() => setIsMinimized(false)}
            className="w-16 h-1 bg-white hover:bg-white/80 rounded-full shadow-md border border-white/30 transition-all duration-500 mb-1 animate-fade-in hover:w-32 hover:h-2"
          />
        </div>
      ) : (
        <header 
          className={cn(
            "w-full p-6 rounded-3xl shadow-lg mt-6 mx-auto max-w-5xl border border-white/30 transition-all duration-700 overflow-hidden relative",
            "animate-fade-in"
          )}
          style={{
            background: `linear-gradient(${gradientPosition}deg, #9b87f5, #33C3F0, #6E59A5, #FFD700, #90EE90, #f5f5dc)`,
            backgroundSize: '600% 600%',
            animation: 'gradient-animation 10s ease infinite'
          }}
        >
          <div className="container mx-auto flex justify-center items-center relative py-2">
            <h1 
              className={cn(
                "text-3xl font-bold text-white absolute left-0 transition-all duration-300",
                titleHovered ? "tracking-widest scale-110" : ""
              )}
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
            >
              <span className={cn(
                "inline-block transition-all",
                languageSwitching ? "animate-bounce" : ""
              )}>
                {translations.title[language]}
              </span>
            </h1>

            <button
              onClick={() => setIsMinimized(true)}
              className="absolute left-1/2 transform -translate-x-1/2 bottom-[-20px] w-24 h-1.5 bg-white hover:bg-white/90 rounded-full shadow-lg transition-all duration-300 border-2 border-white/50 hover:scale-110"
            />

            <div className="flex gap-3 absolute right-0">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full w-10 h-10 bg-white/30 hover:bg-white/40 border-2 border-white/50 shadow-lg transition-all duration-300",
                  "hover:scale-110 hover:rotate-6",
                  languageSwitching ? "animate-spin" : ""
                )}
                onClick={handleLanguageToggle}
              >
                {language === "cs" ? (
                  <span className="text-lg font-bold animate-pulse">🇺🇦</span>
                ) : (
                  <span className="text-lg font-bold animate-pulse">🇨🇿</span>
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full w-10 h-10 bg-white/30 hover:bg-white/40 border-2 border-white/50 shadow-lg transition-all duration-300",
                  themeButtonAnimating ? 'animate-spin' : '',
                  "hover:scale-110"
                )}
                onClick={handleThemeToggle}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-white animate-pulse" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600 animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </header>
      )}
    </div>
  );
}
