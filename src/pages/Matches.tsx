import { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Filter } from 'lucide-react';
import { matchesAPI, sportsAPI } from '../services/api';
import { Match, Sport } from '../types';
import { triggerAd } from '../utils/adTrigger';

const Matches = () => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [matchesData, sportsData] = await Promise.all([
        matchesAPI.getAllMatches(),
        sportsAPI.getAllSports(),
      ]);
      
      setAllMatches(matchesData);
      setSports(sportsData);
    } catch (err) {
      setError('Failed to load matches. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMatches = allMatches.filter((match) => {
    const sportMatch = selectedSport === 'all' || match.sport.toLowerCase() === selectedSport.toLowerCase();
    const statusMatch =
      selectedStatus === 'all' ||
      (selectedStatus === 'live' && match.isLive) ||
      (selectedStatus === 'upcoming' && !match.isLive);
    return sportMatch && statusMatch;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">All Matches</h1>
          <p className="text-gray-400">Browse and watch all available sports streams</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8 bg-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sport Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sport</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSport('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSport === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                {sports.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => setSelectedSport(sport.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSport === sport.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {sport.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'live', 'upcoming'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredMatches.length}</span> matches
          </p>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No matches found with the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
