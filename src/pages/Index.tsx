
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { 
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      angle: number;
      speed: number;
    }[] = [];
    
    let mouseX = 0;
    let mouseY = 0;
    let touchX = 0;
    let touchY = 0;
    let headerHeight = 0;
    let headerElement: HTMLElement | null = null;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      headerElement = document.querySelector('header');
      headerHeight = headerElement?.getBoundingClientRect().height || 0;
      
      particles = Array.from({ length: 120 }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const hue = (x / canvas.width) * 60 + 200;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5 + 0.1;
        
        return {
          x,
          y,
          size: Math.random() * 4 + 3,
          vx: 0,
          vy: 0,
          color: `hsla(${hue}, 70%, 50%, 0.8)`,
          angle,
          speed
        };
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update header height in case of resize
      if (headerElement) {
        headerHeight = headerElement.getBoundingClientRect().height || 0;
      }

      particles.forEach(particle => {
        // Natural movement
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Slightly change angle for organic movement
        particle.angle += (Math.random() - 0.5) * 0.05;
        
        // Mouse/touch repulsion
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          particle.vx = -Math.cos(angle) * (100 - distance) * 0.02;
          particle.vy = -Math.sin(angle) * (100 - distance) * 0.02;
        }
        
        const tdx = touchX - particle.x;
        const tdy = touchY - particle.y;
        const touchDistance = Math.sqrt(tdx * tdx + tdy * tdy);
        
        if (touchDistance < 100 && touchX !== 0 && touchY !== 0) {
          const angle = Math.atan2(tdy, tdx);
          particle.vx = -Math.cos(angle) * (100 - touchDistance) * 0.02;
          particle.vy = -Math.sin(angle) * (100 - touchDistance) * 0.02;
        }
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate opacity based on vertical position (fade out at top and bottom)
        const distanceFromCenter = Math.abs((particle.y / canvas.height) - 0.5) * 2;
        const opacity = 1 - Math.pow(distanceFromCenter, 2);
        const color = particle.color.replace('0.8', opacity.toString());
        
        // Don't render particles that would overlap with the header
        const topBarMinimized = !headerElement || headerElement.style.display === 'none';
        
        if (topBarMinimized || particle.y > headerHeight + 20) {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
      }
    };
    
    const handleTouchEnd = () => {
      touchX = 0;
      touchY = 0;
    };

    init();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', init);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Drag and drop handlers
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
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setUploadProgress(null), 1000);
      }
      setUploadProgress(progress);
    }, 200);
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.7 }}
      />
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
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-30 animate-fade-in">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Nahrávání...</p>
              <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Index;
