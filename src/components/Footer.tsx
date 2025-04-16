
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const [url, setUrl] = useState("https://example.com");
  
  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4">
        <hr className="border-gray-300 dark:border-gray-700 my-6" />
        <div className="flex flex-col items-center gap-3">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter URL"
            className="p-2 rounded border text-sm w-full max-w-xs border-gray-300 dark:border-gray-700"
          />
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
