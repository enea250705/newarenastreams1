# API Integration Guide

## 📡 Expected API Endpoints

This document outlines the API structure we're expecting. Once you provide your API documentation, we'll integrate it accordingly.

## 🔗 Suggested Endpoints

### 1. Get All Matches
```
GET /api/matches
```

**Query Parameters:**
- `sport` (optional): Filter by sport (football, basketball, tennis)
- `status` (optional): Filter by status (live, upcoming, finished)
- `league` (optional): Filter by league
- `limit` (optional): Number of results
- `page` (optional): Pagination

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "match_123",
      "homeTeam": "Manchester United",
      "awayTeam": "Liverpool",
      "homeScore": 2,
      "awayScore": 1,
      "sport": "football",
      "league": "Premier League",
      "startTime": "2024-01-15T15:00:00Z",
      "status": "live",
      "currentTime": "45:00",
      "viewers": 45230,
      "streamUrl": "https://stream.example.com/match_123"
    }
  ],
  "total": 100,
  "page": 1
}
```

### 2. Get Live Matches
```
GET /api/matches/live
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "match_123",
      "homeTeam": "Lakers",
      "awayTeam": "Warriors",
      "homeScore": 98,
      "awayScore": 102,
      "sport": "basketball",
      "league": "NBA",
      "quarter": "Q3",
      "currentTime": "5:23",
      "status": "live",
      "viewers": 32100,
      "streamUrl": "https://stream.example.com/match_123"
    }
  ]
}
```

### 3. Get Upcoming Matches
```
GET /api/matches/upcoming
```

**Query Parameters:**
- `sport` (optional): Filter by sport
- `date` (optional): Filter by date
- `limit` (optional): Number of results

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "match_456",
      "homeTeam": "Real Madrid",
      "awayTeam": "Barcelona",
      "sport": "football",
      "league": "La Liga",
      "startTime": "2024-01-16T20:00:00Z",
      "status": "upcoming",
      "expectedViewers": 75000
    }
  ]
}
```

### 4. Get Match by ID
```
GET /api/matches/:id
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "match_123",
    "homeTeam": {
      "name": "Manchester United",
      "logo": "https://example.com/logos/mu.png",
      "score": 2
    },
    "awayTeam": {
      "name": "Liverpool",
      "logo": "https://example.com/logos/liverpool.png",
      "score": 1
    },
    "sport": "football",
    "league": "Premier League",
    "venue": "Old Trafford",
    "startTime": "2024-01-15T15:00:00Z",
    "status": "live",
    "currentTime": "45:00",
    "viewers": 45230,
    "streamUrl": "https://stream.example.com/match_123",
    "streamQuality": ["1080p", "720p", "480p"],
    "chatEnabled": true
  }
}
```

### 5. Get Matches by Sport
```
GET /api/matches/sport/:sport
```

**Parameters:**
- `sport`: football, basketball, tennis, etc.

**Expected Response:**
```json
{
  "success": true,
  "sport": "football",
  "data": {
    "live": [...],
    "upcoming": [...]
  }
}
```

### 6. Search Matches
```
GET /api/matches/search
```

**Query Parameters:**
- `q`: Search query
- `sport` (optional): Filter by sport

**Expected Response:**
```json
{
  "success": true,
  "query": "manchester",
  "results": [...]
}
```

### 7. Get Stream URL (if separate from match data)
```
GET /api/stream/:matchId
```

**Expected Response:**
```json
{
  "success": true,
  "matchId": "match_123",
  "streamUrl": "https://stream.example.com/match_123",
  "formats": [
    {
      "quality": "1080p",
      "url": "https://stream.example.com/match_123/1080p.m3u8"
    },
    {
      "quality": "720p",
      "url": "https://stream.example.com/match_123/720p.m3u8"
    }
  ]
}
```

### 8. Get Live Chat (if available)
```
WebSocket: wss://api.example.com/chat/:matchId
```

**Message Format:**
```json
{
  "type": "message",
  "user": {
    "id": "user_123",
    "username": "SportsFan",
    "avatar": "https://example.com/avatars/user_123.png"
  },
  "message": "Great goal!",
  "timestamp": "2024-01-15T15:30:00Z"
}
```

## 🛠 Integration Steps

### Step 1: Create API Service

