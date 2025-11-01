const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="mt-4 text-center">
          <p className="text-gray-400">Loading matches...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

