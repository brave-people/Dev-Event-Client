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
    <div className="list__button--pop--right bg-red-500">
      <button onClick={() => setErrorMessage('')}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {errorMessage}
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
