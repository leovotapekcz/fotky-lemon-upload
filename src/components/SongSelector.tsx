
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Search, Youtube, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchSongs } from "@/services/songService";
import { Song } from "@/types/song";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Available platforms options
const PLATFORMS = ["youtube", "spotify", "soundcloud", "bandcamp", "other"];

export default function SongSelector() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [submittedSongs, setSubmittedSongs] = useState<Song[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("youtube");
  const [customPlatform, setCustomPlatform] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!searchQuery.trim()) {
      toast({
        title: t("error"),
        description: t("enterSongTitle"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a new song object
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: searchQuery,
      artist: "",
      thumbnail: `https://picsum.photos/seed/${searchQuery.replace(/\s+/g, '')}${Math.floor(Math.random() * 100)}/200/200`,
      creator: creatorName.trim() || t("unknownCreator"),
      source: selectedPlatform === "other" ? customPlatform || "custom" : selectedPlatform,
      votes: { accepted: [], rejected: [] },
      comments: commentText.trim() ? [
        {
          text: commentText,
          author: userName.trim() || t("anonymousUser"),
          timestamp: Date.now()
        }
      ] : []
    };
    
    setTimeout(() => {
      setSubmittedSongs(prev => [newSong, ...prev]);
      setSearchQuery("");
      setCreatorName("");
      setCommentText("");
      setIsSubmitting(false);
      
      toast({
        title: t("songAdded"),
        description: `${newSong.title}`,
      });
    }, 300);
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

  const addComment = (songId: string) => {
    if (!commentText.trim()) return;
    
    setSubmittedSongs(prev => 
      prev.map(song => {
        if (song.id === songId) {
          const newComment = {
            text: commentText,
            author: userName.trim() || t("anonymousUser"),
            timestamp: Date.now()
          };
          
          return {
            ...song,
            comments: [...(song.comments || []), newComment]
          };
        }
        return song;
      })
    );
    
    setCommentText("");
    toast({
      title: t("commentAdded"),
      description: t("commentAddedDescription"),
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h3 className="text-2xl font-medium mb-4 text-center text-gray-700 dark:text-gray-300">
        {t("chooseSong")}
      </h3>

      {/* Song creation form */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow mb-8">
        <div className="space-y-4">
          {/* Song title input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("songTitle")}
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("enterSongTitle")}
              className="w-full"
            />
          </div>
          
          {/* Platform selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("platform")}
            </label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectPlatform")} />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Custom platform input (shows only when "other" is selected) */}
          {selectedPlatform === "other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("customPlatform")}
              </label>
              <Input
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder={t("enterCustomPlatform")}
                className="w-full"
              />
            </div>
          )}
          
          {/* Creator input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("creator")}
            </label>
            <Input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder={t("enterCreator")}
              className="w-full"
            />
          </div>
          
          {/* User name for comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("yourName")}
            </label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t("enterYourName")}
              className="w-full"
            />
          </div>
          
          {/* Comment textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("comment")}
            </label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("enterComment")}
              className="w-full min-h-[80px]"
            />
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !searchQuery.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                  {t("submitting")}
                </span>
              ) : t("submit")}
            </Button>
          </div>
        </div>
      </div>

      {/* Submitted songs list */}
      {submittedSongs.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-medium mb-3">{submittedSongs.length > 1 ? `${submittedSongs.length} ${t("songs")}` : `1 ${t("song")}`}</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {submittedSongs.map((song) => {
              const acceptCount = song.votes.accepted.length;
              const rejectCount = song.votes.rejected.length;
              const userId = "current-user"; // In a real app, get actual user ID
              const userAccepted = song.votes.accepted.includes(userId);
              const userRejected = song.votes.rejected.includes(userId);
              
              return (
                <div
                  key={song.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-transparent hover:border-l-purple-500 transition-all duration-300"
                >
                  <div className="flex items-center p-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        src={song.thumbnail} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/200/200';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{song.title}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                          {song.source.charAt(0).toUpperCase() + song.source.slice(1)}
                        </span>
                        <span>{song.creator}</span>
                      </div>
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
                  
                  {/* Comments section */}
                  {(song.comments && song.comments.length > 0) && (
                    <div className="px-4 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700 mt-1">
                      <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t("comments")}</h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {song.comments.map((comment, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add comment form */}
                  <div className="px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={t("addComment")}
                        className="flex-grow text-sm"
                      />
                      <Button 
                        size="sm"
                        onClick={() => addComment(song.id)}
                        disabled={!commentText.trim()}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        {t("post")}
                      </Button>
                    </div>
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
