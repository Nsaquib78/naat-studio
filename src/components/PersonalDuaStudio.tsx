import { useState } from 'react';
import { X, Sparkles, Send, Copy, Check, Heart, BookOpen, Loader2 } from 'lucide-react';
import { GeneratedDuaKalam } from '../types';

interface PersonalDuaStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonalDuaStudio({ isOpen, onClose }: PersonalDuaStudioProps) {
  const [emotionalState, setEmotionalState] = useState<string>('Broken Heart seeking peace in Madinah');
  const [prayerTopic, setPrayerTopic] = useState<string>('Yearning to visit the Green Dome and seek forgiveness for all sins');
  const [tone, setTone] = useState<'classical_urdu' | 'simple_emotional' | 'urdu_with_english'>('classical_urdu');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeneratedDuaKalam | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const emotionalPresets = [
    'Restless Heart seeking peace (دل کا سکون)',
    'Tears of Repentance (توبہ و استغفار)',
    'Longing for Madinah Ziyarat (مدینہ کی حاضری کی دعا)',
    'Healing for Sick Loved One (شفائے کاملہ)',
    'Gratitude & Love for Prophet ﷺ (عشقِ رسولؐ)'
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/generate-dua-kalam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotionalState,
          personalPrayerTopic: prayerTopic,
          languageTone: tone
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data: GeneratedDuaKalam = await response.json();
      setResult(data);
    } catch (err: unknown) {
      console.error('Error generating dua kalam:', err);
      setError(err instanceof Error ? err.message : 'Unable to connect to AI server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `${result.title}\n\n${result.urduVerses.join('\n')}\n\n${result.romanVerses.join('\n')}\n\nTranslation:\n${result.englishTranslation.join('\n')}\n\nRecommended Salawat:\n${result.recommendedSalawat}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="dua-studio-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div
        id="dua-studio-modal"
        className="w-full max-w-3xl bg-[#040806]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-[#E0E7E1] flex flex-col space-y-6 max-h-[92vh] overflow-y-auto backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-cinzel font-bold text-[#D4AF37]">
                Personal Dua & Naat Studio (مناجات و کلام)
              </h2>
              <p className="text-xs text-[#E0E7E1]/60 font-sans-clean mt-0.5">
                Express your heart's longing to generate personalized classical poetic Naat verses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#E0E7E1]/70 hover:text-[#D4AF37] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          {/* Preset Buttons */}
          <div>
            <label className="text-[11px] font-semibold text-[#D4AF37]/80 mb-2 block uppercase tracking-[0.2em] font-cinzel">
              Choose Heart's State
            </label>
            <div className="flex flex-wrap gap-2">
              {emotionalPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setEmotionalState(preset);
                    setPrayerTopic(preset);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans-clean transition-all cursor-pointer ${
                    emotionalState === preset
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] font-semibold'
                      : 'bg-white/[0.02] border border-white/10 text-[#E0E7E1]/70 hover:text-white hover:border-white/20'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Supplication Input */}
          <div>
            <label className="text-xs font-semibold text-[#E0E7E1] mb-1.5 block font-sans-clean">
              Describe your personal longing, supplication, or intention:
            </label>
            <textarea
              rows={3}
              value={prayerTopic}
              onChange={(e) => setPrayerTopic(e.target.value)}
              placeholder="e.g. My heart feels burdened by worldly stress, I yearn for the gentle peace of Madinah and intercession of Prophet Muhammad ﷺ..."
              className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-[#E0E7E1] text-xs sm:text-sm resize-none outline-none transition-all placeholder:text-[#E0E7E1]/30"
            />
          </div>

          {/* Tone Selector & Generate Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2 text-xs text-[#E0E7E1]/60">
              <span className="font-cinzel text-[11px] uppercase tracking-wider text-[#D4AF37]/80">Poetic Tone:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as 'classical_urdu' | 'simple_emotional' | 'urdu_with_english')}
                className="bg-[#040806] border border-white/10 text-[#E0E7E1] rounded-xl px-3 py-1.5 outline-none text-xs focus:border-[#D4AF37]"
              >
                <option value="classical_urdu">Classical Sufi Urdu (اعلیٰ حضرت و اقبال انداز)</option>
                <option value="simple_emotional">Simple Heartfelt Devotional (آسان و پر اثر)</option>
                <option value="urdu_with_english">Poetic Urdu with Rich English</option>
              </select>
            </div>

            <button
              id="generate-dua-kalam-btn"
              onClick={handleGenerate}
              disabled={isLoading || !prayerTopic.trim()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 disabled:opacity-40 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Composing Sacred Verses...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>Compose Personal Kalam</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Generated Result Display */}
        {result && (
          <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-cinzel font-bold text-[#D4AF37]">
                {result.title}
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#E0E7E1]/80 hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Kalam'}</span>
              </button>
            </div>

            {/* Urdu Verses in Nastaliq */}
            <div className="p-6 rounded-3xl bg-[#040806] border border-[#D4AF37]/40 text-center space-y-3 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              {result.urduVerses.map((line, idx) => (
                <p key={idx} className="text-xl sm:text-2xl font-nastaliq text-[#D4AF37] leading-loose">
                  {line}
                </p>
              ))}
            </div>

            {/* Roman Urdu & English Translation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#D4AF37]/80 tracking-widest font-cinzel flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Roman Urdu Transliteration</span>
                </span>
                {result.romanVerses.map((line, idx) => (
                  <p key={idx} className="text-xs text-[#E0E7E1]/80 italic font-sans-clean">
                    {line}
                  </p>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#D4AF37]/80 tracking-widest font-cinzel flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Poetic English Meaning</span>
                </span>
                {result.englishTranslation.map((line, idx) => (
                  <p key={idx} className="text-xs text-[#E0E7E1]/80 font-sans-clean">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Spiritual Reflection & Salawat */}
            <div className="p-4 rounded-2xl bg-[#10502D]/20 border border-[#D4AF37]/30 space-y-2 text-xs">
              <p className="text-[#E0E7E1]/85 leading-relaxed">
                <strong className="text-[#D4AF37] font-medium font-cinzel">Spiritual Insight (روحانی پیغام): </strong>
                {result.spiritualMeaning}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[#E0E7E1]/60 font-cinzel text-[11px]">Recommended Salawat:</span>
                <span className="font-nastaliq text-[#D4AF37] text-sm">{result.recommendedSalawat}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
