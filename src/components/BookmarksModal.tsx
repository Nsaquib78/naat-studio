import { X, Bookmark, Trash2, Play } from 'lucide-react';
import { BookmarkItem, NaatVerse } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  verses: NaatVerse[];
  onPlayVerse: (verseIndex: number) => void;
  onRemoveBookmark: (verseId: string) => void;
}

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarks,
  verses,
  onPlayVerse,
  onRemoveBookmark
}: BookmarksModalProps) {
  if (!isOpen) return null;

  return (
    <div id="bookmarks-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-[#040806]/80 backdrop-blur-sm" onClick={onClose} />
      
      <div
        id="bookmarks-modal"
        className="relative w-full max-w-xl bg-[#040806]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-[#E0E7E1] flex flex-col space-y-5 max-h-[85dvh] overflow-y-auto backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2.5">
            <Bookmark className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            <h3 className="text-lg font-cinzel font-bold text-[#D4AF37]">
              Saved Sacred Verses ({bookmarks.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 -mr-3 rounded-full flex items-center justify-center text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Bookmark className="w-10 h-10 text-[#E0E7E1]/20 mx-auto" />
            <p className="text-sm text-[#E0E7E1]/80">You haven't saved any verses yet.</p>
            <p className="text-xs text-[#E0E7E1]/40 font-sans-clean">
              Click the bookmark icon on any verse to keep it in your personal collection.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bm) => {
              const targetVerseIdx = verses.findIndex(v => v.id === bm.verseId);
              return (
                <div
                  key={bm.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#D4AF37] font-cinzel">
                      {bm.verseTitle}
                    </span>
                    <p className="text-base font-nastaliq text-[#E0E7E1] line-clamp-1">
                      {bm.urduSnippet}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {targetVerseIdx !== -1 && (
                      <button
                        onClick={() => {
                          onPlayVerse(targetVerseIdx);
                          onClose();
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
                        title="Play Verse"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveBookmark(bm.verseId)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.03] hover:bg-rose-950/50 border border-white/10 text-[#E0E7E1]/50 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
