
import { useRef } from 'react';
import { useParticleAnimation } from '@/hooks/useParticleAnimation';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useParticleAnimation(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};
