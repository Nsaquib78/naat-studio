import { useEffect, useRef } from 'react';
import backgroundImg from '../assets/images/background.jpg';

interface SpiritualBackgroundProps {
  currentEmotionalStage?: string;
}

export default function SpiritualBackground({ currentEmotionalStage }: SpiritualBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
    }> = [];

    const numParticles = 45;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.7 + 0.2,
        fadeSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.85 || p.opacity < 0.15) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < 0) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Golden glowing noor particles in imperial gold #D4AF37
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div id="spiritual-background-root" className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-black">
      
      {/* Background Sacred Image */}
      <div className="absolute inset-0 opacity-70">
        <img
          src={backgroundImg}
          alt="Madinah Sacred Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-125 contrast-110 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040806] via-[#040806]/50 to-transparent" />
      </div>

      {/* Subtle Sacred Starburst Noor Watermark with 100px blur */}
      <div
        className="absolute inset-0 opacity-10 z-10"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 0L52 48L100 50L52 52L50 100L48 52L0 50L48 48Z" fill="%23D4AF37"/%3E%3C/svg%3E')`,
          backgroundSize: '160px',
          filter: 'blur(90px)'
        }}
      />

      {/* Dynamic Noor Light Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-20" />

      {/* Radial ambient corners */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[90px]" />
    </div>
  );
}
