
import { useState } from 'react';

export const useFileUpload = (onProgress: (progress: number | null) => void) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.length) {
      simulateUpload(files);
    }
  };

  const simulateUpload = (files: FileList) => {
    onProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => onProgress(null), 1000);
      }
      onProgress(progress);
    }, 200);
  };

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};
