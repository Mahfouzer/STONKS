import React from 'react';

interface LoadingSpinnerProps {
  message?: string; // Optional prop for custom loading message
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading stocks..." }) => {
  return (
    <div className="text-center p-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
