
import { useEffect, useState } from 'react';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const animationDuration = 300; // ms
    const startTime = Date.now();
    const startValue = animatedProgress;
    const endValue = progress;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / animationDuration);
      
      // Ease-out cubic function
      const easedT = 1 - Math.pow(1 - t, 3);
      
      // Calculate the current progress
      const currentProgress = startValue + (endValue - startValue) * easedT;
      setAnimatedProgress(currentProgress);
      
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [progress]);
  
  return (
    <div 
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-30 animate-fade-in"
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.12)',
        animation: 'bounce 1s ease-in-out'
      }}
    >
      <div className="flex justify-between mb-2">
        <p className="text-sm font-medium animate-pulse">Nahrávání...</p>
        <span 
          className="text-sm font-medium" 
          style={{
            animation: progress === 100 ? 'pulse 0.5s ease-in-out infinite' : 'none'
          }}
        >
          {Math.round(animatedProgress)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  );
};
