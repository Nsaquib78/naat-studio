import { useEffect, useRef } from 'react';
import { sacredAudio } from '../audio/sacredAudioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export default function AudioVisualizer({ isPlaying, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 64;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      // Handle high-DPI
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      if (!isPlaying) {
        // Subtle ambient idle wave
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.lineWidth = 1.5;
        const time = Date.now() * 0.002;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      sacredAudio.getFrequencyData(freqData);
      sacredAudio.getTimeDomainData(timeData);

      // Draw glowing frequency bars mirrored from center
      const barWidth = (width / bufferLength) * 1.6;
      const centerX = width / 2;

      for (let i = 0; i < bufferLength / 2; i++) {
        const val = freqData[i] / 255;
        const barHeight = Math.max(3, val * (height * 0.75));

        // Sacred colors: Emerald to Warm Gold
        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        gradient.addColorStop(0, `rgba(245, 158, 11, ${0.3 + val * 0.7})`); // Amber Gold
        gradient.addColorStop(0.5, `rgba(16, 185, 129, ${0.5 + val * 0.5})`); // Emerald
        gradient.addColorStop(1, `rgba(245, 158, 11, ${0.3 + val * 0.7})`);

        ctx.fillStyle = gradient;

        // Symmetrical bars from center
        const xOffset = i * barWidth;
        // Right side
        ctx.fillRect(centerX + xOffset, height / 2 - barHeight / 2, barWidth - 1, barHeight);
        // Left side
        ctx.fillRect(centerX - xOffset - barWidth, height / 2 - barHeight / 2, barWidth - 1, barHeight);
      }

      // Draw smooth golden energy waveform line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2;
        const x = (i / bufferLength) * width;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div id="sacred-audio-visualizer-container" className={`relative overflow-hidden ${className}`}>
      <canvas
        id="sacred-audio-canvas"
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
