const LiveBadge = () => {
  return (
    <div className="inline-flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <span className="text-white text-xs font-bold uppercase tracking-wide">Live Now</span>
    </div>
  );
};

export default LiveBadge;

