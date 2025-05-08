
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Search, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { youtube } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  source: "youtube" | "spotify";
  votes: {
    accepted: string[];
    rejected: string[];
  };
}

export default function SongSelector() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [submittedSongs, setSubmittedSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to search YouTube
  const searchYouTube = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // YouTube Data API v3 key would normally go here
      // This is a mock implementation since we can't store API keys in the frontend
      // In production, this would be a server-side API call
      
      console.log("Searching YouTube for:", query);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate YouTube-like results
      const youtubeResults: Song[] = [];
      for (let i = 1; i <= 5; i++) {
        youtubeResults.push({
          id: `yt-${i}-${Date.now()}`,
          title: `${query} - ${i === 1 ? "Official Video" : `Cover ${i}`}`,
          artist: `Artist ${String.fromCharCode(64 + i)}`,
          thumbnail: `https://picsum.photos/seed/${query}${i}/200/200`,
          source: "youtube",
          votes: { accepted: [], rejected: [] }
        });
      }
      
      // Generate Spotify-like results
      const spotifyResults: Song[] = [];
      for (let i = 1; i <= 3; i++) {
        spotifyResults.push({
          id: `sp-${i}-${Date.now()}`,
          title: `${query} ${i === 1 ? "Radio" : `Mix ${i}`}`,
          artist: `DJ ${String.fromCharCode(64 + i)}`,
          thumbnail: `https://picsum.photos/seed/spot${query}${i}/200/200`,
          source: "spotify",
          votes: { accepted: [], rejected: [] }
        });
      }
      
      setSearchResults([...youtubeResults, ...spotifyResults]);
    } catch (error) {
      console.error("YouTube search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search YouTube. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = () => {
    if (selectedSong) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        setSubmittedSongs(prev => [selectedSong, ...prev]);
        setSelectedSong(null);
        setSearchQuery("");
        setSearchResults([]);
        setIsSubmitting(false);
        
        toast({
          title: t("songAdded"),
          description: `${selectedSong.title} by ${selectedSong.artist}`,
        });
      }, 300);
    }
  };

  const handleVote = (songId: string, vote: 'accept' | 'reject') => {
    // In a real app, you would send this to your backend
    setSubmittedSongs(prev => 
      prev.map(song => {
        if (song.id === songId) {
          const userId = "current-user"; // In a real app, get actual user ID
          
          // Remove from opposite vote list if present
          const oppositeType = vote === 'accept' ? 'rejected' : 'accepted';
          const oppositePreviouslyVoted = song.votes[oppositeType].includes(userId);
          
          let newVotes = {...song.votes};
          
          if (oppositePreviouslyVoted) {
            newVotes[oppositeType] = newVotes[oppositeType].filter(id => id !== userId);
          }
          
          // Toggle current vote
          if (song.votes[`${vote}ed`].includes(userId)) {
            newVotes[`${vote}ed`] = newVotes[`${vote}ed`].filter(id => id !== userId);
          } else {
            newVotes[`${vote}ed`] = [...newVotes[`${vote}ed`], userId];
          }
          
          return {...song, votes: newVotes};
        }
        return song;
      })
    );
  };

  // Handle search when query changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchYouTube(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h3 className="text-2xl font-medium mb-4 text-center text-gray-700 dark:text-gray-300">
        {t("chooseSong")}
      </h3>

      <div className="relative">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
            className={`pl-10 pr-4 py-3 text-lg transition-all duration-300 border-2 rounded-full ${
              selectedSong ? "border-purple-500" : ""
            }`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {searchResults.length > 0 && !selectedSong && (
          <div 
            ref={resultsContainerRef}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
          >
            {isSearching ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent mr-2"></div>
                <p>Searching...</p>
              </div>
            ) : (
              searchResults.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedSong(song)}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 mr-3">
                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{song.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      {song.source === "youtube" ? (
                        <>
                          <youtube className="w-4 h-4 mr-1 text-red-500" /> YouTube
                        </>
                      ) : (
                        "Spotify"
                      )} • {song.artist}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {selectedSong && (
        <div 
          className={`mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-700 flex items-start transition-all duration-500 animate-fade-in ${
            isSubmitting ? "opacity-50 scale-95" : ""
          }`}
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 mr-4">
            <img src={selectedSong.thumbnail} alt={selectedSong.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">{selectedSong.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSong.artist}</p>
            <p className="text-xs mt-1">
              {selectedSong.source === "youtube" ? (
                <span className="flex items-center text-red-500"><youtube className="w-3 h-3 mr-1" /> YouTube</span>
              ) : (
                <span className="text-green-500">Spotify</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedSong(null)}
              className="rounded-full h-8 w-8"
            >
              <X size={16} />
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full"
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      )}

      {/* Submitted songs list */}
      {submittedSongs.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-medium mb-3">{submittedSongs.length > 1 ? `${submittedSongs.length} Songs` : "1 Song"}</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {submittedSongs.map((song) => {
              const acceptCount = song.votes.accepted.length;
              const rejectCount = song.votes.rejected.length;
              const userId = "current-user"; // In a real app, get actual user ID
              const userAccepted = song.votes.accepted.includes(userId);
              const userRejected = song.votes.rejected.includes(userId);
              
              return (
                <div
                  key={song.id}
                  className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-transparent hover:border-l-purple-500 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 mr-3">
                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={userAccepted ? "default" : "outline"}
                      size="icon"
                      className={`rounded-full h-8 w-8 ${
                        userAccepted ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-100 dark:hover:bg-green-900/30"
                      }`}
                      onClick={() => handleVote(song.id, 'accept')}
                    >
                      <Check size={16} className={userAccepted ? "text-white" : "text-green-500"} />
                      {acceptCount > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {acceptCount}
                        </span>
                      )}
                    </Button>
                    
                    <Button
                      variant={userRejected ? "default" : "outline"}
                      size="icon"
                      className={`rounded-full h-8 w-8 ${
                        userRejected ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-100 dark:hover:bg-red-900/30"
                      }`}
                      onClick={() => handleVote(song.id, 'reject')}
                    >
                      <X size={16} className={userRejected ? "text-white" : "text-red-500"} />
                      {rejectCount > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-red-100 text-red-800 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {rejectCount}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

