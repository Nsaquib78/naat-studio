import { Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenBookmarks: () => void;
}

export default function Header({
  onOpenBookmarks
}: HeaderProps) {
  return (
    <header id="sacred-header" className="relative z-40 w-full border-b border-white/5 bg-[#040806]/80 backdrop-blur-xl sticky top-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: App Title with Immersive UI gold glowing orb */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] animate-pulse"></div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <span className="text-[10px] sm:text-sm font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#D4AF37] font-cinzel truncate">
                Madinah Ki Tamanna
              </span>
              <span className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#10502D]/40 border border-[#D4AF37]/30 text-[#E0E7E1] font-sans-clean tracking-wider whitespace-nowrap flex-shrink-0">
                مدینہ کی تمنا
              </span>
            </div>
            <p className="text-[11px] text-[#E0E7E1]/50 font-nastaliq tracking-widest hidden sm:block">
              صَلَّى اللّٰهُ عَلٰى حَبِیْبِهِ مُحَمَّدٍ وَّآلِهِ وَسَلَّمَ
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* Bookmarks */}
          <button
            id="header-bookmarks-btn"
            onClick={onOpenBookmarks}
            className="p-3 sm:p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-all cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
            title="Saved Verses"
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
