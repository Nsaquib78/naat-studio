import { Volume2, VolumeX, Sliders, Sparkles, Heart, Bookmark, Moon } from 'lucide-react';
import { MixerSettings } from '../types';

interface HeaderProps {
  isMuted: boolean;
  mixer: MixerSettings;
  onToggleMute: () => void;
  onOpenMixer: () => void;
  onOpenDuaStudio: () => void;
  onOpenTasbeeh: () => void;
  onOpenBookmarks: () => void;
  salawatCount: number;
}

export default function Header({
  isMuted,
  mixer,
  onToggleMute,
  onOpenMixer,
  onOpenDuaStudio,
  onOpenTasbeeh,
  onOpenBookmarks,
  salawatCount
}: HeaderProps) {
  return (
    <header id="sacred-header" className="relative z-40 w-full border-b border-white/5 bg-[#040806]/80 backdrop-blur-xl sticky top-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: App Title with Immersive UI gold glowing orb */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] animate-pulse"></div>
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-light tracking-[0.3em] uppercase text-[#D4AF37] font-cinzel">
                Madinah Ki Tamanna
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10502D]/40 border border-[#D4AF37]/30 text-[#E0E7E1] font-sans-clean tracking-wider">
                مدینہ کی تمنا
              </span>
            </div>
            <p className="text-[11px] text-[#E0E7E1]/50 font-nastaliq tracking-widest hidden sm:block">
              صَلَّى اللّٰهُ عَلٰى حَبِیْبِهِ مُحَمَّدٍ وَّآلِهِ وَسَلَّمَ
            </p>
          </div>
        </div>

        {/* Center: Live Salawat Counter Indicator */}
        <button
          id="header-durood-badge-btn"
          onClick={onOpenTasbeeh}
          className="hidden md:flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all text-xs text-[#E0E7E1]/80 hover:text-[#D4AF37] group cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          title="Click to open Durood & Salawat Tasbeeh Counter"
        >
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform animate-pulse" />
          <span className="font-sans-clean text-[11px] tracking-[0.15em] uppercase opacity-70">Salawat:</span>
          <span className="font-bold text-[#D4AF37] font-cinzel px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            {salawatCount}
          </span>
        </button>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* AI Dua Studio Button */}
          <button
            id="header-ai-dua-btn"
            onClick={onOpenDuaStudio}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-[#E0E7E1] hover:text-[#D4AF37] text-xs font-medium tracking-wider uppercase transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Dua & Kalam AI</span>
            <span className="sm:hidden">Dua</span>
          </button>

          {/* Sound Mixer Trigger */}
          <button
            id="header-sound-mixer-btn"
            onClick={onOpenMixer}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/80 hover:text-[#D4AF37] text-xs font-medium tracking-wider uppercase transition-all cursor-pointer"
            title="Studio Sound Mixer (Ney, Daf, Strings, Reverb)"
          >
            <Sliders className="w-3.5 h-3.5 text-[#D4AF37]/80" />
            <span className="hidden md:inline">Acoustics</span>
          </button>

          {/* Bookmarks */}
          <button
            id="header-bookmarks-btn"
            onClick={onOpenBookmarks}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-all cursor-pointer"
            title="Saved Verses"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            id="header-audio-mute-btn"
            onClick={onToggleMute}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
