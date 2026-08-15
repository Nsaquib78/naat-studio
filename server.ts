import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google GenAI client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // API 1: Generate Personalized Spiritual Naat / Dua Kalam
  app.post('/api/gemini/generate-dua-kalam', async (req, res) => {
    try {
      const { userName, emotionalState, personalPrayerTopic, languageTone } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback spiritual generated response if key not set
        return res.json({
          title: 'مناجاتِ شوق و مغفرت | Supplication of Yearning',
          urduVerses: [
            'تیرے کرم کی آس پر دل بے قرار ہے',
            'مدینے کی گلیوں کا سدا انتظار ہے',
            'اے رحمتِ تمامؐ! سن لو مری صدا',
            'تیرے سوا جہاں میں کون غم گسار ہے'
          ],
          romanVerses: [
            'Tere karam ki aas par dil be-qarar hai',
            'Madine ki galiyon ka sada intezar hai',
            'Aye Rehmat-e-Tamaam ﷺ! Sun lo meri sada',
            'Tere siwa jahan mein kaun gham-gusaar hai'
          ],
          englishTranslation: [
            'Resting upon the hope of your grace, my heart remains restless,',
            'Forever yearning for the illuminated streets of Madinah.',
            'O Embodiment of Universal Mercy ﷺ! Hear my humble cry,',
            'For who else in this entire world is the soother of broken souls but you?'
          ],
          spiritualMeaning: 'A sincere prayer expressing complete reliance on the mercy of the Prophet ﷺ and seeking solace in Madinah.',
          recommendedSalawat: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ وَبَارِكْ وَسَلِّمْ'
        });
      }

      const prompt = `You are a master Islamic devotional poet and scholar of classical Urdu Naat poetry (like Imam Ahmad Raza Khan, Allama Iqbal, Hafeez Taib, Bedam Shah Warsi).
Generate a deeply emotional, respectful, spiritually uplifting 4-line Naat / Dua Kalam tailored specifically to this seeker's heart:
Seeker Context:
- Emotional State: ${emotionalState || 'Deep yearning and repentance'}
- Personal Supplication / Heart's desire: ${personalPrayerTopic || 'Longing to visit Madinah and seek peace'}
- Tone: ${languageTone || 'Classical Urdu with profound spiritual humility'}

Requirements:
- Authentic classical Urdu meter (Behr), rich spiritual vocabulary (Rehmat, Taybah, Roza-e-Aqdas, Karam, Ashk, Durood).
- Must include:
  1. A title for the Kalam
  2. 4 lines of authentic Urdu poetry in Arabic/Nastaliq script
  3. 4 lines of precise Roman Urdu transliteration
  4. 4 lines of elegant poetic English translation
  5. A brief spiritual commentary (Ruhani Paigham) explaining the blessing of this dua
  6. A recommended Salawat (Durood Sharif) for the seeker to recite.

Strictly adhere to the JSON schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              urduVerses: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              romanVerses: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              englishTranslation: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              spiritualMeaning: { type: Type.STRING },
              recommendedSalawat: { type: Type.STRING }
            },
            required: ['title', 'urduVerses', 'romanVerses', 'englishTranslation', 'spiritualMeaning', 'recommendedSalawat']
          }
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (err: unknown) {
      console.error('Error generating dua kalam:', err);
      res.status(500).json({
        error: 'Failed to generate devotional Kalam',
        message: err instanceof Error ? err.message : String(err)
      });
    }
  });

  // API 2: Deep Spiritual Reflection & Kalam Commentary
  app.post('/api/gemini/spiritual-reflection', async (req, res) => {
    try {
      const { verseUrdu, verseRoman, sectionTitle } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          reflection: `This sacred verse reflects the profound spiritual state of 'Ishq-e-Rasool ﷺ' (Love for the Messenger of Allah). In Islamic spiritual tradition, Madinah al-Munawwarah is not merely a geographic destination, but the spiritual sanctuary of the soul. Visiting the Rawdah Mubarak softens the hardened heart and invokes Divine Sakinah (tranquility).`,
          hadithReference: 'The Prophet ﷺ said: "Whoever visits my grave after my death, it is as if he visited me while I was alive." (Bayhaqi)',
          heartBenefit: 'Removes anxiety, brings tears of sincere repentance, and purifies the spiritual heart (Qalb).'
        });
      }

      const prompt = `Provide a deeply inspiring, scholarly, and spiritually uplifting commentary (Tashreeh / Ruhani Sharah) on this sacred Islamic Naat verse:
Verse Title: ${sectionTitle}
Urdu: ${Array.isArray(verseUrdu) ? verseUrdu.join('\n') : verseUrdu}
Roman Urdu: ${Array.isArray(verseRoman) ? verseRoman.join('\n') : verseRoman}

Explain:
1. The inner spiritual mystery (Batin) and emotional depth of this verse.
2. Authentic Hadith or Quranic theme connecting to longing for Madinah and love for Prophet Muhammad ﷺ.
3. How contemplating this line benefits a troubled or seeking heart.

Respond in structured JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reflection: { type: Type.STRING },
              hadithReference: { type: Type.STRING },
              heartBenefit: { type: Type.STRING }
            },
            required: ['reflection', 'hadithReference', 'heartBenefit']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err: unknown) {
      console.error('Error generating spiritual reflection:', err);
      res.status(500).json({
        error: 'Failed to generate reflection',
        message: err instanceof Error ? err.message : String(err)
      });
    }
  });

  // API 3: Text-to-Speech Recitation via Gemini TTS
  app.post('/api/gemini/tts-recite', async (req, res) => {
    try {
      const { text, voice } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured for TTS preview' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Recite slowly, with deep devotion, reverence, and soft emotional tone: ${text}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Charon' }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audioBase64: base64Audio, sampleRate: 24000 });
      } else {
        res.status(500).json({ error: 'No audio returned from model' });
      }
    } catch (err: unknown) {
      console.error('Error in TTS recitation:', err);
      res.status(500).json({
        error: 'Failed to generate TTS recitation',
        message: err instanceof Error ? err.message : String(err)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Madinah Ki Tamanna Naat Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
