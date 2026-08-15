import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export async function generateMoodPlaylist(mood: string): Promise<string[]> {
  if (!GEMINI_API_KEY || !YOUTUBE_API_KEY) {
    throw new Error('API keys for Gemini or YouTube are missing. Please add them to your .env file.');
  }
  if (!ai) {
    throw new Error('Gemini API client not initialized.');
  }

  try {
    // 1. Get Naat titles from Gemini
    const prompt = `I am building an Islamic Naat experience app. The user has selected the mood/event: "${mood}". 
Please suggest 5 famous, high-quality, authentic Naats or Manqabats that perfectly match this occasion or mood. 
Return ONLY a JSON array of strings containing the titles and the reciter's name if known. Do not use markdown blocks, just the JSON array.
Example: ["Naat Title 1 by Reciter A", "Naat Title 2"]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawText = response.text || "[]";
    // Clean up potential markdown formatting from Gemini
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let titles: string[] = [];
    try {
      titles = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", rawText);
      throw new Error('Failed to understand AI response.');
    }

    if (!Array.isArray(titles) || titles.length === 0) {
      throw new Error('AI returned an empty list.');
    }

    // 2. Fetch YouTube Video IDs for each title
    const videoIds: string[] = [];
    
    for (const title of titles) {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(title + ' naat audio')}&type=video&key=${YOUTUBE_API_KEY}`;
      
      const res = await fetch(searchUrl);
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        videoIds.push(data.items[0].id.videoId);
      }
    }

    if (videoIds.length === 0) {
      throw new Error('Could not find videos on YouTube for the suggested Naats.');
    }

    return videoIds;

  } catch (error: any) {
    console.error('Error generating mood playlist:', error);
    throw new Error(error.message || 'Failed to generate playlist.');
  }
}
