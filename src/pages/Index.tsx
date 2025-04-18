
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Footer from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { UploadProgress } from "@/components/UploadProgress";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useState } from "react";

const Index = () => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileUpload(setUploadProgress);

  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ParticleBackground />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-12 relative z-10">
        <p className="text-4xl font-bold text-gray-700 dark:text-gray-300 animate-fade-in text-center">
          Klikni na tlačítko pro nahrání souborů
        </p>
        <FileUpload onUploadProgress={setUploadProgress} />
        
        {isDragging && (
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-4 border-purple-400 border-dashed z-20">
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              Přetáhni soubory sem
            </p>
          </div>
        )}
        
        {uploadProgress !== null && (
          <UploadProgress progress={uploadProgress} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
