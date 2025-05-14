
import { useEffect, RefObject } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  angle: number;
  speed: number;
  opacity: number;
  growing: boolean;
}

export const useParticleAnimation = (
  canvasRef: RefObject<HTMLCanvasElement>,
  headerHeight: number = 0
) => {
  const isMobile = useIsMobile();

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
    let hue = Math.random() * 360;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      headerElement = document.querySelector('header');
      
      // Reduce particle count on mobile
      const particleCount = isMobile ? 60 : 150;
      
      particles = Array.from({ length: particleCount }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const calculatedHue = (x / canvas.width) * 60 + 200 + Math.random() * 30;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.25 + 0.05; // Reduced speed for slower floating
        
        return {
          x,
          y,
          size: Math.random() * 5 + 2,
          vx: 0,
          vy: 0,
          color: `hsla(${calculatedHue}, 70%, 50%, 0.8)`,
          angle,
          speed,
          opacity: Math.random() * 0.5 + 0.3,
          growing: Math.random() > 0.5
        };
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentHeaderHeight = headerElement?.getBoundingClientRect().height || headerHeight;
      
      // Slowly change the global hue for color variation
      hue = (hue + 0.05) % 360; // Slowed down color change

      particles.forEach(particle => {
        // Wave-like movement - slowed down
        particle.angle += (Math.random() - 0.5) * 0.015;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Pulsating size - more gentle
        if (particle.growing) {
          particle.size += 0.02;
          if (particle.size > 7) {
            particle.growing = false;
          }
        } else {
          particle.size -= 0.02;
          if (particle.size < 2) {
            particle.growing = true;
          }
        }
        
        // Mouse/touch interaction - gentler repulsion
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) * 0.02;
          particle.vx = -Math.cos(angle) * force;
          particle.vy = -Math.sin(angle) * force;
        }
        
        const tdx = touchX - particle.x;
        const tdy = touchY - particle.y;
        const touchDistance = Math.sqrt(tdx * tdx + tdy * tdy);
        
        if (touchDistance < 150 && touchX !== 0 && touchY !== 0) {
          const angle = Math.atan2(tdy, tdx);
          const force = (150 - touchDistance) * 0.03;
          particle.vx = -Math.cos(angle) * force;
          particle.vy = -Math.sin(angle) * force;
        }
        
        // Apply velocity with more fluid movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.94; // Gentler deceleration
        particle.vy *= 0.94;

        // Wrap around screen edges with a slight fade effect
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Calculate distance-based opacity for depth effect
        const distanceFromCenter = Math.abs((particle.y / canvas.height) - 0.5) * 2;
        let opacity = particle.opacity * (1 - Math.pow(distanceFromCenter, 1.5));
        
        // Fluctuate opacity slightly for twinkling effect - more subtle
        opacity *= 0.85 + 0.15 * Math.sin(Date.now() * 0.0005 + particle.x * 0.01);
        
        const particleHue = (parseFloat(particle.color.match(/hsla\((\d+\.?\d*)/)?.[1] || "0") + Math.sin(Date.now() * 0.0003) * 5) % 360;
        const color = `hsla(${particleHue}, 70%, 50%, ${opacity})`;
        
        const topBarMinimized = !headerElement || headerElement.style.display === 'none';
        
        if (topBarMinimized || particle.y > currentHeaderHeight + 20) {
          ctx.beginPath();
          ctx.fillStyle = color;
          // Draw particles as a combination of circle and glow
          ctx.shadowBlur = 15;
          ctx.shadowColor = color.replace(opacity.toString(), '0.3');
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
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
