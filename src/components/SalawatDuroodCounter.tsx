import { useState } from 'react';
import { X, Heart, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SalawatDuroodCounterProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}

export default function SalawatDuroodCounter({
  isOpen,
  onClose,
  count,
  onIncrement,
  onReset
}: SalawatDuroodCounterProps) {
  const [selectedSalawat, setSelectedSalawat] = useState<number>(0);
  const targets = [33, 100, 313, 1000];

  if (!isOpen) return null;

  const salawatOptions = [
    {
      urdu: 'صَلَّى اللّٰهُ عَلٰى مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ',
      transliteration: 'Sallallahu Ala Muhammad, Sallallahu Alaihi Wa Sallam',
      meaning: 'May the peace and blessings of Allah be upon Muhammad ﷺ',
      reward: 'Whoever sends blessings once, Allah will send blessings on him ten times.'
    },
    {
      urdu: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ وَبَارِكْ وَسَلِّمْ',
      transliteration: 'Allahumma Salli Ala Sayyidina Muhammadin Wa Ala Aali Sayyidina Muhammadin Wa Barik Wa Sallim',
      meaning: 'O Allah! Send peace, blessings, and grace upon our Master Muhammad and his blessed family.',
      reward: 'Erases 10 sins, elevates 10 spiritual ranks, and brings immense Sakinah.'
    },
    {
      urdu: 'الصَّلَاةُ وَالسَّلَامُ عَلَيْكَ يَا رَسُولَ اللَّهِ',
      transliteration: 'As-Salatu Was-Salamu Alaika Ya Rasool Allah ﷺ',
      meaning: 'Blessings and peace be upon you, O Messenger of Allah ﷺ!',
      reward: 'Direct loving greeting presented to the blessed Rawdah Mubarak.'
    }
  ];

  const currentOption = salawatOptions[selectedSalawat];

  const handleTap = () => {
    onIncrement();
    // Check if hit a milestone
    if (targets.includes(count + 1)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#fbbf24', '#ffffff']
      });
    }
  };

  const nextTarget = targets.find(t => t > count) || targets[targets.length - 1];
  const progressPercent = Math.min(100, Math.round((count / nextTarget) * 100));

  return (
    <div id="tasbeeh-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div
        id="tasbeeh-modal"
        className="w-full max-w-lg bg-[#040806]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-[#E0E7E1] flex flex-col space-y-6 relative overflow-hidden backdrop-blur-2xl"
      >
        {/* Glow ambient */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#10502D]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2.5">
            <Heart className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            <h2 className="text-lg font-cinzel font-bold text-[#D4AF37]">
              Durood & Salaam Counter (تسبيحِ صلوات)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#E0E7E1]/70 hover:text-[#D4AF37] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Salawat Selection Tabs */}
        <div className="flex rounded-full bg-white/[0.03] p-1 border border-white/10 text-xs">
          {salawatOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSalawat(idx)}
              className={`flex-1 py-1.5 px-3 rounded-full text-center font-sans-clean transition-all cursor-pointer ${
                selectedSalawat === idx
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.2)] font-semibold'
                  : 'text-[#E0E7E1]/50 hover:text-[#E0E7E1]'
              }`}
            >
              Option {idx + 1}
            </button>
          ))}
        </div>

        {/* Active Salawat Display */}
        <div className="text-center space-y-2 py-3 px-5 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-xl sm:text-2xl font-nastaliq text-[#D4AF37] leading-loose py-1">
            {currentOption.urdu}
          </p>
          <p className="text-xs text-[#E0E7E1]/80 font-sans-clean italic">
            "{currentOption.transliteration}"
          </p>
          <p className="text-xs text-[#E0E7E1]/60 font-sans-clean">
            {currentOption.meaning}
          </p>
        </div>

        {/* Main Circular Tap Counter */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            id="tasbeeh-tap-btn"
            onClick={handleTap}
            className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#040806] border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] active:scale-95 transition-all flex flex-col items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(212,175,55,0.35)] cursor-pointer group relative select-none"
          >
            {/* Pulsing ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 animate-spin-slow pointer-events-none" />

            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]/80 font-cinzel font-semibold mb-1">
              Tap to Offer
            </span>
            <span className="text-4xl sm:text-5xl font-cinzel font-bold text-[#E0E7E1] group-hover:text-[#D4AF37] transition-colors">
              {count}
            </span>
            <span className="text-[11px] text-[#E0E7E1]/50 mt-1 font-sans-clean tracking-wider">
              Target: {nextTarget}
            </span>
          </button>

          {/* Progress bar */}
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs text-[#E0E7E1]/60">
              <span className="tracking-wider font-cinzel text-[10px] uppercase">Goal Progress</span>
              <span className="text-[#D4AF37] font-mono font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hadith Note on Salawat */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#D4AF37]/20 flex items-start space-x-3 text-xs text-[#E0E7E1]/80">
          <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#D4AF37] font-cinzel block mb-0.5">Virtue of Salawat:</span>
            <p className="leading-relaxed">{currentOption.reward}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#E0E7E1]/60 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-2 rounded-full bg-white text-black text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
