import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, ListMusic, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FloatingPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  title: string;
  subtitle: string;
  currentVideoId?: string;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onTogglePlaylist: () => void;
}

export default function FloatingPlayer({
  isPlaying,
  currentTime,
  duration,
  title,
  subtitle,
  currentVideoId,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
  onTogglePlaylist,
}: FloatingPlayerProps) {
  const [imgError, setImgError] = useState(false);
  const imgUrl = currentVideoId ? `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg` : undefined;
  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-3 sm:px-4 lg:px-0 z-50">
      <motion.div 
        className="bg-[#18181A]/90 backdrop-blur-md border border-white/10 rounded-full px-4 sm:px-6 py-4 flex items-center justify-between shadow-2xl"
        whileHover={{ y: -2, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.1)" }}
        animate={isPlaying ? { scale: [1, 1.01, 1] } : { scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        
        {/* Left: Album Art & Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="relative w-12 h-12 flex-shrink-0">
            {/* Glowing ring when playing */}
            {isPlaying && (
              <motion.div 
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#10B981] opacity-50 blur-[3px]"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.div 
              className="relative w-full h-full rounded-full overflow-hidden border border-white/20 bg-black flex items-center justify-center z-10"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {imgUrl && !imgError ? (
                <img 
                  src={imgUrl} 
                  alt="Album Art" 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1A231C] to-[#2A3B30] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white/50" />
                </div>
              )}
            </motion.div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-white font-medium text-sm truncate">{title}</h4>
              {isPlaying && (
                <div className="flex items-end space-x-0.5 h-3 pb-0.5">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-[#D4AF37] rounded-full"
                      animate={{ height: ["30%", "100%", "30%"] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-white/50 text-xs truncate">{subtitle}</p>
            
            {/* Minimal Progress Bar (Increased touch target for mobile) */}
            <div className="flex items-center space-x-2 mt-1.5 w-full">
              <span className="text-[9px] text-white/40 tabular-nums w-6 text-right">
                {formatTime(currentTime)}
              </span>
              <div 
                className="py-3 flex-1 relative cursor-pointer group flex items-center"
                onClick={(e) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - bounds.left;
                  const newTime = (x / bounds.width) * duration;
                  onSeek(newTime);
                }}
              >
                <div className="h-1 bg-white/10 rounded-full w-full relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#E0E7E1] rounded-full group-hover:bg-[#D4AF37] transition-colors"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-[9px] text-white/40 tabular-nums w-6">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-3 sm:space-x-5 ml-3 sm:ml-6 flex-shrink-0">
          <button className="hidden sm:block text-white/50 hover:text-white transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <button onClick={onPrev} className="text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={isPlaying ? onPause : onPlay} 
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div 
                  key="pause"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Pause className="w-4 h-4 fill-current" />
                </motion.div>
              ) : (
                <motion.div 
                  key="play"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <button onClick={onNext} className="text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="hidden sm:block text-white/50 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="hidden sm:block text-white/50 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
          <button onClick={onTogglePlaylist} className="text-white/50 hover:text-[#D4AF37] transition-colors relative">
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
}
