import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Clock, Share2, Heart, MessageCircle } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { matchesAPI, streamsAPI, imagesAPI } from '../services/api';
import { Match, Stream } from '../types';
import { triggerAd } from '../utils/adTrigger';

const WatchStream = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const fetchMatchAndStreams = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get match details
      const matchData = await matchesAPI.getMatchById(id);
      
      if (!matchData) {
        setError('Match not found');
        return;
      }
      
      setMatch(matchData);
      
      console.log('Match data:', matchData);
      console.log('Available sources:', matchData.sources);
      
      // Try to get streams from all available sources
      if (matchData.sources && matchData.sources.length > 0) {
        let allStreams: Stream[] = [];
        
        // Try each source and collect all streams
        for (const source of matchData.sources) {
          try {
            console.log(`Fetching streams from source: ${source.source}, id: ${source.id}`);
            const streamsData = await streamsAPI.getStreams(source.source, source.id);
            console.log(`Found ${streamsData.length} streams from ${source.source}`);
            allStreams = [...allStreams, ...streamsData];
          } catch (sourceError) {
            console.warn(`Failed to fetch from source ${source.source}:`, sourceError);
            // Continue to next source
          }
        }
        
        if (allStreams.length > 0) {
          console.log(`Total streams available: ${allStreams.length}`);
          setStreams(allStreams);
        } else {
          console.warn('No streams found from any source');
          setError('No streams available for this match at the moment.');
        }
      } else {
        console.warn('No sources available for this match');
        setError('No stream sources available for this match.');
      }
      
    } catch (err) {
      setError('Failed to load match details. Please try again.');
      console.error('Error fetching match and streams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchAndStreams();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: match ? `${match.homeTeam} vs ${match.awayTeam}` : 'Watch Match',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Here you would send the message to your chat system
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !match) return <ErrorMessage message={error || 'Match not found'} onRetry={fetchMatchAndStreams} />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative">
              <VideoPlayer 
                streams={streams} 
                matchTitle={match.awayTeam ? `${match.homeTeam} vs ${match.awayTeam}` : match.homeTeam} 
              />
              
              {/* Live Badge Overlay */}
              {match.isLive && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-white text-xs font-bold uppercase">Live</span>
                  </div>
                </div>
              )}

              {/* Viewers Count Overlay */}
              {match.viewers && (
                <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">
                    {match.viewers.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Match Info */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    {match.sport} • {match.league}
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    {match.awayTeam ? `${match.homeTeam} vs ${match.awayTeam}` : match.homeTeam}
                  </h1>
                </div>
                {match.isLive && match.time && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{match.time}</span>
                  </div>
                )}
              </div>

              {/* Team Badges or Event Info */}
              {match.awayTeam ? (
                // Two teams layout
                (match.homeBadge || match.awayBadge) && (
                  <div className="flex items-center justify-center space-x-8 py-6 border-t border-b border-slate-700">
                    {match.homeBadge && (
                      <div className="text-center">
                        <img
                          src={imagesAPI.getBadgeUrl(match.homeBadge)}
                          alt={match.homeTeam}
                          className="w-20 h-20 object-contain mx-auto mb-2"
                        />
                        <div className="text-lg font-semibold text-white">{match.homeTeam}</div>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-gray-500">VS</div>
                    {match.awayBadge && (
                      <div className="text-center">
                        <img
                          src={imagesAPI.getBadgeUrl(match.awayBadge)}
                          alt={match.awayTeam}
                          className="w-20 h-20 object-contain mx-auto mb-2"
                        />
                        <div className="text-lg font-semibold text-white">{match.awayTeam}</div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                // Single event layout
                <div className="py-6 border-t border-b border-slate-700">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Event</p>
                    <h3 className="text-xl font-semibold text-white">{match.homeTeam}</h3>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Chat */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-700 px-4 py-3 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Live Chat</h3>
              </div>
              <div className="p-4 h-96 overflow-y-auto space-y-4">
                {/* Mock chat messages */}
                {[
                  { user: 'SportsFan', message: 'Great match! 🔥', time: '2m ago' },
                  { user: 'JohnDoe', message: 'Amazing quality stream!', time: '3m ago' },
                  { user: 'MatchLover', message: 'Let\'s go!', time: '5m ago' },
                  { user: 'GameWatcher', message: 'This is intense!', time: '7m ago' },
                  { user: 'FanGirl', message: 'Best stream ever!', time: '10m ago' },
                ].map((msg, idx) => (
                  <div key={idx} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {msg.user[0]}
                      </div>
                      <span className="text-sm font-semibold text-white">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 ml-10">{msg.message}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchStream;
