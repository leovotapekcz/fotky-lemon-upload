
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
      setGradientPosition(prev => (prev + 0.5) % 200); // Increased animation speed
    }, 50); // Faster interval
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
            className="w-24 h-2 bg-sky-blue-500/60 hover:bg-sky-blue-500/80 rounded-full shadow-md border border-white/30 transition-all duration-500 mb-2 animate-fade-in"
          />
        </div>
      ) : (
        <header 
          className="w-full p-6 rounded-3xl shadow-lg mt-6 mx-auto max-w-5xl border border-white/30 transition-all duration-500 overflow-hidden animate-fade-in relative"
          style={{
            background: `linear-gradient(${gradientPosition}deg, #9b87f5, #33C3F0, #6E59A5, #FFD700, #90EE90, #f5f5dc)`,
            backgroundSize: '600% 600%',
            animation: 'gradient-animation 10s ease infinite'
          }}
        >
          <div className="container mx-auto flex justify-center items-center relative py-2">
            <h1 className="text-3xl font-bold text-white absolute left-0">
              Fotky 9.C
            </h1>

            <button
              onClick={() => setIsMinimized(true)}
              className="absolute left-1/2 transform -translate-x-1/2 top-[-12px] w-28 h-3 bg-sky-blue-500 hover:bg-sky-blue-600 rounded-full shadow-lg transition-all duration-300 border-2 border-white/50"
            />

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full w-10 h-10 bg-white/30 hover:bg-white/40 border-2 border-white/50 shadow-lg transition-all duration-300 absolute right-0 ${
                themeButtonAnimating ? 'animate-spin' : ''
              }`}
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600" />
              )}
            </Button>
          </div>
        </header>
      )}
    </div>
  );
}
