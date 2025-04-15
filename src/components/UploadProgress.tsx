
interface UploadProgressProps {
  progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-30 animate-fade-in">
      <div className="flex justify-between mb-2">
        <p className="text-sm font-medium">Nahrávání...</p>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
