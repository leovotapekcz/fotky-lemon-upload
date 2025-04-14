
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full p-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-b-lg shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Fotky 9.C</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-white/20 hover:bg-white/30"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-white" />
          ) : (
            <Moon className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
    </header>
  );
}
