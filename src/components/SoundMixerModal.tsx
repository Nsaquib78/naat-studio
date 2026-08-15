import { ReactNode } from 'react';
import { X, RotateCcw, Volume2, Music, Waves, Flame, Sparkles } from 'lucide-react';
import { MixerSettings } from '../types';

interface SoundMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mixer: MixerSettings;
  onUpdateMixer: (newSettings: Partial<MixerSettings>) => void;
}

export default function SoundMixerModal({
  isOpen,
  onClose,
  mixer,
  onUpdateMixer
}: SoundMixerModalProps) {
  if (!isOpen) return null;

  const handleReset = () => {
    onUpdateMixer({
      masterVolume: 0.85,
      leadVocal: 0.95,
      neyFlute: 0.8,
      dafDrums: 0.7,
      cinematicStrings: 0.75,
      ambientPad: 0.65,
      reverbDepth: 0.6,
      salawatDrone: 0.5
    });
  };

  const applyPreset = (preset: 'cinematic' | 'mehfil' | 'meditation' | 'acapella') => {
    switch (preset) {
      case 'cinematic':
        onUpdateMixer({
          masterVolume: 0.9,
          leadVocal: 1.0,
          neyFlute: 0.85,
          dafDrums: 0.8,
          cinematicStrings: 0.9,
          ambientPad: 0.7,
          reverbDepth: 0.65,
          salawatDrone: 0.5
        });
        break;
      case 'mehfil':
        onUpdateMixer({
          masterVolume: 0.85,
          leadVocal: 1.0,
          neyFlute: 0.9,
          dafDrums: 0.85,
          cinematicStrings: 0.3,
          ambientPad: 0.4,
          reverbDepth: 0.5,
          salawatDrone: 0.35
        });
        break;
      case 'meditation':
        onUpdateMixer({
          masterVolume: 0.8,
          leadVocal: 0.4,
          neyFlute: 0.95,
          dafDrums: 0.2,
          cinematicStrings: 0.8,
          ambientPad: 0.9,
          reverbDepth: 0.8,
          salawatDrone: 0.7
        });
        break;
      case 'acapella':
        onUpdateMixer({
          masterVolume: 0.9,
          leadVocal: 1.0,
          neyFlute: 0.2,
          dafDrums: 0.3,
          cinematicStrings: 0.1,
          ambientPad: 0.2,
          reverbDepth: 0.7,
          salawatDrone: 0.2
        });
        break;
    }
  };

  return (
    <div id="sound-mixer-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div
        id="sound-mixer-modal"
        className="w-full max-w-2xl bg-[#040806]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-[#E0E7E1] flex flex-col space-y-6 max-h-[90vh] overflow-y-auto backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-cinzel font-bold text-[#D4AF37] flex items-center space-x-2.5">
              <SlidersIcon className="w-5 h-5 text-[#D4AF37]" />
              <span>Sacred Audio Studio Mixer</span>
            </h2>
            <p className="text-xs text-[#E0E7E1]/60 mt-1 font-sans-clean">
              Customize instrument stems, devotional voice clarity, and sacred acoustic hall reverb
            </p>
          </div>
          <button
            id="close-mixer-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#E0E7E1]/70 hover:text-[#D4AF37] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2.5">
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]/80 font-cinzel font-semibold block">
            Acoustic Atmosphere Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => applyPreset('cinematic')}
              className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E0E7E1] transition-all cursor-pointer text-center font-medium"
            >
              🕌 Cinematic Masterpiece
            </button>
            <button
              onClick={() => applyPreset('mehfil')}
              className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E0E7E1] transition-all cursor-pointer text-center font-medium"
            >
              🪘 Intimate Mehfil
            </button>
            <button
              onClick={() => applyPreset('meditation')}
              className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E0E7E1] transition-all cursor-pointer text-center font-medium"
            >
              🕯️ Ney Meditation
            </button>
            <button
              onClick={() => applyPreset('acapella')}
              className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E0E7E1] transition-all cursor-pointer text-center font-medium"
            >
              🎙️ Sacred Acapella
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Volume */}
          <MixerChannel
            label="Master Output Volume"
            value={mixer.masterVolume}
            icon={<Volume2 className="w-4 h-4 text-[#D4AF37]" />}
            onChange={(val) => onUpdateMixer({ masterVolume: val })}
          />

          {/* Lead Vocal */}
          <MixerChannel
            label="Lead Reciter Vocal (آواز)"
            value={mixer.leadVocal}
            icon={<Sparkles className="w-4 h-4 text-[#D4AF37]" />}
            onChange={(val) => onUpdateMixer({ leadVocal: val })}
          />

          {/* Ney Flute */}
          <MixerChannel
            label="Ney Flute (بانسری)"
            value={mixer.neyFlute}
            icon={<Music className="w-4 h-4 text-[#D4AF37]" />}
            onChange={(val) => onUpdateMixer({ neyFlute: val })}
          />

          {/* Traditional Daf */}
          <MixerChannel
            label="Traditional Daf / Frame Drum (دَف)"
            value={mixer.dafDrums}
            icon={<Flame className="w-4 h-4 text-[#D4AF37]" />}
            onChange={(val) => onUpdateMixer({ dafDrums: val })}
          />

          {/* Cinematic Strings */}
          <MixerChannel
            label="Cinematic Strings Swell"
            value={mixer.cinematicStrings}
            icon={<Waves className="w-4 h-4 text-[#D4AF37]" />}
            onChange={(val) => onUpdateMixer({ cinematicStrings: val })}
          />

          {/* Ambient Pad / Tanpura Drone */}
          <MixerChannel
            label="Ambient Drone & Sub Bass"
            value={mixer.ambientPad}
            icon={<Waves className="w-4 h-4 text-[#D4AF37]" />}
            onChange={(val) => onUpdateMixer({ ambientPad: val })}
          />

          {/* Sacred Hall Reverb */}
          <div className="md:col-span-2">
            <MixerChannel
              label="Sacred Hall Reverb Space (مسجدِ نبوی جیسی گونج)"
              value={mixer.reverbDepth}
              icon={<Sparkles className="w-4 h-4 text-[#D4AF37]" />}
              onChange={(val) => onUpdateMixer({ reverbDepth: val })}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#E0E7E1]/80 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Master Balance</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function MixerChannel({
  label,
  value,
  icon,
  onChange
}: {
  label: string;
  value: number;
  icon: ReactNode;
  onChange: (val: number) => void;
}) {
  const percentage = Math.round(value * 100);

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 font-medium text-[#E0E7E1]">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-mono text-[#D4AF37] font-semibold">{percentage}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
      />
    </div>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}
