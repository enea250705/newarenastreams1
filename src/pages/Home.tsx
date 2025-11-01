import { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';
import LiveBadge from '../components/LiveBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { matchesAPI } from '../services/api';
import { Match } from '../types';
import { triggerAd } from '../utils/adTrigger';

const Home = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch live and today's matches
      const [live, today] = await Promise.all([
        matchesAPI.getLiveMatches(),
        matchesAPI.getTodayMatches(),
      ]);
      
      // Filter to only show matches with team badges (not channels/events)
      const liveWithBadges = live.filter(match => 
        match.homeBadge && match.awayBadge && match.awayTeam
      );
      setLiveMatches(liveWithBadges.slice(0, 6)); // Show first 6 live matches with badges
      
      // Filter upcoming matches (not live) and only those with badges
      const upcomingWithBadges = today.filter(match => 
        !match.isLive && match.homeBadge && match.awayBadge && match.awayTeam
      );
      setUpcomingMatches(upcomingWithBadges.slice(0, 6));
      
    } catch (err) {
      setError('Failed to load matches. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    
    // Note: Popunder ads only work on REAL user clicks
    // The plumprush script in index.html automatically captures all clicks
    // No need for setTimeout - ads fire naturally when users click
  }, []);

  const sports = [
    { 
      name: 'Football', 
      emoji: '⚽', 
      color: 'bg-green-500', 
      path: '/sports/football',
      leagues: 'Premier League, Champions League'
    },
    { 
      name: 'Basketball', 
      emoji: '🏀', 
      color: 'bg-orange-500', 
      path: '/sports/basketball',
      leagues: 'NBA, EuroLeague'
    },
    { 
      name: 'Tennis', 
      emoji: '🎾', 
      color: 'bg-yellow-500', 
      path: '/sports/tennis',
      leagues: 'Grand Slams, ATP, WTA'
    },
    { 
      name: 'UFC/Fight', 
      emoji: '🥊', 
      color: 'bg-red-500', 
      path: '/sports/fight',
      leagues: 'Fights, Championships'
    },
    { 
      name: 'Rugby', 
      emoji: '🏉', 
      color: 'bg-indigo-500', 
      path: '/sports/rugby',
      leagues: 'Six Nations, World Cup'
    },
    { 
      name: 'Baseball', 
      emoji: '⚾', 
      color: 'bg-blue-500', 
      path: '/sports/baseball',
      leagues: 'MLB, World Series'
    },
    { 
      name: 'American Football', 
      emoji: '🏈', 
      color: 'bg-purple-600', 
      path: '/sports/american-football',
      leagues: 'NFL, Super Bowl'
    },
    { 
      name: 'Cricket', 
      emoji: '🏏', 
      color: 'bg-teal-500', 
      path: '/sports/cricket',
      leagues: 'IPL, World Cup'
    },
    { 
      name: 'Motor Sports', 
      emoji: '🏁', 
      color: 'bg-rose-500', 
      path: '/sports/motor-sports',
      leagues: 'F1, MotoGP, NASCAR'
    },
    { 
      name: 'Hockey', 
      emoji: '🏒', 
      color: 'bg-cyan-500', 
      path: '/sports/hockey',
      leagues: 'NHL, Stanley Cup'
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMatches} />;

  // Show total viewers in a more realistic range (50k-150k)
  const totalViewers = Math.floor(Math.random() * 100000) + 50000;

  return (
    <div className="min-h-screen" itemScope itemType="https://schema.org/WebPage">
      {/* Hero Section */}
      <section className="relative gradient-primary py-16 mb-12" itemScope itemType="https://schema.org/WPHeader">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="mb-4">
              <LiveBadge />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Watch Live Sports
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Stream your favorite matches in HD quality. Never miss a moment of the action.
            </p>
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">{liveMatches.length} Live Matches</span>
              </div>
              <div className="text-blue-200">•</div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{totalViewers.toLocaleString()}+ Viewers</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>

      <div className="container mx-auto px-4 space-y-12">
        {/* Sports Categories */}
        <section aria-label="Sports Categories">
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Sport - Live Streaming</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sports.map((sport) => (
              <a
                key={sport.name}
                href={sport.path}
                onClick={triggerAd}
                className="group block"
              >
                <div className="flex flex-col items-center space-y-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all duration-300 hover:scale-105 h-full">
                  <div className={`w-16 h-16 rounded-full ${sport.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{sport.emoji}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white block mb-1">
                      {sport.name}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-2">
                      {sport.leagues}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section aria-label="Live Matches Now" itemScope itemType="https://schema.org/ItemList">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-white">Live Now</h2>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        )}

        {/* Show message if no matches */}
        {liveMatches.length === 0 && upcomingMatches.length === 0 && (
          <section className="text-center py-12">
            <p className="text-gray-400 text-lg">No matches available at the moment.</p>
          </section>
        )}

        {/* Features */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-800 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">HD Quality</h3>
              <p className="text-gray-400">
                Watch all matches in crystal clear HD quality with minimal buffering
              </p>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">All Sports</h3>
              <p className="text-gray-400">
                Access to football, basketball, tennis, and many more sports
              </p>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
                <span className="text-3xl">📡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Updates</h3>
              <p className="text-gray-400">
                Get real-time scores and match updates as they happen
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
