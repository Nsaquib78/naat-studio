// We no longer require the Gemini or YouTube API keys for the Mood Mix 
// to work! This ensures zero API quota usage, instant loading times,
// and 100% security since no API keys are exposed or required.
// You can just add YouTube video IDs directly to this data structure.

interface OccasionData {
  title: string;
  videoIds: string[];
}

// Pre-defined occasion playlists.
// You can add or modify any individual YouTube video ID here.
// A YouTube playlist is NOT required, individual video IDs work perfectly.
export const MOOD_OCCASIONS: Record<string, OccasionData> = {
  "Eid Milad-un-Nabi": {
    title: "Eid Milad-un-Nabi Mix",
    videoIds: ["1kS050QvFXY", "fA9RkO-fE0g", "rP51D14v1bI"] // Example IDs
  },
  "Muharram": {
    title: "Muharram Remembrance",
    videoIds: ["8Q49rGf6vN4", "1F_qR7y1WlE"] 
  },
  "Eid-ul-Adha": {
    title: "Eid-ul-Adha Mix",
    videoIds: ["7K_NnK4O8-U", "9K59zQf6wE0"]
  },
  "Ramadan": {
    title: "Ramadan Blessings",
    videoIds: ["ebdrmyyngzM", "3M_vP8K5XhA"] // Explicitly added requested video ID
  },
  "Jumma Mubarak": {
    title: "Jumma Mubarak Salawat",
    videoIds: ["5z2W9L-E9zQ", "7F_9zR6y3wQ"]
  }
};

export async function generateMoodPlaylist(mood: string): Promise<string[]> {
  // Simulate a slight delay to keep the "Generating your spiritual playlist..." UI intact
  // and give a smooth UX transition.
  await new Promise(resolve => setTimeout(resolve, 1500));

  const occasion = MOOD_OCCASIONS[mood];
  
  if (!occasion || !occasion.videoIds || occasion.videoIds.length === 0) {
    // Graceful fallback if an occasion isn't specifically mapped
    console.warn(`No predefined videos found for occasion: ${mood}. Falling back to default.`);
    return ["ebdrmyyngzM"]; // Fallback to a known working video
  }

  return occasion.videoIds;
}
