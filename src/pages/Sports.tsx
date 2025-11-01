import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { matchesAPI } from '../services/api';
import { Match } from '../types';
import { triggerAd } from '../utils/adTrigger';

const Sports = () => {
  const { sport } = useParams<{ sport: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!sport) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await matchesAPI.getMatchesBySport(sport);
      setMatches(data);
    } catch (err) {
      setError(`Failed to load ${sport} matches. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [sport]);

  const sportConfig: { [key: string]: { name: string; emoji: string; color: string } } = {
    football: {
      name: 'Football',
      emoji: '⚽',
      color: 'bg-green-500',
    },
    basketball: {
      name: 'Basketball',
      emoji: '🏀',
      color: 'bg-orange-500',
    },
    tennis: {
      name: 'Tennis',
      emoji: '🎾',
      color: 'bg-yellow-500',
    },
    fight: {
      name: 'UFC / Fight',
      emoji: '🥊',
      color: 'bg-red-500',
    },
    rugby: {
      name: 'Rugby',
      emoji: '🏉',
      color: 'bg-indigo-500',
    },
    baseball: {
      name: 'Baseball',
      emoji: '⚾',
      color: 'bg-blue-500',
    },
    'american-football': {
      name: 'American Football',
      emoji: '🏈',
      color: 'bg-purple-600',
    },
    cricket: {
      name: 'Cricket',
      emoji: '🏏',
      color: 'bg-teal-500',
    },
    'motor-sports': {
      name: 'Motor Sports',
      emoji: '🏁',
      color: 'bg-rose-500',
    },
    hockey: {
      name: 'Hockey',
      emoji: '🏒',
      color: 'bg-cyan-500',
    },
  };

  const currentSport = sportConfig[sport || 'football'] || {
    name: sport?.charAt(0).toUpperCase() + sport?.slice(1) || 'Sport',
    emoji: '⚽',
    color: 'bg-blue-500',
  };
  const liveMatches = matches.filter(m => m.isLive);
  const upcomingMatches = matches.filter(m => !m.isLive);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMatches} />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className={`${currentSport.color} py-16 mb-8`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-5xl">{currentSport.emoji}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{currentSport.name}</h1>
              <p className="text-white text-opacity-90">
                {matches.length} matches available
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-2xl font-bold text-white">Live Now</h2>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
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
          <section className="pb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        )}

        {/* No matches message */}
        {matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No {currentSport.name.toLowerCase()} matches available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sports;
