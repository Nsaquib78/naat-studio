import { useState } from 'react';
import { X, Copy, Check, Download, Heart } from 'lucide-react';
import { NaatVerse } from '../types';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: NaatVerse | null;
}

export default function ShareCardModal({ isOpen, onClose, verse }: ShareCardModalProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !verse) return null;

  const handleCopyText = () => {
    const text = `✨ ${verse.sectionTitle} ✨\n\n${verse.urdu.join('\n')}\n\n"${verse.english.join(' ')}"\n\n— From 'Madinah Ki Tamanna' Sacred Naat`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="share-card-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div
        id="share-card-modal"
        className="relative w-full max-w-xl bg-[#040806]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-[#E0E7E1] flex flex-col space-y-5 backdrop-blur-2xl max-h-[85dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-base font-cinzel font-bold text-[#D4AF37] flex items-center space-x-2.5">
            <Heart className="w-4 h-4 text-[#D4AF37]" />
            <span>Devotional Shareable Card</span>
          </h3>
          <button
            onClick={onClose}
            className="p-3 -mr-3 rounded-full flex items-center justify-center text-[#E0E7E1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Devotional Graphic Preview */}
        <div
          id="sacred-share-card-canvas"
          className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 p-6 sm:p-8 bg-[#040806] text-center space-y-4 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
        >
          {/* Subtle background image */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/src/assets/images/madinah_courtyard_1786787539246.jpg"
              alt="Madinah"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter blur-xs"
            />
          </div>

          {/* Border ornament */}
          <div className="relative z-10 space-y-4">
            <div className="text-[11px] font-cinzel tracking-[0.2em] text-[#D4AF37] uppercase font-semibold">
              صَلَّى اللّٰهُ عَلَىٰ حَبِیْبِهِ مُحَمَّدٍ وَّآلِهِ وَسَلَّمَ
            </div>

            {/* Urdu in Nastaliq */}
            <div className="space-y-2 py-2">
              {verse.urdu.map((line, idx) => (
                <p key={idx} className="text-xl sm:text-2xl font-nastaliq text-[#D4AF37] leading-loose drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  {line}
                </p>
              ))}
            </div>

            {/* Roman */}
            <div className="space-y-1">
              {verse.roman.map((line, idx) => (
                <p key={idx} className="text-xs text-[#E0E7E1]/80 italic font-sans-clean">
                  {line}
                </p>
              ))}
            </div>

            {/* English */}
            <p className="text-xs text-[#E0E7E1]/70 font-sans-clean italic pt-2 border-t border-white/10">
              "{verse.english[0]}"
            </p>

            <div className="text-[10px] text-[#D4AF37]/60 font-cinzel pt-2 uppercase tracking-widest">
              Madinah Ki Tamanna — مدینہ کی تمنا
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#E0E7E1]/80 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Poetry Text'}</span>
          </button>

          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Print / Save Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
