
import { Moon, Sun, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <header className={`w-full p-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl shadow-lg mt-6 mx-auto max-w-5xl border-2 border-white transition-all duration-300 ${isMinimized ? 'h-16' : 'h-auto'}`}>
      <div className="container mx-auto flex justify-center items-center relative">
        {!isMinimized && (
          <>
            <h1 className="text-2xl font-bold text-white absolute left-0">
              Fotky 9.C
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 bg-white/20 hover:bg-white/30 transition-colors absolute right-0"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-white" />
              )}
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-white/20 hover:bg-white/30 transition-all duration-300"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? (
            <ChevronDown className="h-5 w-5 text-white" />
          ) : (
            <ChevronUp className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
    </header>
  );
}
