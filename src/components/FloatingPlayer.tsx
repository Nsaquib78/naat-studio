import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, ListMusic } from 'lucide-react';

interface FloatingPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  title: string;
  subtitle: string;
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
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
  onTogglePlaylist,
}: FloatingPlayerProps) {
  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 z-50">
      <div className="bg-[#18181A]/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
        
        {/* Left: Album Art & Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
            {/* Placeholder image, could be passed as prop later */}
            <img 
              src="https://images.unsplash.com/photo-1590494482084-297eb09831d6?w=100&h=100&fit=crop" 
              alt="Album Art" 
              className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm truncate pr-4">{title}</h4>
            <p className="text-white/50 text-xs truncate">{subtitle}</p>
            
            {/* Minimal Progress Bar */}
            <div className="flex items-center space-x-2 mt-1.5 w-full">
              <span className="text-[9px] text-white/40 tabular-nums w-6 text-right">
                {formatTime(currentTime)}
              </span>
              <div 
                className="h-1 bg-white/10 rounded-full flex-1 relative cursor-pointer group"
                onClick={(e) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - bounds.left;
                  const newTime = (x / bounds.width) * duration;
                  onSeek(newTime);
                }}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-[#E0E7E1] rounded-full group-hover:bg-[#D4AF37] transition-colors"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] text-white/40 tabular-nums w-6">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-4 sm:space-x-5 ml-4 sm:ml-6 flex-shrink-0">
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
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
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

      </div>
    </div>
  );
}
