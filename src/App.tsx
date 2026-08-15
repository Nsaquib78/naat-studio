import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
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

  const progressInterval = useRef<number | null>(null);

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
    // Get the array of video IDs in the playlist
    const pl = event.target.getPlaylist();
    if (pl) {
      setPlaylist(pl);
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
      setCurrentVideoIndex(event.target.getPlaylistIndex());
      
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

  return (
    <div id="madinah-naat-app-root" className="min-h-screen bg-[#040806] text-[#E0E7E1] relative font-sans-clean overflow-hidden">
      {/* Hidden YouTube Player for Audio Streaming */}
      <div className="hidden">
        <YouTube opts={opts} onReady={onReady} onStateChange={onStateChange} />
      </div>

      {/* Dynamic Background */}
      <SpiritualBackground currentEmotionalStage="Longing" />

      {/* Large Stylish Typography Overlay (like the reference image) */}
      <div className="absolute top-16 right-16 z-20 text-right pointer-events-none drop-shadow-2xl">
        {/* Adjusted padding/margin and line-height to fix overlap */}
        <h1 className="text-7xl sm:text-9xl font-bold font-nastaliq text-white leading-normal pb-4">
          مدینہ
        </h1>
        <h2 className="text-4xl sm:text-6xl font-bold font-serif text-[#D4AF37] mt-8 tracking-wide uppercase">
          Ki Tamanna
        </h2>
        <p className="text-sm sm:text-base font-cinzel tracking-[0.3em] text-white/60 mt-4 uppercase">
          Spiritual Islamic Naat Experience
        </p>
      </div>

      {/* Floating Audio Player at the bottom */}
      <FloatingPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        title={trackTitle}
        subtitle={trackSubtitle}
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
    </div>
  );
}
