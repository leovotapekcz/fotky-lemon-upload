
export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  creator?: string;
  source: string;
  votes: {
    accepted: string[];
    rejected: string[];
  };
  comments?: {
    text: string;
    author: string;
    timestamp: number;
  }[];
}
