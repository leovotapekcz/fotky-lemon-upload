
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
    window.open("https://www.lemon.netherite.xyz", "_blank", "noopener,noreferrer");
  };
  
  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4">
        <hr className="border-gray-300 dark:border-gray-700 my-6" />
        <div className="flex flex-col items-center gap-3">
          <p 
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
              "text-center text-2xl font-bold pb-6 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 bg-clip-text text-transparent cursor-pointer flex items-center gap-1",
              "transition-all duration-500 ease-in-out",
              hovered ? "tracking-wider scale-110" : "",
              clicked ? "rotate-3 scale-105" : ""
            )}
            style={{
              backgroundSize: hovered ? '200% 200%' : '100% 100%',
              animation: hovered ? 'gradient-animation 3s ease infinite' : 'none'
            }}
          >
            © Vytvořil Lemon_cz, 2025
            <ExternalLink 
              size={18} 
              className={cn(
                "inline-block transition-all duration-300",
                hovered ? "translate-x-1 -translate-y-1" : ""
              )} 
            />
          </p>
        </div>
      </div>
    </footer>
  );
};
