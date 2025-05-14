
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface FileUploadProps {
  onUploadProgress?: (progress: number | null) => void;
}

export default function FileUpload({ onUploadProgress }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    uploadFiles(files);
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    onUploadProgress && onUploadProgress(0);
    
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      // Set up progress tracking
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        onUploadProgress && onUploadProgress(progress);
      }, 50);
      
      // Send the files to our server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(interval);
      onUploadProgress && onUploadProgress(100);
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      console.log('Upload result:', result);
      
      setTimeout(() => {
        onUploadProgress && onUploadProgress(null);
        toast({
          title: t("filesUploaded"),
          description: `${files.length} ${files.length === 1 ? t("fileUploadedSuccess") : t("filesUploadedSuccess")}`
        });
      }, 200);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t("errorUploading"),
        description: t("errorUploadingFiles"),
        variant: "destructive"
      });
      onUploadProgress && onUploadProgress(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
        accept="image/*"
      />
      <Button
        size="lg"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-8 py-6 text-xl flex items-center gap-3 transform hover:scale-105 transition-all active:scale-95 hover:shadow-xl"
      >
        <Upload className="w-6 h-6 animate-bounce" />
        {uploading ? t("uploading") : t("uploadButton")}
      </Button>
    </div>
  );
}
