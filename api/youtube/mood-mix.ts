// Vercel Serverless Function
export const config = {
  runtime: 'edge',
};

const MOOD_FALLBACKS: Record<string, string[]> = {
  "Eid Milad-un-Nabi": ["1kS050QvFXY", "fA9RkO-fE0g", "rP51D14v1bI"],
  "Muharram": ["8Q49rGf6vN4", "1F_qR7y1WlE"],
  "Eid-ul-Adha": ["7K_NnK4O8-U", "9K59zQf6wE0"],
  "Eid-ul-Fitr": ["7K_NnK4O8-U"],
  "Ramadan": ["ebdrmyyngzM", "3M_vP8K5XhA"],
  "Jumma Mubarak": ["5z2W9L-E9zQ", "7F_9zR6y3wQ"]
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const mood = url.searchParams.get('mood');
  
  if (!mood) {
    return new Response(JSON.stringify({ error: 'Mood query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const fallbackIds = MOOD_FALLBACKS[mood] || MOOD_FALLBACKS["Ramadan"];
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEY) {
    return new Response(JSON.stringify({ videoIds: fallbackIds, source: 'fallback' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(mood + ' naat audio')}&type=video&key=${YOUTUBE_API_KEY}`;
    const ytRes = await fetch(searchUrl);
    
    if (!ytRes.ok) {
      return new Response(JSON.stringify({ videoIds: fallbackIds, source: 'fallback_error' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await ytRes.json();
    if (!data.items || data.items.length === 0) {
      return new Response(JSON.stringify({ videoIds: fallbackIds, source: 'fallback_empty' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const videoIds = data.items.map((item: any) => item.id.videoId);
    
    if (mood === "Ramadan" && !videoIds.includes("ebdrmyyngzM")) {
      videoIds.unshift("ebdrmyyngzM");
    }

    return new Response(JSON.stringify({ videoIds, source: 'api' }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        // Cache this edge response to heavily save YouTube API quota
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ videoIds: fallbackIds, source: 'fallback_catch' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
