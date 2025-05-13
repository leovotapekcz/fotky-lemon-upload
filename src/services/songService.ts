
import { Song } from "@/types/song";

// Function to create a YouTube search URL with the API key and query
const buildYouTubeSearchUrl = (query: string) => {
  // In a real production environment, this would be a server-side API call
  // For demo purposes, we'll simulate the API response
  return `https://youtube-api-proxy.example.com/search?q=${encodeURIComponent(query)}`;
};

// Function to create a Spotify search URL
const buildSpotifySearchUrl = (query: string) => {
  return `https://spotify-api-proxy.example.com/search?q=${encodeURIComponent(query)}`;
};

// Generate more natural song names
const generateYouTubeSongs = (query: string): Song[] => {
  const youtubeCreators = [
    "VEVO", "MusicChannel", "TopHits", "MusicStudio", "SongCloud"
  ];
  
  const youtubeArtists = [
    "The Weeknd", "Dua Lipa", "Post Malone", "Billie Eilish", "Adele"
  ];
  
  return Array(5).fill(null).map((_, i) => ({
    id: `yt-${i}-${Date.now()}`,
    title: `${query}`,
    artist: youtubeArtists[i % youtubeArtists.length],
    creator: youtubeCreators[i % youtubeCreators.length],
    thumbnail: `https://picsum.photos/seed/${query.replace(/\s+/g, '')}${i}/200/200`,
    source: "youtube",
    votes: { accepted: [], rejected: [] }
  }));
};

const generateSpotifySongs = (query: string): Song[] => {
  const spotifyCreators = [
    "Spotify", "TopPlaylists", "MusicMix", "WeeklyHits", "TrendingNow"
  ];
  
  const spotifyArtists = [
    "Drake", "Taylor Swift", "Ariana Grande", "Ed Sheeran", "Bad Bunny"
  ];
  
  return Array(3).fill(null).map((_, i) => ({
    id: `sp-${i}-${Date.now()}`,
    title: `${query}`,
    artist: spotifyArtists[i % spotifyArtists.length],
    creator: spotifyCreators[i % spotifyCreators.length],
    thumbnail: `https://picsum.photos/seed/spot${query.replace(/\s+/g, '')}${i}/200/200`,
    source: "spotify",
    votes: { accepted: [], rejected: [] }
  }));
};

// Function to search for songs on YouTube and Spotify
export async function searchSongs(query: string, language: string, platform?: string): Promise<Song[]> {
  console.log(`Searching for "${query}" in ${language}${platform ? `, platform: ${platform}` : ''}`);
  
  try {
    // Since we can't use real API keys in the frontend, we'll simulate the API calls
    // In production, you would make actual API calls to YouTube and Spotify
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate results based on selected platform or both if no platform specified
    let results: Song[] = [];
    
    if (!platform || platform === 'youtube') {
      results = [...results, ...generateYouTubeSongs(query)];
    }
    
    if (!platform || platform === 'spotify') {
      results = [...results, ...generateSpotifySongs(query)];
    }
    
    return results;
  } catch (error) {
    console.error("Error searching for songs:", error);
    throw new Error("Failed to search for songs");
  }
}
