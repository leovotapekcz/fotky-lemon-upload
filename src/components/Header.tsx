
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);
  const [themeButtonAnimating, setThemeButtonAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition(prev => (prev + 0.2) % 200); // Increased speed
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setThemeButtonAnimating(true);
    setTimeout(() => setThemeButtonAnimating(false), 1000);
  };

  return (
    <div className="relative z-20">
      {isMinimized ? (
        <div className="flex justify-center">
          <button
            onClick={() => setIsMinimized(false)}
            className="w-16 h-1 bg-white/50 hover:bg-white/60 rounded-full shadow-md border border-white/30 transition-all duration-500 mt-2 animate-fade-in"
          />
        </div>
      ) : (
        <header 
          className="w-full p-6 rounded-3xl shadow-lg mt-6 mx-auto max-w-5xl border border-white/30 transition-all duration-500 overflow-hidden animate-fade-in"
          style={{
            background: `linear-gradient(${gradientPosition}deg, #9b87f5, #33C3F0, #6E59A5, #FFD700, #90EE90, #9b87f5)`,
            backgroundSize: '600% 600%'
          }}
        >
          <div className="container mx-auto flex justify-center items-center relative py-2">
            <h1 className="text-3xl font-bold text-white absolute left-0">
              Fotky 9.C
            </h1>

            <button
              onClick={() => setIsMinimized(true)}
              className="w-16 h-1 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 absolute bottom-0"
            />

            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 bg-white/20 hover:bg-white/30 transition-all duration-300 absolute right-0 ${
                themeButtonAnimating ? 'animate-spin' : ''
              }`}
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </header>
      )}
    </div>
  );
}
