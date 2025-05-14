
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Search, Music, ChevronDown, ChevronUp, Music2 } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddingAnimation, setIsAddingAnimation] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  // Load saved username from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem("songSelectorUserName");
    if (savedName) {
      setUserName(savedName);
      setRememberUser(true);
    }
  }, []);

  // Save username when checkbox is checked
  useEffect(() => {
    if (rememberUser && userName) {
      localStorage.setItem("songSelectorUserName", userName);
    } else if (!rememberUser) {
      localStorage.removeItem("songSelectorUserName");
    }
  }, [rememberUser, userName]);

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
    setIsAddingAnimation(true);
    
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
      
      // Add delay before closing form and stopping animation
      setTimeout(() => {
        setIsFormOpen(false);
        setIsAddingAnimation(false);
      }, 500);
    }, 800);
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
          
          // Show toast with vote counts
          const acceptCount = newVotes.accepted.length;
          const rejectCount = newVotes.rejected.length;
          
          toast({
            title: vote === 'accept' ? t("voteAccepted") : t("voteRejected"),
            description: `${t("acceptedVotes")}: ${acceptCount} | ${t("rejectedVotes")}: ${rejectCount}`,
          });
          
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
      <h3 className={cn(
        "text-2xl font-medium mb-4 text-center text-gray-700 dark:text-gray-300",
        "transition-all duration-500 hover:scale-105"
      )}>
        {t("chooseSong")}
      </h3>

      {/* Song creation form - collapsible */}
      <Collapsible
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        className={cn(
          "bg-white dark:bg-gray-800 p-5 rounded-2xl shadow mb-8 transition-all duration-700",
          isFormOpen ? "scale-100 opacity-100" : "scale-98 opacity-95",
          isAddingAnimation ? "animate-pulse shadow-lg shadow-purple-300 dark:shadow-purple-900" : ""
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music2 className={cn(
              "h-5 w-5 text-purple-500 transition-transform",
              isAddingAnimation ? "animate-bounce" : ""
            )} />
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {t("addNewSong")}
            </h4>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0 transition-transform hover:scale-110">
              {isFormOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4 space-y-4" ref={formRef}>
          {/* Song title input */}
          <div className="transition-all duration-300 hover:translate-x-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("songTitle")} <span className="text-red-500">*</span>
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("enterSongTitle")}
              className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Platform selector */}
          <div className="transition-all duration-300 hover:translate-x-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("platform")}
            </label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder={t("selectPlatform")} />
              </SelectTrigger>
              <SelectContent className="animate-fade-in">
                {PLATFORMS.map(platform => (
                  <SelectItem 
                    key={platform} 
                    value={platform}
                    className="transition-all hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Custom platform input (shows only when "other" is selected) */}
          {selectedPlatform === "other" && (
            <div className="transition-all duration-300 hover:translate-x-1 animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("customPlatform")}
              </label>
              <Input
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder={t("enterCustomPlatform")}
                className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
          
          {/* Creator input */}
          <div className="transition-all duration-300 hover:translate-x-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("creator")}
            </label>
            <Input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder={t("enterCreator")}
              className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* User name for comments */}
          <div className="transition-all duration-300 hover:translate-x-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("yourName")}
            </label>
            <div className="space-y-2">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t("enterYourName")}
                className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-name"
                  checked={rememberUser}
                  onChange={(e) => setRememberUser(e.target.checked)}
                  className="rounded text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="remember-name" className="text-xs text-gray-500 dark:text-gray-400">
                  {t("rememberName") || "Remember my name"}
                </label>
              </div>
            </div>
          </div>
          
          {/* Comment textarea */}
          <div className="transition-all duration-300 hover:translate-x-1">
            <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span>{t("comment")}</span>
              <span className="text-xs text-gray-500 italic">{t("optional")}</span>
            </label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("enterComment")}
              className="w-full min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !searchQuery.trim()}
              className={cn(
                "bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6",
                "transition-all duration-300 transform hover:scale-105",
                isSubmitting ? "animate-pulse" : ""
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                  {t("submitting")}
                </span>
              ) : (
                <span className="flex items-center">
                  <Music className={cn(
                    "h-4 w-4 mr-2",
                    "transition-transform",
                    isAddingAnimation ? "animate-bounce" : ""
                  )} />
                  {t("submit")}
                </span>
              )}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Submitted songs list */}
      {submittedSongs.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h4 className="text-xl font-medium mb-3 transition-all duration-300 hover:translate-x-1">
            {submittedSongs.length > 1 ? `${submittedSongs.length} ${t("songs")}` : `1 ${t("song")}`}
          </h4>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {submittedSongs.map((song, index) => {
              const acceptCount = song.votes.accepted.length;
              const rejectCount = song.votes.rejected.length;
              const userId = "current-user"; // In a real app, get actual user ID
              const userAccepted = song.votes.accepted.includes(userId);
              const userRejected = song.votes.rejected.includes(userId);
              
              return (
                <div
                  key={song.id}
                  className={cn(
                    "bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-transparent hover:border-l-purple-500",
                    "transition-all duration-500 hover:translate-x-1 hover:shadow-lg",
                    "animate-fade-in"
                  )}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="flex items-center p-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 mr-3 transition-transform duration-300 hover:scale-110">
                      <img 
                        src={song.thumbnail} 
                        alt={song.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/200/200';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100 transition-all duration-300 hover:translate-x-1">{song.title}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900">
                          {song.source.charAt(0).toUpperCase() + song.source.slice(1)}
                        </span>
                        <span className="transition-all duration-300 hover:text-purple-500">{song.creator}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant={userAccepted ? "default" : "outline"}
                        size="icon"
                        className={cn(
                          "rounded-full h-8 w-8 relative transition-transform duration-300 hover:scale-110",
                          userAccepted ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-100 dark:hover:bg-green-900/30"
                        )}
                        onClick={() => handleVote(song.id, 'accept')}
                      >
                        <Check size={16} className={cn(
                          userAccepted ? "text-white" : "text-green-500",
                          "transition-transform",
                          userAccepted ? "animate-bounce" : ""
                        )} />
                        {acceptCount > 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-xs rounded-full h-4 min-w-4 flex items-center justify-center px-1 transition-all duration-300 hover:bg-green-200">
                            {acceptCount}
                          </span>
                        )}
                      </Button>
                      
                      <Button
                        variant={userRejected ? "default" : "outline"}
                        size="icon"
                        className={cn(
                          "rounded-full h-8 w-8 relative transition-transform duration-300 hover:scale-110",
                          userRejected ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-100 dark:hover:bg-red-900/30"
                        )}
                        onClick={() => handleVote(song.id, 'reject')}
                      >
                        <X size={16} className={cn(
                          userRejected ? "text-white" : "text-red-500",
                          "transition-transform",
                          userRejected ? "animate-bounce" : ""
                        )} />
                        {rejectCount > 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-red-100 text-red-800 text-xs rounded-full h-4 min-w-4 flex items-center justify-center px-1 transition-all duration-300 hover:bg-red-200">
                            {rejectCount}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Comments section */}
                  {(song.comments && song.comments.length > 0) && (
                    <div className="px-4 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700 mt-1">
                      <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:translate-x-1">{t("comments")}</h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {song.comments.map((comment, idx) => (
                          <div 
                            key={idx} 
                            className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-sm transition-all duration-300 hover:translate-x-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
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
                        className="flex-grow text-sm transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                      />
                      <Button 
                        size="sm"
                        onClick={() => addComment(song.id)}
                        disabled={!commentText.trim()}
                        className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 hover:scale-105"
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
