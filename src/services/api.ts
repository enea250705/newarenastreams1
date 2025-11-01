import { APIMatch, Stream, Sport, Match } from '../types';

const API_BASE_URL = 'https://streamed.pk/api';

// Helper function to check if match is live (within 3 hours of start time)
const isMatchLive = (matchDate: number): boolean => {
  const now = Date.now();
  const matchTime = matchDate;
  const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  
  return now >= matchTime && now <= matchTime + threeHours;
};

// Helper function to format match time
const formatMatchTime = (matchDate: number, isLive: boolean): string => {
  const date = new Date(matchDate);
  const now = new Date();
  
  if (isLive) {
    // Return a mock time for live matches
    return `${Math.floor(Math.random() * 90)}'`;
  }
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const matchDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (matchDay.getTime() === today.getTime()) {
    return `Today ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (matchDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
};

// Transform API match to UI match format
const transformMatch = (apiMatch: APIMatch): Match => {
  const isLive = isMatchLive(apiMatch.date);
  
  // Parse team names from title or teams object
  let homeTeam = 'Team A';
  let awayTeam = 'Team B';
  
  if (apiMatch.teams?.home?.name && apiMatch.teams?.away?.name) {
    // Use teams object if available
    homeTeam = apiMatch.teams.home.name;
    awayTeam = apiMatch.teams.away.name;
  } else {
    // Try to parse from title
    const title = apiMatch.title;
    
    if (title.includes(' vs ')) {
      const parts = title.split(' vs ');
      homeTeam = parts[0]?.trim() || homeTeam;
      awayTeam = parts[1]?.trim() || awayTeam;
    } else if (title.includes(' - ') && !title.includes(':')) {
      // Handle "Player A - Player B" format (common in tennis)
      const parts = title.split(' - ');
      if (parts.length === 2) {
        homeTeam = parts[0]?.trim() || homeTeam;
        awayTeam = parts[1]?.trim() || awayTeam;
      } else {
        // Single event without clear teams
        homeTeam = title;
        awayTeam = '';
      }
    } else {
      // Single event without clear teams (like golf tournaments)
      homeTeam = title;
      awayTeam = '';
    }
  }
  
  return {
    id: apiMatch.id,
    homeTeam,
    awayTeam,
    sport: apiMatch.category.charAt(0).toUpperCase() + apiMatch.category.slice(1),
    league: apiMatch.popular ? 'Premier League' : 'League',
    time: formatMatchTime(apiMatch.date, isLive),
    isLive,
    viewers: Math.floor(Math.random() * 15000) + 2000, // Random viewers between 2k-17k
    poster: apiMatch.poster,
    homeBadge: apiMatch.teams?.home?.badge,
    awayBadge: apiMatch.teams?.away?.badge,
    sources: apiMatch.sources,
    date: apiMatch.date,
  };
};

export const sportsAPI = {
  // Get all sports
  getAllSports: async (): Promise<Sport[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports`);
      if (!response.ok) throw new Error('Failed to fetch sports');
      return response.json();
    } catch (error) {
      console.error('Error fetching sports:', error);
      return [];
    }
  },
};

export const matchesAPI = {
  // Get all matches
  getAllMatches: async (): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/all`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data: APIMatch[] = await response.json();
      return data.map(transformMatch);
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },

  // Get live matches
  getLiveMatches: async (): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/live`);
      if (!response.ok) throw new Error('Failed to fetch live matches');
      const data: APIMatch[] = await response.json();
      return data.map(transformMatch);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return [];
    }
  },

  // Get today's matches
  getTodayMatches: async (): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/all-today`);
      if (!response.ok) throw new Error('Failed to fetch today\'s matches');
      const data: APIMatch[] = await response.json();
      return data.map(transformMatch);
    } catch (error) {
      console.error('Error fetching today\'s matches:', error);
      return [];
    }
  },

  // Get matches by sport
  getMatchesBySport: async (sport: string): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${sport.toLowerCase()}`);
      if (!response.ok) throw new Error(`Failed to fetch ${sport} matches`);
      const data: APIMatch[] = await response.json();
      return data.map(transformMatch);
    } catch (error) {
      console.error(`Error fetching ${sport} matches:`, error);
      return [];
    }
  },

  // Get match by ID (from all matches)
  getMatchById: async (id: string): Promise<Match | null> => {
    try {
      const matches = await matchesAPI.getAllMatches();
      return matches.find(match => match.id === id) || null;
    } catch (error) {
      console.error('Error fetching match by ID:', error);
      return null;
    }
  },
};

export const streamsAPI = {
  // Get streams for a match source
  getStreams: async (source: string, id: string): Promise<Stream[]> => {
    try {
      const url = `${API_BASE_URL}/stream/${source}/${id}`;
      console.log(`Requesting streams from: ${url}`);
      
      const response = await fetch(url);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`Stream API returned ${response.status}: ${response.statusText}`);
        throw new Error(`Failed to fetch streams: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} streams:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching streams from ${source}/${id}:`, error);
      return [];
    }
  },
};

export const imagesAPI = {
  // Get team badge URL
  getBadgeUrl: (badgeId: string): string => {
    return `${API_BASE_URL}/images/badge/${badgeId}.webp`;
  },

  // Get match poster URL
  getPosterUrl: (homeBadge: string, awayBadge: string): string => {
    return `${API_BASE_URL}/images/poster/${homeBadge}/${awayBadge}.webp`;
  },

  // Get proxied image URL
  getProxyUrl: (posterId: string): string => {
    return `${API_BASE_URL}/images/proxy/${posterId}.webp`;
  },
};

