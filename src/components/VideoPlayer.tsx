import { useState, useEffect } from 'react';
import { Stream } from '../types';
import { Play, Tv } from 'lucide-react';
import { triggerAd } from '../utils/adTrigger';

interface VideoPlayerProps {
  streams: Stream[];
  matchTitle: string;
}

const VideoPlayer = ({ streams, matchTitle }: VideoPlayerProps) => {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [selectedServer, setSelectedServer] = useState(1);

  // Generate 10 servers - use available streams or repeat them
  const servers = Array.from({ length: 10 }, (_, i) => {
    const streamIndex = i % streams.length;
    return streams[streamIndex] || null;
  });

  useEffect(() => {
    // Auto-select first available stream
    if (streams.length > 0) {
      setSelectedStream(streams[0]);
      setSelectedServer(1);
    }
  }, [streams]);

  const handleServerSelect = (serverNum: number) => {
    // Update state first
    setSelectedServer(serverNum);
    const stream = servers[serverNum - 1];
    if (stream) {
      setSelectedStream(stream);
    }
    
    // Trigger ad after state update (non-blocking)
    setTimeout(() => triggerAd(), 0);
  };

  if (streams.length === 0) {
    return (
      <div className="space-y-4">
        {/* Server Selector - Disabled State */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Tv className="w-5 h-5 text-gray-400" />
            <h3 className="text-white font-semibold">Streaming Servers</h3>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i + 1}
                disabled
                className="px-4 py-3 bg-slate-700 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Player */}
        <div className="bg-black rounded-xl aspect-video flex items-center justify-center">
          <div className="text-center px-6">
            <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No streams available for this match</p>
            <p className="text-gray-600 text-sm">Please try refreshing the page or check back later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Server Selector */}
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Tv className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Streaming Servers</h3>
          {selectedStream?.hd && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
              HD
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: 10 }, (_, i) => {
            const serverNum = i + 1;
            const isAvailable = servers[i] !== null;
            const isSelected = selectedServer === serverNum;
            
            return (
              <button
                key={serverNum}
                onClick={() => isAvailable && handleServerSelect(serverNum)}
                disabled={!isAvailable}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800'
                    : isAvailable
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                    : 'bg-slate-700 text-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {serverNum}
              </button>
            );
          })}
        </div>
        {selectedStream && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Server {selectedServer} • {selectedStream.language} • Stream #{selectedStream.streamNo}
            </span>
            <span className="text-gray-400">
              Quality: {selectedStream.hd ? 'HD 1080p' : 'SD 480p'}
            </span>
          </div>
        )}
        {streams.length > 0 && streams.length < 10 && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            {streams.length} unique stream{streams.length !== 1 ? 's' : ''} available (cycling through servers)
          </div>
        )}
      </div>

      {/* Video Player */}
      <div className="bg-black rounded-xl overflow-hidden aspect-video">
        {selectedStream ? (
          <>
            {console.log('Loading stream:', selectedStream.embedUrl, 'Server:', selectedServer)}
            <iframe
              key={`server-${selectedServer}-${selectedStream.id}`}
              src={selectedStream.embedUrl}
              title={`${matchTitle} - Server ${selectedServer}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a server to watch</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
