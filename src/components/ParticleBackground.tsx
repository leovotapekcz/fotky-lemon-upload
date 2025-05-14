
import { useRef, useEffect, useState } from 'react';
import { useParticleAnimation } from '@/hooks/useParticleAnimation';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opacity, setOpacity] = useState(0);
  
  useParticleAnimation(canvasRef);
  
  useEffect(() => {
    // Fade in the canvas
    setTimeout(() => {
      setOpacity(0.7);
    }, 500);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
      style={{ opacity }}
    />
  );
};
