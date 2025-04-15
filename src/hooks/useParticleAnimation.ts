
import { useEffect, RefObject } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  angle: number;
  speed: number;
}

export const useParticleAnimation = (
  canvasRef: RefObject<HTMLCanvasElement>,
  headerHeight: number = 0
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let touchX = 0;
    let touchY = 0;
    let headerElement: HTMLElement | null = null;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      headerElement = document.querySelector('header');
      
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
      const currentHeaderHeight = headerElement?.getBoundingClientRect().height || headerHeight;

      particles.forEach(particle => {
        particle.x += Math.cos(particle.angle) * (particle.speed * 0.3);
        particle.y += Math.sin(particle.angle) * (particle.speed * 0.3);
        particle.angle += (Math.random() - 0.5) * 0.01;
        
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

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const distanceFromCenter = Math.abs((particle.y / canvas.height) - 0.5) * 2;
        const opacity = 1 - Math.pow(distanceFromCenter, 1.5);
        const color = particle.color.replace('0.8', opacity.toString());
        
        const topBarMinimized = !headerElement || headerElement.style.display === 'none';
        
        if (topBarMinimized || particle.y > currentHeaderHeight + 20) {
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
  }, [canvasRef, headerHeight]);
};
