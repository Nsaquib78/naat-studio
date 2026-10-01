export async function generateMoodPlaylist(mood: string): Promise<string[]> {
  try {
    // Call our secure backend API endpoint
    // The backend uses YOUTUBE_API_KEY from environment variables and caches results
    const res = await fetch(`/api/youtube/mood-mix?mood=${encodeURIComponent(mood)}`);
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    
    if (data.videoIds && Array.isArray(data.videoIds) && data.videoIds.length > 0) {
      return data.videoIds;
    }
    
    throw new Error('Empty response from API');
  } catch (error) {
    console.warn(`Failed to fetch mood mix from API for ${mood}. Using fallback. Error:`, error);
    
    // Ultimate fallback if the backend completely fails or isn't running
    const FALLBACKS: Record<string, string[]> = {
      "Eid Milad-un-Nabi": ["1kS050QvFXY", "fA9RkO-fE0g"],
      "Muharram": ["8Q49rGf6vN4"],
      "Eid-ul-Adha": ["7K_NnK4O8-U"],
      "Eid-ul-Fitr": ["7K_NnK4O8-U"],
      "Ramadan": ["ebdrmyyngzM"],
      "Jumma Mubarak": ["5z2W9L-E9zQ"]
    };
    
    return FALLBACKS[mood] || ["ebdrmyyngzM"];
  }
}
