import { useState, useEffect } from 'react';
import { MADINAH_NAAT } from './data/naatData';
import { sacredAudio, AudioEngineState } from './audio/sacredAudioEngine';
import { BookmarkItem, MixerSettings, NaatVerse, PlaybackMode } from './types';
import Header from './components/Header';
import NaatPlayer from './components/NaatPlayer';
import SoundMixerModal from './components/SoundMixerModal';
import SalawatDuroodCounter from './components/SalawatDuroodCounter';
import PersonalDuaStudio from './components/PersonalDuaStudio';
import BookmarksModal from './components/BookmarksModal';
import ShareCardModal from './components/ShareCardModal';
import SpiritualBackground from './components/SpiritualBackground';

export default function App() {
  const [audioState, setAudioState] = useState<AudioEngineState>({
    isPlaying: false,
    isPaused: false,
    currentVerseIndex: 0,
    currentLineIndex: 0,
    verseProgressSeconds: 0,
    playbackMode: 'full_cinematic',
    mixer: {
      masterVolume: 0.85,
      leadVocal: 0.95,
      neyFlute: 0.8,
      dafDrums: 0.7,
      cinematicStrings: 0.75,
      ambientPad: 0.65,
      reverbDepth: 0.6,
      salawatDrone: 0.5
    },
    isMuted: false
  });

  // Salawat Counter state (saved to localStorage)
  const [salawatCount, setSalawatCount] = useState<number>(() => {
    const saved = localStorage.getItem('madinah_naat_salawat_count');
    return saved ? parseInt(saved, 10) : 14;
  });

  // Bookmarks state (saved to localStorage)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('madinah_naat_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [isMixerOpen, setIsMixerOpen] = useState<boolean>(false);
  const [isTasbeehOpen, setIsTasbeehOpen] = useState<boolean>(false);
  const [isDuaStudioOpen, setIsDuaStudioOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [shareModalVerse, setShareModalVerse] = useState<NaatVerse | null>(null);

  // Subscribe to sacred audio engine events
  useEffect(() => {
    const unsubscribe = sacredAudio.subscribe((newState) => {
      setAudioState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Save salawat count to storage
  useEffect(() => {
    localStorage.setItem('madinah_naat_salawat_count', salawatCount.toString());
  }, [salawatCount]);

  // Save bookmarks to storage
  useEffect(() => {
    localStorage.setItem('madinah_naat_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handlers
  const handlePlay = () => {
    sacredAudio.start(MADINAH_NAAT.verses, audioState.currentVerseIndex);
  };

  const handlePause = () => {
    sacredAudio.pause();
  };

  const handleResume = () => {
    sacredAudio.resume();
  };

  const handleSeekVerse = (verseIndex: number) => {
    sacredAudio.seekVerse(MADINAH_NAAT.verses, verseIndex);
  };

  const handleSetPlaybackMode = (mode: PlaybackMode) => {
    sacredAudio.setPlaybackMode(mode, MADINAH_NAAT.verses[audioState.currentVerseIndex]);
  };

  const handleUpdateMixer = (newSettings: Partial<MixerSettings>) => {
    sacredAudio.updateMixer(newSettings);
  };

  const handleToggleMute = () => {
    sacredAudio.toggleMute();
  };

  const handleIncrementSalawat = () => {
    setSalawatCount(prev => prev + 1);
  };

  const handleResetSalawat = () => {
    setSalawatCount(0);
  };

  const handleToggleBookmark = (verse: NaatVerse) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.verseId === verse.id);
      if (exists) {
        return prev.filter(b => b.verseId !== verse.id);
      } else {
        const newItem: BookmarkItem = {
          id: `bm-${Date.now()}`,
          verseId: verse.id,
          verseTitle: verse.sectionTitle,
          urduSnippet: verse.urdu[0],
          timestamp: Date.now()
        };
        return [...prev, newItem];
      }
    });
  };

  const handleRemoveBookmark = (verseId: string) => {
    setBookmarks(prev => prev.filter(b => b.verseId !== verseId));
  };

  const currentVerse = MADINAH_NAAT.verses[audioState.currentVerseIndex];

  return (
    <div id="madinah-naat-app-root" className="min-h-screen bg-[#040806] text-[#E0E7E1] flex flex-col relative font-sans-clean selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Dynamic Background with Green Dome and glowing noor particles */}
      <SpiritualBackground currentEmotionalStage={currentVerse?.emotionalStage} />

      {/* Top Header */}
      <Header
        isMuted={audioState.isMuted}
        mixer={audioState.mixer}
        onToggleMute={handleToggleMute}
        onOpenMixer={() => setIsMixerOpen(true)}
        onOpenDuaStudio={() => setIsDuaStudioOpen(true)}
        onOpenTasbeeh={() => setIsTasbeehOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        salawatCount={salawatCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <NaatPlayer
          naat={MADINAH_NAAT}
          currentVerseIndex={audioState.currentVerseIndex}
          currentLineIndex={audioState.currentLineIndex}
          isPlaying={audioState.isPlaying}
          isPaused={audioState.isPaused}
          playbackMode={audioState.playbackMode}
          mixer={audioState.mixer}
          isMuted={audioState.isMuted}
          onPlay={handlePlay}
          onPause={handlePause}
          onResume={handleResume}
          onSeekVerse={handleSeekVerse}
          onSetPlaybackMode={handleSetPlaybackMode}
          onToggleMute={handleToggleMute}
          onOpenMixer={() => setIsMixerOpen(true)}
          onOpenDuaStudio={() => setIsDuaStudioOpen(true)}
          onOpenTasbeeh={() => setIsTasbeehOpen(true)}
          onOpenShareModal={(verse) => setShareModalVerse(verse)}
          bookmarks={bookmarks.map(b => b.verseId)}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#040806]/90 backdrop-blur-xl py-6 text-center text-xs text-[#E0E7E1]/50 space-y-1.5">
        <p className="font-nastaliq text-[#D4AF37] text-base">
          صَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ، صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ
        </p>
        <p className="font-cinzel tracking-widest text-[10px] uppercase text-[#E0E7E1]/40">
          Madinah Ki Tamanna — An Islamic Devotional Naat & Supplication Sanctuary
        </p>
      </footer>

      {/* Modals */}
      <SoundMixerModal
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        mixer={audioState.mixer}
        onUpdateMixer={handleUpdateMixer}
      />

      <SalawatDuroodCounter
        isOpen={isTasbeehOpen}
        onClose={() => setIsTasbeehOpen(false)}
        count={salawatCount}
        onIncrement={handleIncrementSalawat}
        onReset={handleResetSalawat}
      />

      <PersonalDuaStudio
        isOpen={isDuaStudioOpen}
        onClose={() => setIsDuaStudioOpen(false)}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        verses={MADINAH_NAAT.verses}
        onPlayVerse={handleSeekVerse}
        onRemoveBookmark={handleRemoveBookmark}
      />

      <ShareCardModal
        isOpen={!!shareModalVerse}
        onClose={() => setShareModalVerse(null)}
        verse={shareModalVerse}
      />
    </div>
  );
}
