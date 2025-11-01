import { Link } from 'react-router-dom';
import { Play, Users, Clock } from 'lucide-react';
import { imagesAPI } from '../services/api';
import { triggerAd } from '../utils/adTrigger';

interface MatchCardProps {
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
  homeBadge?: string;
  awayBadge?: string;
}

const MatchCard = ({
  id,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  sport,
  league,
  time,
  isLive = false,
  viewers,
  homeBadge,
  awayBadge,
}: MatchCardProps) => {
  return (
    <Link to={`/watch/${id}`} className="group" onClick={triggerAd}>
      <div className="bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-300 hover:scale-105">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">{sport}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">{league}</span>
          </div>
          {isLive && (
            <div className="flex items-center space-x-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs text-red-500 font-semibold uppercase">Live</span>
            </div>
          )}
        </div>

        {/* Match Info */}
        <div className="p-6">
          {awayTeam ? (
            // Two teams layout
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 text-center">
                {homeBadge && (
                  <img
                    src={imagesAPI.getBadgeUrl(homeBadge)}
                    alt={homeTeam}
                    className="w-12 h-12 object-contain mx-auto mb-2"
                  />
                )}
                <div className="text-lg font-semibold text-white mb-1">{homeTeam}</div>
                {homeScore !== undefined && (
                  <div className="text-3xl font-bold text-blue-400">{homeScore}</div>
                )}
              </div>
              
              <div className="px-4">
                <div className="text-2xl font-bold text-gray-500">VS</div>
              </div>
              
              <div className="flex-1 text-center">
                {awayBadge && (
                  <img
                    src={imagesAPI.getBadgeUrl(awayBadge)}
                    alt={awayTeam}
                    className="w-12 h-12 object-contain mx-auto mb-2"
                  />
                )}
                <div className="text-lg font-semibold text-white mb-1">{awayTeam}</div>
                {awayScore !== undefined && (
                  <div className="text-3xl font-bold text-blue-400">{awayScore}</div>
                )}
              </div>
            </div>
          ) : (
            // Single event layout
            <div className="mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-white leading-tight">{homeTeam}</div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            {viewers && (
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>{viewers.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-blue-400 font-semibold group-hover:text-blue-300">
              <Play className="w-4 h-4" fill="currentColor" />
              <span>Watch</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;

