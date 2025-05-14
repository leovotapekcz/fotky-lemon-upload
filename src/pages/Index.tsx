
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Footer from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { UploadProgress } from "@/components/UploadProgress";
import { useFileUpload } from "@/hooks/useFileUpload";
import SongSelector from "@/components/SongSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileUpload(setUploadProgress);
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [textReveal, setTextReveal] = useState(false);

  useEffect(() => {
    // Staggered animations
    setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setTextReveal(true);
      }, 400);
    }, 200);
  }, []);

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-700",
        isLoaded ? "opacity-100" : "opacity-0"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ParticleBackground />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-12 relative z-10">
        <p className={cn(
          "text-4xl font-bold text-gray-700 dark:text-gray-300 text-center transition-all duration-700 transform",
          textReveal ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          "bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 text-transparent"
        )}>
          {t("introText")}
        </p>
        
        <div className={cn(
          "transition-all duration-700 transform",
          textReveal ? "translate-y-0 opacity-100 delay-300" : "translate-y-20 opacity-0"
        )}>
          <FileUpload onUploadProgress={setUploadProgress} />
        </div>
        
        {isDragging && (
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center rounded-2xl border-4 border-purple-400 border-dashed z-20 animate-pulse">
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 animate-bounce">
              {t("dragHere")}
            </p>
          </div>
        )}
        
        {uploadProgress !== null && (
          <UploadProgress progress={uploadProgress} />
        )}

        <div className={cn(
          "transition-all duration-700 transform w-full",
          textReveal ? "translate-y-0 opacity-100 delay-500" : "translate-y-20 opacity-0"
        )}>
          <SongSelector />
        </div>
      </main>
      <div className={cn(
        "transition-all duration-700 transform",
        textReveal ? "translate-y-0 opacity-100 delay-700" : "translate-y-10 opacity-0"
      )}>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
