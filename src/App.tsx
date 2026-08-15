import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { motion, AnimatePresence } from 'motion/react';
import FloatingPlayer from './components/FloatingPlayer';
import SpiritualBackground from './components/SpiritualBackground';
import PlaylistModal from './components/PlaylistModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ytPlayer, setYtPlayer] = useState<YouTubePlayer | null>(null);

  const [trackTitle, setTrackTitle] = useState("Madinah Ki Tamanna");
  const [trackSubtitle, setTrackSubtitle] = useState("The Longing for Madinah");
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('introPlayed'));

  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('introPlayed', 'true');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  const handleSkipIntro = () => {
    if (showIntro) {
      setShowIntro(false);
      sessionStorage.setItem('introPlayed', 'true');
    }
  };

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        if (ytPlayer) {
          setCurrentTime(ytPlayer.getCurrentTime());
        }
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, ytPlayer]);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      listType: 'playlist',
      list: 'PLEMli7spCEYcUz9BGZ-3yvDNwfgjIBf5B',
    },
  };

  const onReady = (event: YouTubeEvent) => {
    setYtPlayer(event.target);
    setDuration(event.target.getDuration());

    const tryGetPlaylist = (attempts = 0) => {
      const pl = event.target.getPlaylist();
      if (pl && pl.length > 0) {
        setPlaylist(pl);
      } else if (attempts < 10) {
        setTimeout(() => tryGetPlaylist(attempts + 1), 300);
      }
    };
    tryGetPlaylist();
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
      setCurrentVideoIndex(event.target.getPlaylistIndex());
      
      const pl = event.target.getPlaylist();
      if (pl && pl.length > 0) {
        setPlaylist(pl);
      }

      const videoData = event.target.getVideoData();
      if (videoData && videoData.title) {
        setTrackTitle(videoData.title);
        setTrackSubtitle(videoData.author || "Islamic Naat");
      }
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (ytPlayer) ytPlayer.playVideo();
  };

  const handlePause = () => {
    if (ytPlayer) ytPlayer.pauseVideo();
  };

  const handleNext = () => {
    if (ytPlayer) ytPlayer.nextVideo();
  };

  const handlePrev = () => {
    if (ytPlayer) ytPlayer.previousVideo();
  };

  const handleSeek = (time: number) => {
    if (ytPlayer) {
      ytPlayer.seekTo(time, true);
      setCurrentTime(time);
    }
  };

  const handlePlayPlaylistItem = (index: number) => {
    if (ytPlayer) {
      ytPlayer.playVideoAt(index);
    }
  };

  const animState = showIntro ? "intro" : "visible";

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    intro: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 } },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.3 } }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    intro: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.6 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const playerVariants = {
    hidden: { opacity: 0, y: 100 },
    intro: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 2.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const bgVariants = {
    hidden: { opacity: 0 },
    intro: { opacity: 1, transition: { duration: 2, ease: "easeInOut", delay: 2.8 } },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div id="madinah-naat-app-root" className="min-h-screen text-[#E0E7E1] relative z-0 font-sans-clean overflow-hidden bg-black" onClick={handleSkipIntro}>
      {/* Hidden YouTube Player for Audio Streaming */}
      <div className="hidden">
        <YouTube opts={opts} onReady={onReady} onStateChange={onStateChange} />
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,80,45,0.4)_0%,_transparent_60%)] z-10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <motion.div variants={bgVariants} initial="hidden" animate={animState} className="absolute inset-0 -z-10">
        <SpiritualBackground currentEmotionalStage="Longing" />
      </motion.div>

      {/* Large Stylish Typography Overlay (Responsive) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:top-12 lg:right-12 z-20 text-center lg:text-right pointer-events-none drop-shadow-2xl max-w-xl w-full px-4 lg:px-0">
        <motion.h1 variants={titleVariants} initial="hidden" animate={animState} className="text-6xl sm:text-7xl lg:text-8xl font-bold font-nastaliq text-white leading-normal pb-2 lg:pb-4 drop-shadow-lg">
          مدینہ
        </motion.h1>
        <motion.h2 variants={subtitleVariants} initial="hidden" animate={animState} className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#D4AF37] mt-2 lg:mt-4 tracking-wide uppercase drop-shadow-md">
          Ki Tamanna
        </motion.h2>
        <motion.p variants={subtitleVariants} initial="hidden" animate={animState} className="text-xs sm:text-sm lg:text-base font-cinzel tracking-[0.2em] lg:tracking-[0.3em] text-white/70 mt-3 lg:mt-4 uppercase drop-shadow-sm">
          Spiritual Islamic Naat Experience
        </motion.p>
        
        {/* Developer Credit */}
        <motion.div variants={subtitleVariants} initial="hidden" animate={animState}>
          <p className="inline-block pointer-events-auto text-[9px] sm:text-[10px] text-[#D4AF37]/50 hover:text-[#D4AF37]/90 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] font-cinzel tracking-widest mt-6 transition-all duration-500 cursor-default">
            Crafted by <span className="font-nastaliq text-[#D4AF37]/70 text-sm align-middle leading-none">نجم الثاقب</span> 
            <span className="font-sans-clean ml-1">· Najmus Saquib</span>
          </p>
        </motion.div>
      </div>

      {/* Backdrop Dimming when Playlist is Open */}
      {isPlaylistOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity" 
          onClick={() => setIsPlaylistOpen(false)}
        />
      )}

      {/* Floating Audio Player at the bottom */}
      <motion.div variants={playerVariants} initial="hidden" animate={animState} className="relative z-40">
        <FloatingPlayer
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          title={trackTitle}
          subtitle={trackSubtitle}
          currentVideoId={playlist.length > 0 ? playlist[currentVideoIndex] : undefined}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={handleSeek}
          onTogglePlaylist={() => setIsPlaylistOpen(!isPlaylistOpen)}
        />

        <PlaylistModal 
          isOpen={isPlaylistOpen} 
          onClose={() => setIsPlaylistOpen(false)}
          playlistIds={playlist}
          currentIndex={currentVideoIndex}
          onPlayIndex={handlePlayPlaylistItem}
        />
      </motion.div>
    </div>
  );
}
