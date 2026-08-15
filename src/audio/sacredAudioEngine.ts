/**
 * Sacred Audio Engine for Madinah Ki Tamanna Naat Experience
 * Features:
 * - Procedural Ney Flute synthesizer with microtonal vibrato in Maqam Hijaz / Bhairavi
 * - Physical Daf (Frame Drum) acoustic model with skin resonance and heartbeat pulse
 * - Warm Cinematic Strings & Polyphonic Tanpura-like Drone
 * - Devotional Choral Harmonies (formant vowel filters)
 * - Synchronized Urdu Recitation Voice
 * - High-definition Web Audio Reverb (Sacred Hall impulse response)
 * - Real-time Analyser for dynamic visual waveform and frequency spectrum
 */

import { MixerSettings, NaatVerse, PlaybackMode } from '../types';

class SacredAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  // Nodes
  private masterGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;

  // Stems Gain Nodes
  private vocalGain: GainNode | null = null;
  private neyGain: GainNode | null = null;
  private dafGain: GainNode | null = null;
  private stringsGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private droneGain: GainNode | null = null;

  // Active Loops / Oscillators
  private activeDroneOscs: OscillatorNode[] = [];
  private activePadOscs: OscillatorNode[] = [];
  private activeChoirOscs: OscillatorNode[] = [];
  private dafTimer: number | null = null;
  private neyTimer: number | null = null;
  private progressTimer: number | null = null;

  // State
  private mixer: MixerSettings = {
    masterVolume: 0.85,
    leadVocal: 0.95,
    neyFlute: 0.8,
    dafDrums: 0.7,
    cinematicStrings: 0.75,
    ambientPad: 0.65,
    reverbDepth: 0.6,
    salawatDrone: 0.5
  };

  private playbackMode: PlaybackMode = 'full_cinematic';
  private currentVerseIndex: number = 0;
  private currentLineIndex: number = 0;
  private verseProgressSeconds: number = 0;
  private isMuted: boolean = false;
  private listeners: Set<(state: AudioEngineState) => void> = new Set();

  // Speech Synth
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  // Maqam Hijaz / Bhairavi Scale frequencies (D Root)
  private readonly scaleFreqs = [
    146.83, // D3
    155.56, // Eb3
    185.00, // F#3
    196.00, // G3
    220.00, // A3
    233.08, // Bb3
    261.63, // C4
    293.66, // D4
    311.13, // Eb4
    369.99, // F#4
    392.00, // G4
    440.00, // A4
    466.16, // Bb4
    523.25, // C5
    587.33  // D5
  ];

  constructor() {
    // Lazy init on first user gesture
  }

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtxClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.mixer.masterVolume, this.ctx.currentTime);

    // Analyser
    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 512;
    this.analyserNode.smoothingTimeConstant = 0.85;

    // Connect Master to Analyser to Destination
    this.masterGain.connect(this.analyserNode);
    this.analyserNode.connect(this.ctx.destination);

    // Create Sacred Hall Reverb
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.createSacredImpulseResponse(this.ctx, 3.8, 2.2);

    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.setValueAtTime(this.mixer.reverbDepth, this.ctx.currentTime);
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    // Initialize Stem Gains
    this.vocalGain = this.ctx.createGain();
    this.vocalGain.gain.setValueAtTime(this.mixer.leadVocal, this.ctx.currentTime);
    this.vocalGain.connect(this.masterGain);
    this.vocalGain.connect(this.reverbNode);

    this.neyGain = this.ctx.createGain();
    this.neyGain.gain.setValueAtTime(this.mixer.neyFlute, this.ctx.currentTime);
    this.neyGain.connect(this.masterGain);
    this.neyGain.connect(this.reverbNode);

    this.dafGain = this.ctx.createGain();
    this.dafGain.gain.setValueAtTime(this.mixer.dafDrums, this.ctx.currentTime);
    this.dafGain.connect(this.masterGain);
    this.dafGain.connect(this.reverbNode);

    this.stringsGain = this.ctx.createGain();
    this.stringsGain.gain.setValueAtTime(this.mixer.cinematicStrings, this.ctx.currentTime);
    this.stringsGain.connect(this.masterGain);
    this.stringsGain.connect(this.reverbNode);

    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(this.mixer.ambientPad, this.ctx.currentTime);
    this.padGain.connect(this.masterGain);
    this.padGain.connect(this.reverbNode);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.mixer.salawatDrone, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);
  }

  // Create an acoustic reverberation impulse response mimicking marble sanctuary
  private createSacredImpulseResponse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / length;
      const n = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      // Soft high-frequency damping
      left[i] = n * Math.sin(i * 0.005);
      right[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * Math.cos(i * 0.005);
    }
    return impulse;
  }

  // Subscribe to playback updates
  public subscribe(cb: (state: AudioEngineState) => void) {
    this.listeners.add(cb);
    this.notify();
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    const state: AudioEngineState = {
      isPlaying: this.isRunning && !this.isPaused,
      isPaused: this.isPaused,
      currentVerseIndex: this.currentVerseIndex,
      currentLineIndex: this.currentLineIndex,
      verseProgressSeconds: this.verseProgressSeconds,
      playbackMode: this.playbackMode,
      mixer: { ...this.mixer },
      isMuted: this.isMuted
    };
    this.listeners.forEach((cb) => cb(state));
  }

  public async start(verses: NaatVerse[], startVerseIndex: number = 0) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.stop();
    this.isRunning = true;
    this.isPaused = false;
    this.currentVerseIndex = startVerseIndex;
    this.currentLineIndex = 0;
    this.verseProgressSeconds = 0;

    // Start stems
    this.startDrone();
    this.startStrings();
    this.playVerseSequence(verses, this.currentVerseIndex);
    this.notify();
  }

  public pause() {
    if (!this.isRunning) return;
    this.isPaused = true;
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    this.notify();
  }

  public resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
    this.notify();
  }

  public stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.stopAllOscillators();
    if (this.dafTimer) clearInterval(this.dafTimer);
    if (this.neyTimer) clearInterval(this.neyTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.dafTimer = null;
    this.neyTimer = null;
    this.progressTimer = null;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  public seekVerse(verses: NaatVerse[], verseIndex: number) {
    if (verseIndex < 0 || verseIndex >= verses.length) return;
    this.currentVerseIndex = verseIndex;
    this.currentLineIndex = 0;
    this.verseProgressSeconds = 0;

    if (this.isRunning) {
      if (this.dafTimer) clearInterval(this.dafTimer);
      if (this.neyTimer) clearInterval(this.neyTimer);
      if (this.progressTimer) clearInterval(this.progressTimer);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.playVerseSequence(verses, this.currentVerseIndex);
    }
    this.notify();
  }

  // Play continuous sequence of verses
  private playVerseSequence(verses: NaatVerse[], verseIdx: number) {
    if (!this.isRunning || verseIdx >= verses.length) {
      this.stop();
      return;
    }

    const verse = verses[verseIdx];
    this.currentVerseIndex = verseIdx;
    this.currentLineIndex = 0;
    this.verseProgressSeconds = 0;

    // Apply musical cues dynamically for this verse
    this.applyVerseMusicalCues(verse);

    // Schedule Daf patterns
    this.startDafPattern(verse.musicalCue.tempo, verse.musicalCue.dafIntensity, verse.sectionType);

    // Schedule Ney Flute Melodic phrasing
    this.startNeyMelody(verse);

    // Voice recitation
    this.reciteVerseLines(verse, () => {
      // Verse ended -> Move to next verse seamlessly
      if (this.isRunning && !this.isPaused) {
        const nextIdx = (verseIdx + 1) % verses.length;
        this.playVerseSequence(verses, nextIdx);
      }
    });

    // Track progress timer
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressTimer = window.setInterval(() => {
      if (!this.isPaused && this.isRunning) {
        this.verseProgressSeconds += 0.2;
        this.notify();
      }
    }, 200);

    this.notify();
  }

  private applyVerseMusicalCues(verse: NaatVerse) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const cue = verse.musicalCue;

    if (this.neyGain) {
      const modeMult = this.playbackMode === 'meditation_drone' ? 1.2 : this.playbackMode === 'sacred_acapella' ? 0.2 : 1.0;
      this.neyGain.gain.setTargetAtTime(this.mixer.neyFlute * cue.neyPresence * modeMult, now, 1.2);
    }

    if (this.dafGain) {
      const modeMult = this.playbackMode === 'sacred_acapella' ? 0.3 : this.playbackMode === 'meditation_drone' ? 0 : 1.0;
      this.dafGain.gain.setTargetAtTime(this.mixer.dafDrums * cue.dafIntensity * modeMult, now, 1.0);
    }

    if (this.stringsGain) {
      const modeMult = this.playbackMode === 'sacred_acapella' ? 0.1 : 1.0;
      this.stringsGain.gain.setTargetAtTime(this.mixer.cinematicStrings * cue.stringSwell * modeMult, now, 1.5);
    }

    if (cue.choralLayer && this.playbackMode !== 'meditation_drone') {
      this.triggerChoralHarmony();
    }
  }

  // Recite lines sequentially with emotional vocal synthesis
  private reciteVerseLines(verse: NaatVerse, onComplete: () => void) {
    const lines = verse.urdu;
    const totalLines = lines.length;
    const timePerLine = (verse.durationSeconds * 1000) / totalLines;

    let lineIndex = 0;

    const reciteNext = () => {
      if (!this.isRunning || lineIndex >= totalLines) {
        onComplete();
        return;
      }

      this.currentLineIndex = lineIndex;
      this.notify();

      const textToSpeak = lines[lineIndex];

      // Play soft vocal synthesis hum alongside Speech Synthesis
      this.synthesizeVocalHarmonics(verse, lineIndex);

      if ('speechSynthesis' in window && this.playbackMode !== 'meditation_drone') {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Find best Urdu/Hindi/Arabic/Asian voice if available
        const voices = window.speechSynthesis.getVoices();
        const urduVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi') || v.lang.startsWith('ar')) || voices[0];
        if (urduVoice) utterance.voice = urduVoice;

        utterance.rate = 0.82; // Warm, deliberate, heartfelt pacing
        utterance.pitch = 0.92; // Warm male resonance
        utterance.volume = this.mixer.leadVocal;

        utterance.onend = () => {
          // Add gentle devotional pause between lines
          setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
              lineIndex++;
              reciteNext();
            }
          }, 600);
        };

        utterance.onerror = () => {
          setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
              lineIndex++;
              reciteNext();
            }
          }, timePerLine);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback or Meditation Drone mode
        setTimeout(() => {
          if (this.isRunning && !this.isPaused) {
            lineIndex++;
            reciteNext();
          }
        }, timePerLine);
      }
    };

    reciteNext();
  }

  // Synthesize a human vocal vowel formant tone (simulating expressive male recitation)
  private synthesizeVocalHarmonics(verse: NaatVerse, lineIdx: number) {
    if (!this.ctx || !this.vocalGain || this.playbackMode === 'meditation_drone') return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const baseFreq = verse.sectionType === 'chorus' ? 220.00 : 146.83; // D4 for chorus, D3 for verse
    const pitchOffset = (lineIdx % 3) * 2; // subtle melodious progression
    const noteFreq = this.scaleFreqs[4 + pitchOffset] || baseFreq;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(noteFreq, now);

    // Expressive vibrato (5.2 Hz with 8Hz depth)
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(5.2, now);
    vibratoGain.gain.setValueAtTime(4 * (verse.musicalCue.vocalVibrato || 0.6), now);
    vibrato.connect(osc.frequency);
    vibrato.start(now);

    // Formant filter for /a/ and /o/ vowel sounds
    const formantFilter = ctx.createBiquadFilter();
    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(750, now);
    formantFilter.Q.setValueAtTime(4.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12 * this.mixer.leadVocal, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc.connect(formantFilter);
    formantFilter.connect(gain);
    gain.connect(this.vocalGain);

    osc.start(now);
    osc.stop(now + 4.6);
    vibrato.stop(now + 4.6);
  }

  // Ney Flute synthesis with breath noise and microtonal phrasing
  private startNeyMelody(verse: NaatVerse) {
    if (this.neyTimer) clearInterval(this.neyTimer);
    if (!this.ctx || !this.neyGain) return;

    const phraseNotes = [
      [7, 8, 9, 8, 7], // D4 -> Eb4 -> F#4 -> Eb4 -> D4
      [9, 10, 11, 10, 9], // F#4 -> G4 -> A4 -> G4 -> F#4
      [11, 12, 13, 11, 9, 7], // A4 -> Bb4 -> C5 -> A4 -> F#4 -> D4
      [7, 6, 7, 9, 7] // Lower ornamental phrase
    ];

    let phraseIdx = 0;
    const tempo = verse.musicalCue.tempo || 60;
    const intervalMs = Math.max(3200, (60000 / tempo) * 4);

    const playNeyPhrase = () => {
      if (!this.isRunning || !this.ctx || !this.neyGain) return;
      const phrase = phraseNotes[phraseIdx % phraseNotes.length];
      phraseIdx++;

      let timeOffset = 0;
      phrase.forEach((noteIdx, i) => {
        const freq = this.scaleFreqs[noteIdx] || 293.66;
        const duration = i === phrase.length - 1 ? 2.0 : 0.7;
        this.playNeyNote(freq, timeOffset, duration, verse.musicalCue.vocalVibrato);
        timeOffset += 0.65;
      });
    };

    playNeyPhrase();
    this.neyTimer = window.setInterval(playNeyPhrase, intervalMs);
  }

  private playNeyNote(freq: number, delaySec: number, durationSec: number, vibratoAmount: number = 0.5) {
    if (!this.ctx || !this.neyGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delaySec;

    // Fundamental Flute Tone (Sine + Triangle)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now); // soft 2nd harmonic

    // Vibrato
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(5.8, now);
    vibratoGain.gain.setValueAtTime(3.5 * vibratoAmount, now);
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);
    vibrato.start(now);

    // Breath Noise generator
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * durationSec, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(freq * 1.5, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.neyGain);

    // Flute Note Envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    noteGain.gain.setValueAtTime(0.16, now + durationSec - 0.3);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.neyGain);

    osc1.start(now);
    osc2.start(now);
    noise.start(now);

    osc1.stop(now + durationSec + 0.1);
    osc2.stop(now + durationSec + 0.1);
    vibrato.stop(now + durationSec + 0.1);
    noise.stop(now + durationSec + 0.1);
  }

  // Traditional Daf (Frame Drum) physical synthesis
  private startDafPattern(tempo: number, intensity: number, sectionType: string = 'verse') {
    if (this.dafTimer) clearInterval(this.dafTimer);
    if (!this.ctx || !this.dafGain || intensity <= 0.04) return;

    if (sectionType === 'intro') {
      // Intro: Soft night silence, then ONE soft sacred daf hit after ~4 seconds
      const timeoutId = window.setTimeout(() => {
        if (this.isRunning && !this.isPaused) {
          this.playDafHit('dum', 0.28);
        }
      }, 3800);
      this.dafTimer = timeoutId as unknown as number;
      return;
    }

    if (sectionType === 'outro') {
      // Outro: Solitary, peaceful heartbeat pulse every 2.8 seconds fading away
      const triggerOutroPulse = () => {
        if (!this.isRunning || !this.ctx || !this.dafGain) return;
        this.playDafHit('dum', 0.15);
      };
      triggerOutroPulse();
      this.dafTimer = window.setInterval(triggerOutroPulse, 2800);
      return;
    }

    const beatInterval = (60 / tempo) * 1000;
    let step = 0;

    // Traditional Sufi 6/8 and 4/4 Devotional Rhythm: "Dum - Tak - Tak - Dum - Tak"
    const triggerPattern = () => {
      if (!this.isRunning || !this.ctx || !this.dafGain) return;

      const isDum = step === 0 || step === 4;
      const isTak = step === 2 || step === 3 || step === 6;
      const isSoftGhost = step === 1 || step === 5 || step === 7;

      if (isDum) {
        this.playDafHit('dum', intensity);
      } else if (isTak) {
        this.playDafHit('tak', intensity * 0.85);
      } else if (isSoftGhost && intensity > 0.6) {
        this.playDafHit('ghost', intensity * 0.35);
      }

      step = (step + 1) % 8;
    };

    triggerPattern();
    this.dafTimer = window.setInterval(triggerPattern, beatInterval / 2);
  }

  private playDafHit(type: 'dum' | 'tak' | 'ghost', intensity: number) {
    if (!this.ctx || !this.dafGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (type === 'dum') {
      // Low Deep Resonant Skin Thud
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(88, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.28);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35 * intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.dafGain);

      osc.start(now);
      osc.stop(now + 0.48);
    } else if (type === 'tak') {
      // Crisp Rim Slap with high transient
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      // Noise click
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22 * intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.dafGain);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.16);
      noise.stop(now + 0.16);
    } else {
      // Ghost rim tap
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 * intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.dafGain);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  // Warm Continuous Drone / Tanpura ambience
  private startDrone() {
    if (!this.ctx || !this.droneGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const droneNotes = [73.42, 110.00, 146.83, 220.00]; // D2, A2, D3, A3

    droneNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 3);

      osc.connect(gain);
      gain.connect(this.droneGain!);
      osc.start(now);
      this.activeDroneOscs.push(osc);
    });
  }

  // Cinematic Polyphonic Strings Pad
  private startStrings() {
    if (!this.ctx || !this.stringsGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const chord = [146.83, 185.00, 220.00, 293.66]; // D, F#, A, D (Sacred D major / Maqam Hijaz harmony)

    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(1.5, now);

      // Slow LFO filter swell
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(180, now);
      lfo.connect(filter.frequency);
      lfo.start(now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.stringsGain!);
      osc.start(now);
      this.activePadOscs.push(osc, lfo);
    });
  }

  // Choral Devotional Layer (humming "Ya Rasool Allah / SubhanAllah")
  private triggerChoralHarmony() {
    if (!this.ctx || !this.vocalGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const choirNotes = [220.00, 261.63, 293.66, 369.99]; // A3, C4, D4, F#4

    choirNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const formant = ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.frequency.setValueAtTime(800, now);
      formant.Q.setValueAtTime(3.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 6.0);

      osc.connect(formant);
      formant.connect(gain);
      gain.connect(this.vocalGain!);
      osc.start(now);
      osc.stop(now + 6.2);
    });
  }

  private stopAllOscillators() {
    this.activeDroneOscs.forEach(o => {
      try { o.stop(); } catch {}
    });
    this.activePadOscs.forEach(o => {
      try { o.stop(); } catch {}
    });
    this.activeChoirOscs.forEach(o => {
      try { o.stop(); } catch {}
    });
    this.activeDroneOscs = [];
    this.activePadOscs = [];
    this.activeChoirOscs = [];
  }

  // Visualizer Analyser Access
  public getFrequencyData(array: Uint8Array) {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(array);
    }
  }

  public getTimeDomainData(array: Uint8Array) {
    if (this.analyserNode) {
      this.analyserNode.getByteTimeDomainData(array);
    }
  }

  // Update Mixer Settings
  public updateMixer(settings: Partial<MixerSettings>) {
    this.mixer = { ...this.mixer, ...settings };
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.masterGain && settings.masterVolume !== undefined) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : settings.masterVolume, now, 0.1);
    }
    if (this.vocalGain && settings.leadVocal !== undefined) {
      this.vocalGain.gain.setTargetAtTime(settings.leadVocal, now, 0.1);
    }
    if (this.neyGain && settings.neyFlute !== undefined) {
      this.neyGain.gain.setTargetAtTime(settings.neyFlute, now, 0.1);
    }
    if (this.dafGain && settings.dafDrums !== undefined) {
      this.dafGain.gain.setTargetAtTime(settings.dafDrums, now, 0.1);
    }
    if (this.stringsGain && settings.cinematicStrings !== undefined) {
      this.stringsGain.gain.setTargetAtTime(settings.cinematicStrings, now, 0.1);
    }
    if (this.droneGain && settings.salawatDrone !== undefined) {
      this.droneGain.gain.setTargetAtTime(settings.salawatDrone, now, 0.1);
    }
    if (this.reverbGain && settings.reverbDepth !== undefined) {
      this.reverbGain.gain.setTargetAtTime(settings.reverbDepth, now, 0.1);
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.mixer.masterVolume, this.ctx.currentTime, 0.1);
    }
    this.notify();
  }

  public setPlaybackMode(mode: PlaybackMode, currentVerse?: NaatVerse) {
    this.playbackMode = mode;
    if (currentVerse) {
      this.applyVerseMusicalCues(currentVerse);
    }
    this.notify();
  }
}

export interface AudioEngineState {
  isPlaying: boolean;
  isPaused: boolean;
  currentVerseIndex: number;
  currentLineIndex: number;
  verseProgressSeconds: number;
  playbackMode: PlaybackMode;
  mixer: MixerSettings;
  isMuted: boolean;
}

export const sacredAudio = new SacredAudioEngine();
