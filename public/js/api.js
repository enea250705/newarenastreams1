// API Base URL
const API_BASE = 'https://streamed.pk/api';

// API Functions
const API = {
    // Fetch live matches
    async getLiveMatches() {
        try {
            const response = await fetch(`${API_BASE}/matches/live`);
            if (!response.ok) throw new Error('Failed to fetch live matches');
            const data = await response.json();
            return data.map(this.transformMatch);
        } catch (error) {
            console.error('Error fetching live matches:', error);
            return [];
        }
    },
    
    // Fetch today's matches
    async getTodayMatches() {
        try {
            const response = await fetch(`${API_BASE}/matches/all-today`);
            if (!response.ok) throw new Error('Failed to fetch today matches');
            const data = await response.json();
            return data.map(this.transformMatch);
        } catch (error) {
            console.error('Error fetching today matches:', error);
            return [];
        }
    },
    
    // Fetch all matches
    async getAllMatches() {
        try {
            const response = await fetch(`${API_BASE}/matches/all`);
            if (!response.ok) throw new Error('Failed to fetch all matches');
            const data = await response.json();
            return data.map(this.transformMatch);
        } catch (error) {
            console.error('Error fetching all matches:', error);
            return [];
        }
    },
    
    // Fetch matches by sport
    async getMatchesBySport(sport) {
        try {
            const response = await fetch(`${API_BASE}/matches/${sport}`);
            if (!response.ok) throw new Error(`Failed to fetch ${sport} matches`);
            const data = await response.json();
            return data.map(this.transformMatch);
        } catch (error) {
            console.error(`Error fetching ${sport} matches:`, error);
            return [];
        }
    },
    
    // Fetch match by ID
    async getMatchById(id) {
        try {
            const allMatches = await this.getAllMatches();
            return allMatches.find(m => m.id === id);
        } catch (error) {
            console.error('Error fetching match by ID:', error);
            return null;
        }
    },
    
    // Fetch streams for a match
    async getStreams(source, id) {
        try {
            const response = await fetch(`${API_BASE}/stream/${source}/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch streams from ${source}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching streams from ${source}:`, error);
            return [];
        }
    },
    
    // Get badge URL
    getBadgeUrl(badge) {
        return `${API_BASE}/images/badge/${badge}.webp`;
    },
    
    // Transform API match to app format
    transformMatch(apiMatch) {
        let homeTeam = '';
        let awayTeam = '';
        
        // Try to get teams from teams object
        if (apiMatch.teams) {
            homeTeam = apiMatch.teams.home?.name || '';
            awayTeam = apiMatch.teams.away?.name || '';
        }
        
        // If not available, parse from title
        if (!homeTeam && apiMatch.title) {
            if (apiMatch.title.includes(' vs ') || apiMatch.title.includes(' VS ')) {
                const parts = apiMatch.title.split(/\s+vs\s+|\s+VS\s+/i);
                homeTeam = parts[0]?.trim() || '';
                awayTeam = parts[1]?.trim() || '';
            } else if (apiMatch.title.includes(' - ')) {
                const parts = apiMatch.title.split(' - ');
                homeTeam = parts[0]?.trim() || '';
                awayTeam = parts[1]?.trim() || '';
            } else {
                homeTeam = apiMatch.title;
            }
        }
        
        return {
            id: apiMatch.id,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            sport: apiMatch.category || 'Unknown',
            league: 'Live',
            time: new Date(apiMatch.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            isLive: true,
            viewers: Math.floor(Math.random() * 15000) + 2000,
            homeBadge: apiMatch.teams?.home?.badge || '',
            awayBadge: apiMatch.teams?.away?.badge || '',
            sources: apiMatch.sources || []
        };
    }
};

// Sports configuration
const SPORTS = [
    { 
        id: 'football',
        name: 'Football', 
        emoji: '⚽', 
        color: 'bg-green-500', 
        page: 'football.html',
        leagues: 'Premier League, Champions League'
    },
    { 
        id: 'basketball',
        name: 'Basketball', 
        emoji: '🏀', 
        color: 'bg-orange-500', 
        page: 'basketball.html',
        leagues: 'NBA, EuroLeague'
    },
    { 
        id: 'tennis',
        name: 'Tennis', 
        emoji: '🎾', 
        color: 'bg-yellow-500', 
        page: 'tennis.html',
        leagues: 'Grand Slams, ATP, WTA'
    },
    { 
        id: 'fight',
        name: 'UFC/Fight', 
        emoji: '🥊', 
        color: 'bg-red-500', 
        page: 'fight.html',
        leagues: 'Fights, Championships'
    },
    { 
        id: 'rugby',
        name: 'Rugby', 
        emoji: '🏉', 
        color: 'bg-indigo-500', 
        page: 'rugby.html',
        leagues: 'Six Nations, World Cup'
    },
    { 
        id: 'baseball',
        name: 'Baseball', 
        emoji: '⚾', 
        color: 'bg-blue-500', 
        page: 'baseball.html',
        leagues: 'MLB, World Series'
    },
    { 
        id: 'american-football',
        name: 'American Football', 
        emoji: '🏈', 
        color: 'bg-purple-600', 
        page: 'american-football.html',
        leagues: 'NFL, Super Bowl'
    },
    { 
        id: 'cricket',
        name: 'Cricket', 
        emoji: '🏏', 
        color: 'bg-teal-500', 
        page: 'cricket.html',
        leagues: 'IPL, World Cup'
    },
    { 
        id: 'motor-sports',
        name: 'Motor Sports', 
        emoji: '🏁', 
        color: 'bg-pink-500', 
        page: 'motor-sports.html',
        leagues: 'F1, MotoGP, NASCAR'
    },
    { 
        id: 'hockey',
        name: 'Hockey', 
        emoji: '🏒', 
        color: 'bg-cyan-500', 
        page: 'hockey.html',
        leagues: 'NHL, Stanley Cup'
    }
];

