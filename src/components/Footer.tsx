
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const handleClick = () => {
    window.open("https://www.lemon.netherite.xyz", "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4">
        <hr className="border-gray-300 dark:border-gray-700 my-6" />
        <div className="flex flex-col items-center gap-3">
          <p 
            onClick={handleClick}
            className="text-center text-2xl font-bold pb-6 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 bg-clip-text text-transparent cursor-pointer flex items-center gap-1 hover:opacity-80"
          >
            © Vytvořil Lemon_cz, 2025
            <ExternalLink size={18} className="inline-block" />
          </p>
        </div>
      </div>
    </footer>
  );
}
