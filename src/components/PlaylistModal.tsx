import { useState } from 'react';
import { X, Sparkles, CloudRain, Sunrise, Moon, Flame } from 'lucide-react';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistIds: string[];
  currentIndex: number;
  onPlayIndex: (index: number) => void;
  onGenerateMoodPlaylist?: (mood: string) => void;
  onLoadYouTubePlaylist?: (playlistId: string) => void;
  isGeneratingMood?: boolean;
  trackTitles?: Record<string, string>;
}

export default function PlaylistModal({
  isOpen,
  onClose,
  playlistIds,
  currentIndex,
  onPlayIndex,
  onGenerateMoodPlaylist,
  onLoadYouTubePlaylist,
  isGeneratingMood = false,
  trackTitles = {}
}: PlaylistModalProps) {
  const [activeTab, setActiveTab] = useState('default');
  const [activeSubTab, setActiveSubTab] = useState('mix1');

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[120px] left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[calc(50vw-280px)] w-[calc(100vw-32px)] sm:w-[380px] bg-[#111113] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[60dvh] sm:max-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 flex-shrink-0">
        <h3 className="text-white font-medium flex items-center space-x-2 text-sm">
          <svg className="w-4 h-4 text-[#F94C57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span>Playlist ({playlistIds.length})</span>
        </h3>
        <button onClick={onClose} className="p-2 -mr-2 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2 p-3 pb-2 flex-shrink-0">
        <button 
          onClick={() => {
            setActiveTab('default');
            onLoadYouTubePlaylist?.('PLEMli7spCEYcUz9BGZ-3yvDNwfgjIBf5B');
          }}
          className={`py-1.5 border rounded-lg text-xs font-medium transition-colors ${activeTab === 'default' ? 'border-[#F94C57]/50 bg-[#3A141A] text-white/90' : 'border-white/5 bg-white/[0.02] text-white/50 hover:text-white/90'}`}>
          Default
        </button>
        <button 
          onClick={() => {
            setActiveTab('nath1');
            onLoadYouTubePlaylist?.('PLx0SsipgAdEnMuYkRnCRsfJZNYVyqSVGI');
          }}
          className={`py-1.5 border rounded-lg text-xs font-medium transition-colors ${activeTab === 'nath1' ? 'border-[#F94C57]/50 bg-[#3A141A] text-white/90' : 'border-white/5 bg-white/[0.02] text-white/50 hover:text-white/90'}`}>
          Nath 1
        </button>
        <button 
          onClick={() => {
            setActiveTab('nath2');
            onLoadYouTubePlaylist?.('PLiqAkN_L0xkPKSE_EO2XzqY5iI02clvpC');
          }}
          className={`py-1.5 border rounded-lg text-xs font-medium transition-colors ${activeTab === 'nath2' ? 'border-[#F94C57]/50 bg-[#3A141A] text-white/90' : 'border-white/5 bg-white/[0.02] text-white/50 hover:text-white/90'}`}>
          Junaid Jamshed
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`py-1.5 border rounded-lg text-xs font-medium transition-colors ${activeTab === 'favorites' ? 'border-[#F94C57]/50 bg-[#3A141A] text-white/90' : 'border-white/5 bg-white/[0.02] text-white/50 hover:text-white/90'}`}>
          Favorites
        </button>
      </div>

      {activeTab === 'nath2' && (
        <div className="flex gap-2 px-3 pb-3 flex-shrink-0 border-b border-white/5">
          <button
            onClick={() => {
              setActiveSubTab('mix1');
              onLoadYouTubePlaylist?.('PLiqAkN_L0xkPKSE_EO2XzqY5iI02clvpC');
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors ${activeSubTab === 'mix1' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/70 hover:text-white'}`}
          >
            Mix 1
          </button>
          <button
            onClick={() => {
              setActiveSubTab('mix2');
              onLoadYouTubePlaylist?.('PLVdDKYcXHtGRFliCvM7MgGmOyfmAf4Pq0');
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors ${activeSubTab === 'mix2' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/70 hover:text-white'}`}
          >
            Mix 2
          </button>
          <button
            onClick={() => {
              setActiveSubTab('mix3');
              onLoadYouTubePlaylist?.('PLnS9YkBiVq6AFhEkf6eV_MwGOGBqmWXhC');
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors ${activeSubTab === 'mix3' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/70 hover:text-white'}`}
          >
            Mix 3
          </button>
        </div>
      )}

      {/* AI Mood Mix */}
      <div className="px-3 py-2.5 border-b border-white/5 bg-white/[0.01] flex-shrink-0">
        <h4 className="text-white font-medium mb-2.5 flex items-center space-x-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F94C57]" />
          <span>AI Mood Mix</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {["Eid Milad-un-Nabi", "Muharram", "Eid-ul-Adha", "Ramadan", "Jumma Mubarak"].map((mood) => (
            <button
              key={mood}
              onClick={() => onGenerateMoodPlaylist && onGenerateMoodPlaylist(mood)}
              disabled={isGeneratingMood}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-full text-[10px] text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3 h-3" />
              <span>{mood}</span>
            </button>
          ))}
        </div>
        {isGeneratingMood && (
          <div className="mt-3 flex items-center space-x-2 text-xs text-[#D4AF37]/80 animate-pulse">
            <div className="w-3 h-3 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            <span>Generating your spiritual playlist...</span>
          </div>
        )}
      </div>

      {/* Track List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1.5 custom-scrollbar bg-black/20">
        {playlistIds.length > 0 ? (
          playlistIds.map((id, index) => {
            const isActive = index === currentIndex;
            const title = trackTitles[id] || `Track ${index + 1}`;
            
            return (
              <button 
                key={id + index}
                onClick={() => onPlayIndex(index)}
                className={`w-full flex items-center text-left p-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#2A0F13] border border-[#F94C57]/40' 
                    : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.05]'
                }`}
              >
                <span className={`w-5 text-[10px] font-mono ${isActive ? 'text-[#F94C57]' : 'text-white/40'}`}>
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {title}
                  </p>
                  <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/60' : 'text-white/40'}`}>
                    YouTube Audio • {id.slice(0, 8)}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-8 text-white/40 text-xs">
            Loading playlist...
          </div>
        )}
      </div>
      
      <style>{`
        /* Thin, clean scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
