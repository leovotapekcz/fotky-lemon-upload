
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      // Here we're just simulating the upload - in a real app, you'd send this to a server
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Soubory nahrány",
        description: `${files.length} ${files.length === 1 ? 'soubor byl nahrán' : 'soubory byly nahrány'} úspěšně.`
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nastala chyba při nahrávání souborů.",
        variant: "destructive"
      });
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
      />
      <Button
        size="lg"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-8 py-6 text-xl flex items-center gap-3 transform hover:scale-105 transition-all active:scale-95 hover:shadow-xl"
      >
        <Upload className="w-6 h-6 animate-bounce" />
        {uploading ? "Nahrávání..." : "Nahraj jakékoli soubory"}
      </Button>
    </div>
  );
}

export default FileUpload;
