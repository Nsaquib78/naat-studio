import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { motion, AnimatePresence } from 'motion/react';
import FloatingPlayer from './components/FloatingPlayer';
import SpiritualBackground from './components/SpiritualBackground';
import PlaylistModal from './components/PlaylistModal';
import BookmarksModal from './components/BookmarksModal';
import ShareCardModal from './components/ShareCardModal';
import InstallPrompt from './components/InstallPrompt';
import { generateMoodPlaylist } from './services/aiMoodService';

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
  const [isGeneratingMood, setIsGeneratingMood] = useState(false);
  const [trackTitles, setTrackTitles] = useState<Record<string, string>>({});

  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

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

  // Fetch track titles when playlist changes
  useEffect(() => {
    const fetchTitles = async () => {
      if (!playlist || playlist.length === 0) return;

      const newTitles = { ...trackTitles };
      let hasNew = false;

      // Fetch in batches of 5 to avoid overwhelming the network
      for (let i = 0; i < playlist.length; i += 5) {
        const batch = playlist.slice(i, i + 5);
        await Promise.all(batch.map(async (id) => {
          if (!newTitles[id]) {
            try {
              const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
              if (res.ok) {
                const data = await res.json();
                newTitles[id] = data.title;
                hasNew = true;
              }
            } catch (e) {
              console.error("Failed to fetch title for", id);
            }
          }
        }));
        if (hasNew) {
          setTrackTitles(prev => ({ ...prev, ...newTitles }));
          hasNew = false;
        }
      }
    };

    fetchTitles();
  }, [playlist]);

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
        if (!pl.includes('sQxp13k_8IU')) {
          const newPl = ['sQxp13k_8IU', ...pl];
          event.target.cuePlaylist(newPl);
          setPlaylist(newPl);
        } else {
          setPlaylist(pl);
        }
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
      const currentIndex = ytPlayer.getPlaylistIndex();
      if (currentIndex === index) {
        ytPlayer.playVideo();
      } else {
        ytPlayer.playVideoAt(index);
      }
    }
  };

  const handleGenerateMoodPlaylist = async (mood: string) => {
    if (!ytPlayer) return;
    try {
      setIsGeneratingMood(true);
      const newVideoIds = await generateMoodPlaylist(mood);
      
      // Load the new playlist directly into the YouTube player
      ytPlayer.loadPlaylist(newVideoIds);
      setPlaylist(newVideoIds);
      setCurrentVideoIndex(0);
      
    } catch (error: any) {
      alert(error.message || "Failed to generate playlist. Make sure API keys are set in .env");
    } finally {
      setIsGeneratingMood(false);
    }
  };

  const handleLoadYouTubePlaylist = (playlistId: string) => {
    if (!ytPlayer) return;
    ytPlayer.loadPlaylist({
      list: playlistId,
      listType: 'playlist'
    });
    // the onStateChange handler will pick up the new playlist array when the video starts playing
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
      <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:top-12 lg:right-12 z-20 text-center lg:text-right pointer-events-none drop-shadow-2xl max-w-[90vw] sm:max-w-xl w-full px-4 lg:px-0 flex flex-col items-center lg:items-end">
        <motion.h1 variants={titleVariants} initial="hidden" animate={animState} className="text-5xl sm:text-7xl lg:text-8xl font-bold font-nastaliq text-white leading-normal pb-1 sm:pb-2 lg:pb-4 drop-shadow-lg">
          مدینہ
        </motion.h1>
        <motion.h2 variants={subtitleVariants} initial="hidden" animate={animState} className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#D4AF37] mt-1 sm:mt-2 lg:mt-4 tracking-wide uppercase drop-shadow-md">
          Ki Tamanna
        </motion.h2>
        <motion.p variants={subtitleVariants} initial="hidden" animate={animState} className="text-[10px] sm:text-sm lg:text-base font-cinzel tracking-[0.1em] sm:tracking-[0.2em] lg:tracking-[0.3em] text-white/70 mt-2 sm:mt-3 lg:mt-4 uppercase drop-shadow-sm">
          Spiritual Islamic Naat Experience
        </motion.p>
        
        {/* Developer Credit */}
        <motion.div variants={subtitleVariants} initial="hidden" animate={animState}>
          <p className="inline-block pointer-events-auto text-[10px] sm:text-sm text-[#D4AF37]/70 hover:text-[#D4AF37] hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] font-cinzel tracking-widest mt-4 sm:mt-6 transition-all duration-500 cursor-default animate-pulse">
            <span className="font-nastaliq text-sm sm:text-xl align-middle leading-none drop-shadow-md">نجم الثاقب</span> 
            <span className="font-sans-clean ml-1 sm:ml-2 font-medium drop-shadow-md">· Najmus Saquib</span>
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
          onGenerateMoodPlaylist={handleGenerateMoodPlaylist}
          onLoadYouTubePlaylist={handleLoadYouTubePlaylist}
          isGeneratingMood={isGeneratingMood}
          trackTitles={trackTitles}
        />
        <InstallPrompt />
      </motion.div>
    </div>
  );
}
