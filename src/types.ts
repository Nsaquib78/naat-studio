/**
 * Types and Interfaces for Madinah Ki Tamanna - Sacred Islamic Naat Experience
 */

export interface NaatVerse {
  id: string;
  verseNumber: number;
  sectionType: 'intro' | 'verse' | 'pre_chorus' | 'chorus' | 'bridge' | 'outro';
  sectionTitle: string;
  timeRange: string;
  urdu: string[];
  roman: string[];
  english: string[];
  spiritualContext: string;
  hadithOrTafseerRef?: string;
  emotionalStage: 'Longing' | 'Remembrance' | 'Tears & Repentance' | 'Hope & Mercy' | 'Deep Love' | 'Spiritual Elevation' | 'Peace & Contentment';
  musicalCue: {
    tempo: number; // BPM (68–78 BPM devotional pacing)
    dafIntensity: number; // 0 to 1
    stringSwell: number; // 0 to 1
    neyPresence: number; // 0 to 1
    vocalVibrato: number; // 0 to 1
    choralLayer: boolean;
    description: string;
  };
  durationSeconds: number;
}

export interface NaatDetails {
  titleUrdu: string;
  titleEnglish: string;
  subtitle: string;
  poet: string;
  vocalStyle: string;
  musicalDirection: string;
  overallTheme: string;
  totalDurationSeconds: number;
  verses: NaatVerse[];
}

export type PlaybackMode = 'full_cinematic' | 'acoustic_daf_ney' | 'sacred_acapella' | 'meditation_drone' | 'vocal_recitation';

export interface MixerSettings {
  masterVolume: number;
  leadVocal: number;
  neyFlute: number;
  dafDrums: number;
  cinematicStrings: number;
  ambientPad: number;
  reverbDepth: number;
  salawatDrone: number;
}

export interface DuaGenerationRequest {
  userName?: string;
  emotionalState: string;
  personalPrayerTopic: string;
  languageTone: 'classical_urdu' | 'simple_emotional' | 'urdu_with_english';
}

export interface GeneratedDuaKalam {
  title: string;
  urduVerses: string[];
  romanVerses: string[];
  englishTranslation: string[];
  spiritualMeaning: string;
  recommendedSalawat: string;
}

export interface BookmarkItem {
  id: string;
  verseId: string;
  verseTitle: string;
  urduSnippet: string;
  timestamp: number;
  userNotes?: string;
}
