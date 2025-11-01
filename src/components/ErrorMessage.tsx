interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-8 text-center max-w-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-red-500 text-lg mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