Create `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

export const matchAPI = {
  // Get all matches
  getAllMatches: async (params?: {
    sport?: string;
    status?: string;
    limit?: number;
    page?: number;
  }) => {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/matches?${queryString}`);
    return response.json();
  },

  // Get live matches
  getLiveMatches: async () => {
    const response = await fetch(`${API_BASE_URL}/matches/live`);
    return response.json();
  },

  // Get upcoming matches
  getUpcomingMatches: async (sport?: string) => {
    const url = sport 
      ? `${API_BASE_URL}/matches/upcoming?sport=${sport}`
      : `${API_BASE_URL}/matches/upcoming`;
    const response = await fetch(url);
    return response.json();
  },

  // Get match by ID
  getMatchById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`);
    return response.json();
  },

  // Get matches by sport
  getMatchesBySport: async (sport: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/sport/${sport}`);
    return response.json();
  },

  // Search matches
  searchMatches: async (query: string, sport?: string) => {
    const url = sport
      ? `${API_BASE_URL}/matches/search?q=${query}&sport=${sport}`
      : `${API_BASE_URL}/matches/search?q=${query}`;
    const response = await fetch(url);
    return response.json();
  },
};
```

### Step 2: Add Environment Variables

Create `.env`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_WS_URL=wss://your-api-domain.com/ws
```

### Step 3: Update Components

Example update for `Home.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { matchAPI } from '../services/api';
import { Match } from '../types';

const Home = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const [live, upcoming] = await Promise.all([
          matchAPI.getLiveMatches(),
          matchAPI.getUpcomingMatches(),
        ]);
        setLiveMatches(live.data);
        setUpcomingMatches(upcoming.data);
      } catch (err) {
        setError('Failed to load matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    // ... rest of component
  );
};
```

### Step 4: Add Loading & Error States

Create `src/components/LoadingSpinner.tsx`:

```typescript
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
```

Create `src/components/ErrorMessage.tsx`:

```typescript
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-6 text-center">
      <p className="text-red-500 text-lg">{message}</p>
    </div>
  </div>
);
```

## 🎥 Video Player Integration

### Option 1: HLS.js (for .m3u8 streams)

Install:
```bash
npm install hls.js
npm install --save-dev @types/hls.js
```

Create `src/components/VideoPlayer.tsx`:

```typescript
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  streamUrl: string;
  autoplay?: boolean;
}

const VideoPlayer = ({ streamUrl, autoplay = true }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoplay) {
          videoRef.current?.play();
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      videoRef.current.src = streamUrl;
      if (autoplay) {
        videoRef.current.play();
      }
    }
  }, [streamUrl, autoplay]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      controls
      playsInline
    />
  );
};

export default VideoPlayer;
```

### Option 2: Video.js

Install:
```bash
npm install video.js
npm install --save-dev @types/video.js
```

### Option 3: React Player (supports multiple formats)

Install:
```bash
npm install react-player
```

Usage:
```typescript
import ReactPlayer from 'react-player';

<ReactPlayer
  url={streamUrl}
  playing={true}
  controls={true}
  width="100%"
  height="100%"
/>
```

## 🔄 Real-Time Updates

### WebSocket Integration for Live Updates

Create `src/services/websocket.ts`:

```typescript
export class MatchWebSocket {
  private ws: WebSocket | null = null;
  private matchId: string;
  
  constructor(matchId: string) {
    this.matchId = matchId;
  }

  connect(onMessage: (data: any) => void) {
    const wsUrl = import.meta.env.VITE_WS_URL;
    this.ws = new WebSocket(`${wsUrl}/match/${this.matchId}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
```

## 📝 TypeScript Types Update

Update `src/types/index.ts` based on actual API response:

```typescript
export interface Match {
  id: string;
  homeTeam: string | Team;  // Depending on API structure
  awayTeam: string | Team;
  homeScore?: number;
  awayScore?: number;
  sport: string;
  league: string;
  startTime: string;  // ISO date string
  currentTime?: string;
  status: 'live' | 'upcoming' | 'finished';
  viewers?: number;
  streamUrl?: string;
}

export interface Team {
  name: string;
  logo?: string;
  score?: number;
}
```

## 🚦 Next Steps

1. **Share your API documentation** - I'll review the endpoints
2. **API key/authentication** - Let me know if authentication is needed
3. **Stream format** - Tell me the video format (HLS, DASH, MP4, etc.)
4. **Real-time features** - Confirm if WebSocket support is available
5. **Rate limiting** - Any rate limits I should consider?
6. **CORS** - Ensure API has CORS configured for your domain

Once you provide the API documentation, I'll:
- ✅ Create the API service layer
- ✅ Update all components with real data
- ✅ Integrate the video player
- ✅ Add error handling
- ✅ Implement loading states
- ✅ Set up real-time updates (if available)
- ✅ Add authentication (if needed)

---

**Ready to integrate! Send me your API documentation.** 📡

