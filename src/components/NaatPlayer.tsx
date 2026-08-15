import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Sliders, Sparkles, Heart, Compass, Music, BookOpen, Clock } from 'lucide-react';
import { MixerSettings, NaatDetails, NaatVerse, PlaybackMode } from '../types';
import AudioVisualizer from './AudioVisualizer';
import VerseCard from './VerseCard';

interface NaatPlayerProps {
  naat: NaatDetails;
  currentVerseIndex: number;
  currentLineIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  playbackMode: PlaybackMode;
  mixer: MixerSettings;
  isMuted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onSeekVerse: (verseIndex: number) => void;
  onSetPlaybackMode: (mode: PlaybackMode) => void;
  onToggleMute: () => void;
  onOpenMixer: () => void;
  onOpenDuaStudio: () => void;
  onOpenTasbeeh: () => void;
  onOpenShareModal: (verse: NaatVerse) => void;
  bookmarks: string[];
  onToggleBookmark: (verse: NaatVerse) => void;
}

export default function NaatPlayer({
  naat,
  currentVerseIndex,
  currentLineIndex,
  isPlaying,
  isPaused,
  playbackMode,
  mixer,
  isMuted,
  onPlay,
  onPause,
  onResume,
  onSeekVerse,
  onSetPlaybackMode,
  onToggleMute,
  onOpenMixer,
  onOpenDuaStudio,
  onOpenTasbeeh,
  onOpenShareModal,
  bookmarks,
  onToggleBookmark
}: NaatPlayerProps) {
  const [activeTab, setActiveTab] = useState<'kalam' | 'commentary' | 'music_notes' | 'durood_collection'>('kalam');

  const currentVerse = naat.verses[currentVerseIndex] || naat.verses[0];

  const emotionalStages = [
    { label: 'Longing', urdu: 'شوق و تمنا', icon: '🕊️' },
    { label: 'Remembrance', urdu: 'ذکر و یاد', icon: '✨' },
    { label: 'Tears & Repentance', urdu: 'اشک و توبہ', icon: '💧' },
    { label: 'Hope & Mercy', urdu: 'امیدِ رحمت', icon: '🌿' },
    { label: 'Deep Love', urdu: 'عشقِ مصطفیٰؐ', icon: '❤️' },
    { label: 'Spiritual Elevation', urdu: 'صلوٰۃ و سلام', icon: '🌟' },
    { label: 'Peace & Contentment', urdu: 'سکینت و تسکین', icon: '🕊️' }
  ];

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      onSeekVerse(currentVerseIndex - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < naat.verses.length - 1) {
      onSeekVerse(currentVerseIndex + 1);
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onPlay();
    }
  };

  return (
    <div id="naat-player-main-container" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Devotional Focus Card - Immersive UI Theme */}
      <div
        id="hero-devotional-card"
        className="relative rounded-3xl p-6 sm:p-10 bg-[#040806]/85 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 right-10 w-96 h-96 bg-[#10502D]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Arc Progress Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-ping" />
              <span className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase font-cinzel font-medium">
                SACRED ISLAMIC NAAT MASTERPIECE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif text-[#E0E7E1] tracking-tight">
              {naat.titleEnglish}
            </h1>
            <p className="text-xs sm:text-sm text-[#D4AF37]/75 font-sans-clean tracking-wide">
              {naat.subtitle}
            </p>
          </div>

          {/* Mode Selector Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 text-xs">
            <button
              onClick={() => onSetPlaybackMode('full_cinematic')}
              className={`px-3.5 py-1.5 rounded-full font-sans-clean tracking-wide text-xs transition-all cursor-pointer ${
                playbackMode === 'full_cinematic'
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-[#D4AF37]/40'
                  : 'text-[#E0E7E1]/60 hover:text-[#E0E7E1]'
              }`}
            >
              🕌 Cinematic Naat
            </button>
            <button
              onClick={() => onSetPlaybackMode('acoustic_daf_ney')}
              className={`px-3.5 py-1.5 rounded-full font-sans-clean tracking-wide text-xs transition-all cursor-pointer ${
                playbackMode === 'acoustic_daf_ney'
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-[#D4AF37]/40'
                  : 'text-[#E0E7E1]/60 hover:text-[#E0E7E1]'
              }`}
            >
              🪘 Daf & Ney Mehfil
            </button>
            <button
              onClick={() => onSetPlaybackMode('sacred_acapella')}
              className={`px-3.5 py-1.5 rounded-full font-sans-clean tracking-wide text-xs transition-all cursor-pointer ${
                playbackMode === 'sacred_acapella'
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-[#D4AF37]/40'
                  : 'text-[#E0E7E1]/60 hover:text-[#E0E7E1]'
              }`}
            >
              🎙️ Sacred Acapella
            </button>
            <button
              onClick={() => onSetPlaybackMode('meditation_drone')}
              className={`px-3.5 py-1.5 rounded-full font-sans-clean tracking-wide text-xs transition-all cursor-pointer ${
                playbackMode === 'meditation_drone'
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-[#D4AF37]/40'
                  : 'text-[#E0E7E1]/60 hover:text-[#E0E7E1]'
              }`}
            >
              🕯️ Ney Meditation
            </button>
          </div>
        </div>

        {/* 8-Part Spiritual Journey & Musical Structure Timeline */}
        <div className="py-4 border-b border-white/5 relative z-10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-medium font-cinzel">
              Spiritual Journey & Structure (00:00 – 04:30)
            </span>
            <span className="text-[10px] text-[#D4AF37]/60 font-mono">
              Tempo: ~72 BPM • Maqam Hijaz
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {naat.verses.map((verse, idx) => {
              const isCurrent = currentVerseIndex === idx;
              const icons = ['🕊️', '✨', '🌿', '❤️', '💧', '🕯️', '🌟', '🕊️'];
              return (
                <button
                  key={verse.id}
                  onClick={() => onSeekVerse(idx)}
                  className={`p-2 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#10502D]/40 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.02]'
                      : idx <= currentVerseIndex
                      ? 'bg-white/[0.03] border-white/10 text-[#E0E7E1]/80 hover:border-[#D4AF37]/40'
                      : 'bg-white/[0.01] border-white/5 text-[#E0E7E1]/30 hover:text-[#E0E7E1]/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{icons[idx] || '✨'}</span>
                    <span className="text-[9px] font-mono text-[#D4AF37]/70">{verse.timeRange.split('–')[0].trim()}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] font-semibold block font-sans-clean leading-tight capitalize truncate">
                      {verse.sectionType.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-[#E0E7E1]/50 block font-cinzel truncate">
                      {verse.emotionalStage}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Stage: Active Verse Large Typography Display with Immersive UI Styling */}
        <div className="py-8 sm:py-12 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-xs text-[#D4AF37] font-cinzel tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{currentVerse.sectionTitle}</span>
          </div>

          {/* Large Calligraphic Urdu Poetry Lines */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {currentVerse.urdu.map((line, idx) => {
              const isLineActive = isPlaying && currentLineIndex === idx;
              return (
                <p
                  key={idx}
                  className={`text-2xl sm:text-4xl lg:text-5xl font-nastaliq leading-loose transition-all duration-500 ${
                    isLineActive
                      ? 'text-[#D4AF37] font-bold scale-[1.03] drop-shadow-[0_0_25px_rgba(212,175,55,0.7)]'
                      : 'text-[#E0E7E1]/85 hover:text-white'
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>

          {/* Active Transliteration and English Translation */}
          <div className="max-w-2xl mx-auto space-y-2 pt-4 border-t border-white/5">
            <p className="text-sm sm:text-base text-[#D4AF37] font-sans-clean font-medium italic">
              "{currentVerse.roman[currentLineIndex] || currentVerse.roman[0]}"
            </p>
            <p className="text-xs sm:text-sm text-[#E0E7E1]/80 font-sans-clean leading-relaxed">
              {currentVerse.english[currentLineIndex] || currentVerse.english[0]}
            </p>
          </div>

          {/* Musical & Production Cues */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#E0E7E1]/60">
            <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span><strong className="text-[#D4AF37]">Acoustic Atmosphere:</strong> {currentVerse.musicalCue.description}</span>
          </div>
        </div>

        {/* Audio Visualizer Bar */}
        <div className="pt-2 relative z-10">
          <AudioVisualizer isPlaying={isPlaying} className="h-16 w-full rounded-2xl bg-black/40 border border-white/5" />
        </div>

        {/* Dynamic Progress Bar (Immersive UI Style) */}
        <div className="pt-4 space-y-1 relative z-10">
          <div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#D4AF37] shadow-[0_0_12px_#D4AF37] transition-all duration-300"
              style={{
                width: `${((currentVerseIndex + (currentLineIndex + 1) / (currentVerse.urdu.length || 1)) / naat.verses.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Master Player Controls Deck (Immersive UI Minimalist Transport) */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          {/* Verse indicator */}
          <div className="flex items-center space-x-2 text-xs text-[#E0E7E1]/60">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span className="tracking-wide">Verse {currentVerseIndex + 1} of {naat.verses.length}</span>
          </div>

          {/* Core Transport Controls - Circular Immersive UI buttons */}
          <div className="flex items-center space-x-5">
            <button
              id="player-prev-btn"
              onClick={handlePrevVerse}
              disabled={currentVerseIndex === 0}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 disabled:opacity-20 transition-all cursor-pointer"
              title="Previous Verse"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Immersive UI White Luminous Play Button */}
            <button
              id="player-play-pause-btn"
              onClick={handlePlayToggle}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={isPlaying ? 'Pause Recitation' : 'Begin Sacred Naat'}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current text-black" /> : <Play className="w-6 h-6 fill-current text-black ml-1" />}
            </button>

            <button
              id="player-next-btn"
              onClick={handleNextVerse}
              disabled={currentVerseIndex === naat.verses.length - 1}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 disabled:opacity-20 transition-all cursor-pointer"
              title="Next Verse"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Studio & Tasbeeh Shortcuts */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenMixer}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
              title="Studio Sound Mixer"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenTasbeeh}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
              title="Durood Tasbeeh Counter"
            >
              <Heart className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="space-y-6">
        <div className="flex border-b border-white/10 text-xs sm:text-sm overflow-x-auto">
          <button
            id="tab-kalam-btn"
            onClick={() => setActiveTab('kalam')}
            className={`flex items-center space-x-2 py-3 px-4 sm:px-6 border-b-2 font-medium tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'kalam'
                ? 'border-[#D4AF37] text-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                : 'border-transparent text-[#E0E7E1]/50 hover:text-[#E0E7E1]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Complete Devotional Kalam (مکمل کلام)</span>
          </button>

          <button
            id="tab-commentary-btn"
            onClick={() => setActiveTab('commentary')}
            className={`flex items-center space-x-2 py-3 px-4 sm:px-6 border-b-2 font-medium tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'commentary'
                ? 'border-[#D4AF37] text-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                : 'border-transparent text-[#E0E7E1]/50 hover:text-[#E0E7E1]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Spiritual Themes & Hadith (روحانی شرح)</span>
          </button>

          <button
            id="tab-music-notes-btn"
            onClick={() => setActiveTab('music_notes')}
            className={`flex items-center space-x-2 py-3 px-4 sm:px-6 border-b-2 font-medium tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'music_notes'
                ? 'border-[#D4AF37] text-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                : 'border-transparent text-[#E0E7E1]/50 hover:text-[#E0E7E1]'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Sacred Musical Direction</span>
          </button>

          <button
            id="tab-durood-collection-btn"
            onClick={() => setActiveTab('durood_collection')}
            className={`flex items-center space-x-2 py-3 px-4 sm:px-6 border-b-2 font-medium tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'durood_collection'
                ? 'border-[#D4AF37] text-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
                : 'border-transparent text-[#E0E7E1]/50 hover:text-[#E0E7E1]'
            }`}
          >
            <Heart className="w-4 h-4 text-[#D4AF37]" />
            <span>Salawat & Durood Treasury</span>
          </button>
        </div>

        {/* Tab 1: Complete Verses Stanzas */}
        {activeTab === 'kalam' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {naat.verses.map((verse, idx) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                isActive={currentVerseIndex === idx}
                isPlaying={isPlaying}
                currentLineIndex={currentLineIndex}
                onPlayVerse={(vIdx) => onSeekVerse(vIdx)}
                isBookmarked={bookmarks.includes(verse.id)}
                onToggleBookmark={onToggleBookmark}
                onOpenShareModal={onOpenShareModal}
              />
            ))}
          </div>
        )}

        {/* Tab 2: Spiritual Themes & Hadith Commentary */}
        {activeTab === 'commentary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#040806]/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-lg font-cinzel font-bold text-[#D4AF37] flex items-center space-x-2.5">
                <Compass className="w-5 h-5 text-[#D4AF37]" />
                <span>The Essence of Madinah ki Tamanna</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#E0E7E1]/85 leading-relaxed">
                In classical Islamic devotion, longing for Madinah al-Munawwarah is considered an integral proof of faith (Kamaal-e-Iman). The city represents tranquility, the living presence of Prophet Muhammad ﷺ, and the sanctuary where sincere tears wash away spiritual despair.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#D4AF37]/20 space-y-1.5">
                <span className="text-xs font-semibold text-[#D4AF37]">Prophetic Hadith:</span>
                <p className="text-xs text-[#E0E7E1]/70 italic leading-relaxed">
                  "Whoever visits me after my death, it is as if he visited me in my life." — Sunan al-Bayhaqi
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#040806]/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-lg font-cinzel font-bold text-[#D4AF37] flex items-center space-x-2.5">
                <Heart className="w-5 h-5 text-[#D4AF37]" />
                <span>Repentance under Rehmat-ul-lil-Aalameen</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#E0E7E1]/85 leading-relaxed">
                The poetry deliberately pivots through broken-hearted repentance (Tawbah). Sincere crying at the sacred threshold reminds the believer that Allah’s mercy encompasses everything, and the blessed Prophet ﷺ is the universal shelter for sinners and the grief-stricken.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#D4AF37]/20 space-y-1.5">
                <span className="text-xs font-semibold text-[#D4AF37]">Quranic Verse:</span>
                <p className="text-xs text-[#E0E7E1]/70 italic leading-relaxed">
                  "And We have not sent you, [O Muhammad], except as a mercy to the worlds." — Surah Al-Anbiya (21:107)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sacred Musical Direction & Acoustic Architecture */}
        {activeTab === 'music_notes' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#040806]/80 border border-white/10 space-y-6 shadow-xl animate-in fade-in duration-300">
            <h3 className="text-lg font-cinzel font-bold text-[#D4AF37]">
              Sacred Acoustic Design & Musical Direction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="font-semibold text-[#D4AF37] font-cinzel block text-sm">1. The Ney Flute (بانسری)</span>
                <p className="text-[#E0E7E1]/70 leading-relaxed">
                  Tuned to Maqam Hijaz & Bhairavi. Modeled with acoustic breath friction and microtonal tremolos symbolizing the soul's yearning cry to reach Taybah.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="font-semibold text-[#D4AF37] font-cinzel block text-sm">2. Traditional Daf (دَف)</span>
                <p className="text-[#E0E7E1]/70 leading-relaxed">
                  Synthesized with authentic frame-drum skin resonance (Dum-Tak-Tak rhythms) that mirrors the biological human heartbeat, accelerating with devotional emotion.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="font-semibold text-[#D4AF37] font-cinzel block text-sm">3. Sacred Hall Reverb</span>
                <p className="text-[#E0E7E1]/70 leading-relaxed">
                  Algorithmic acoustic impulse response emulating the expansive, reverberant marble courtyards and arches of the Prophet's Mosque in Madinah.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Salawat & Durood Treasury */}
        {activeTab === 'durood_collection' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
            {[
              {
                title: 'Durood-e-Ibrahimi (درودِ ابراہیمی)',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
                meaning: 'The most sacred and complete Salawat taught directly by the Prophet ﷺ.'
              },
              {
                title: 'Salawat-e-Shafi (درودِ شفا)',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا وَعَافِيَةِ الأَبْدَانِ وَشِفَائِهَا',
                meaning: 'Salawat for the healing of broken hearts and bodily ailments.'
              },
              {
                title: 'Salat-ut-Tanjeena (صلوٰۃ التنجینا)',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ وَالآفَاتِ',
                meaning: 'Supplication for deliverance from all hardships and spiritual difficulties.'
              },
              {
                title: 'Durood-e-Taj Snippet (درودِ تاج)',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلاَنَا مُحَمَّدٍ صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ',
                meaning: 'Extolling the sublime spiritual ranks and heavenly ascension of the Prophet ﷺ.'
              }
            ].map((salawat, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#040806]/80 border border-white/10 space-y-2.5 shadow-xl">
                <span className="text-xs font-semibold text-[#D4AF37] font-cinzel">{salawat.title}</span>
                <p className="text-lg font-amiri text-[#E0E7E1] leading-loose py-1 text-right">
                  {salawat.arabic}
                </p>
                <p className="text-xs text-[#E0E7E1]/60 font-sans-clean">{salawat.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
