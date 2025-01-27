import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface MessageErrorBaseProps {
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

const MessageErrorBase = ({
  errorMessage,
  setErrorMessage,
}: MessageErrorBaseProps) => {
  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!errorMessage) return null;

  return (
    <div className="fixed top-20 right-7 z-50">
      <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out animate-slide-down">
        <div className="flex items-center gap-3 min-w-[240px] max-w-[480px]">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-white flex-1">
            {errorMessage}
          </p>
          <button
            onClick={() => setErrorMessage('')}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const useMessageError = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const MessageError = () => (
    <MessageErrorBase
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  );

  return {
    setErrorMessage,
    MessageError,
  };
};

export default useMessageError;
