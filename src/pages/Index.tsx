
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; vx: number; vy: number; color: string }[] = [];
    let mouseX = 0;
    let mouseY = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 100 }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        // Gradient colors based on position
        const hue = (x / canvas.width) * 60 + 200; // Range from 200 to 260 (blue to purple)
        return {
          x,
          y,
          size: Math.random() * 3 + 2, // Slightly bigger particles
          vx: 0,
          vy: 0,
          color: `hsla(${hue}, 70%, 50%, 0.8)`
        };
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          particle.vx = -Math.cos(angle) * (100 - distance) * 0.02;
          particle.vy = -Math.sin(angle) * (100 - distance) * 0.02;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate opacity based on vertical position (fade out towards bottom)
        const opacity = 1 - (particle.y / canvas.height) * 0.8;
        const color = particle.color.replace('0.8', opacity.toString());

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    init();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
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
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}

export default Index;
