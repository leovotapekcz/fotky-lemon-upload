
export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  creator?: string;
  source: "youtube" | "spotify";
  votes: {
    accepted: string[];
    rejected: string[];
  };
}
