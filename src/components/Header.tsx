
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full p-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl shadow-lg mt-6 mx-auto max-w-5xl border-4 border-white/40">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Fotky 9.C</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-[360deg]"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-white animate-spin-slow" />
          ) : (
            <Moon className="h-5 w-5 text-white animate-spin-slow" />
          )}
        </Button>
      </div>
    </header>
  );
}
