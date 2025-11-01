// API Response Types
export interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular: boolean;
  teams?: {
    home?: {
      name: string;
      badge: string;
    };
    away?: {
      name: string;
      badge: string;
    };
  };
  sources: {
    source: string;
    id: string;
  }[];
}

export interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

export interface Sport {
  id: string;
  name: string;
}

// UI Types (transformed from API)
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  sport: string;
  league: string;
  time: string;
  isLive?: boolean;
  viewers?: number;
  streamUrl?: string;
  poster?: string;
  homeBadge?: string;
  awayBadge?: string;
  sources?: {
    source: string;
    id: string;
  }[];
  date: number;
}

export interface ChatMessage {
  user: string;
  message: string;
  time: string;
}
