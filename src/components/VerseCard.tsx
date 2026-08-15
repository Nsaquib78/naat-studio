import { useState } from 'react';
import { Play, Pause, Bookmark, Share2, Info, Check, Copy } from 'lucide-react';
import { NaatVerse } from '../types';

interface VerseCardProps {
  verse: NaatVerse;
  isActive: boolean;
  isPlaying: boolean;
  currentLineIndex: number;
  onPlayVerse: (verseIndex: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: (verse: NaatVerse) => void;
  onOpenShareModal: (verse: NaatVerse) => void;
}

export default function VerseCard({
  verse,
  isActive,
  isPlaying,
  currentLineIndex,
  onPlayVerse,
  isBookmarked,
  onToggleBookmark,
  onOpenShareModal
}: VerseCardProps) {
  const [showInsights, setShowInsights] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    const text = `${verse.sectionTitle}\n\n${verse.urdu.join('\n')}\n\n${verse.roman.join('\n')}\n\nTranslation:\n${verse.english.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionBadgeStyle = () => {
    switch (verse.sectionType) {
      case 'chorus':
        return 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]';
      case 'pre_chorus':
        return 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]';
      case 'bridge':
        return 'bg-[#10502D]/40 border-[#10502D] text-[#E0E7E1]';
      case 'intro':
        return 'bg-white/[0.05] border-white/20 text-[#E0E7E1]/80';
      case 'outro':
        return 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]/90';
      default:
        return 'bg-white/[0.04] border-white/10 text-[#E0E7E1]/70';
    }
  };

  return (
    <div
      id={`verse-card-${verse.id}`}
      className={`rounded-3xl p-6 sm:p-7 transition-all duration-500 relative overflow-hidden border ${
        isActive
          ? 'bg-[#040806]/95 border-[#D4AF37]/80 shadow-[0_0_30px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/30'
          : 'bg-[#040806]/60 hover:bg-[#040806]/80 border-white/10 hover:border-[#D4AF37]/30'
      }`}
    >
      {/* Active Left Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]" />
      )}

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] px-3 py-1 rounded-full border font-sans-clean font-semibold tracking-widest uppercase ${getSectionBadgeStyle()}`}>
            {verse.sectionType.replace('_', ' ')}
          </span>
          {verse.timeRange && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D4AF37]/70">
              {verse.timeRange}
            </span>
          )}
          <h3 className="text-xs sm:text-sm font-cinzel font-semibold text-[#E0E7E1] tracking-wide">
            {verse.sectionTitle}
          </h3>
        </div>

        {/* Action icons - Minimalist circular controls */}
        <div className="flex items-center space-x-2 sm:space-x-1.5">
          {/* Play/Pause Button */}
          <button
            onClick={() => onPlayVerse(verse.verseNumber - 1)}
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
              isActive && isPlaying
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-white/[0.04] hover:bg-[#D4AF37]/20 border border-white/10 text-[#E0E7E1] hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
            }`}
            title={isActive && isPlaying ? 'Pause' : 'Play this verse'}
          >
            {isActive && isPlaying ? <Pause className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" /> : <Play className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />}
          </button>

          {/* Insights Button */}
          <button
            onClick={() => setShowInsights(!showInsights)}
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
              showInsights
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37]'
            }`}
            title="Spiritual Commentary & Hadith Context"
          >
            <Info className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(verse)}
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37]'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Verse'}
          >
            <Bookmark className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isBookmarked ? 'fill-[#D4AF37]' : ''}`} />
          </button>

          {/* Share Card */}
          <button
            onClick={() => onOpenShareModal(verse)}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-all cursor-pointer"
            title="Create Shareable Devotional Card"
          >
            <Share2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-all cursor-pointer"
            title="Copy Verse Text"
          >
            {copied ? <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" /> : <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
          </button>
        </div>
      </div>

      {/* Urdu Nastaliq Lines with active highlight */}
      <div className="space-y-3 py-2 text-right">
        {verse.urdu.map((line, idx) => {
          const isLineActive = isActive && currentLineIndex === idx;
          return (
            <p
              key={idx}
              className={`text-lg sm:text-2xl font-nastaliq leading-loose sm:leading-loose transition-all duration-300 ${
                isLineActive
                  ? 'text-[#D4AF37] font-bold scale-[1.01] drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                  : 'text-[#E0E7E1]/85 hover:text-white'
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* Roman Urdu Transliteration & English Translation */}
      <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Roman */}
        <div className="space-y-1.5 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] uppercase font-semibold text-[#D4AF37]/80 tracking-widest font-cinzel">
            Roman Urdu
          </span>
          {verse.roman.map((line, idx) => {
            const isLineActive = isActive && currentLineIndex === idx;
            return (
              <p
                key={idx}
                className={`font-sans-clean transition-colors ${
                  isLineActive ? 'text-[#D4AF37] font-semibold' : 'text-[#E0E7E1]/60'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>

        {/* English */}
        <div className="space-y-1.5 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] uppercase font-semibold text-[#D4AF37]/80 tracking-widest font-cinzel">
            English Translation
          </span>
          {verse.english.map((line, idx) => {
            const isLineActive = isActive && currentLineIndex === idx;
            return (
              <p
                key={idx}
                className={`font-sans-clean transition-colors ${
                  isLineActive ? 'text-[#E0E7E1] font-medium' : 'text-[#E0E7E1]/60'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* Expandable Spiritual Insights & Hadith context */}
      {showInsights && (
        <div className="mt-4 p-5 rounded-2xl bg-[#10502D]/20 border border-[#D4AF37]/30 space-y-2.5 text-xs animate-in fade-in duration-300">
          <div>
            <h4 className="font-semibold text-[#D4AF37] flex items-center space-x-2 font-cinzel">
              <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Spiritual Wisdom & Heart Context (روحانی شرح)</span>
            </h4>
            <p className="text-[#E0E7E1]/85 mt-1 leading-relaxed">{verse.spiritualContext}</p>
          </div>

          {verse.hadithOrTafseerRef && (
            <div className="pt-2 border-t border-white/10">
              <span className="font-medium text-[#D4AF37] block mb-0.5 font-cinzel">Reference:</span>
              <p className="text-[#E0E7E1]/70 italic font-sans-clean">{verse.hadithOrTafseerRef}</p>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#E0E7E1]/60">
            <span>Emotional Arc: <strong className="text-[#D4AF37]">{verse.emotionalStage}</strong></span>
            <span>Arrangement: {verse.musicalCue.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}
