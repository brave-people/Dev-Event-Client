import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface MessageBaseProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

const MessageBase = ({ message, setMessage }: MessageBaseProps) => {
  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!message) return null;

  return (
    <div className="list__button--pop--right bg-blue-500">
      <button onClick={() => setMessage('')}>
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {message}
    </div>
  );
};

const useMessage = () => {
  const [message, setMessage] = useState('');
  const Message = () => (
    <MessageBase message={message} setMessage={setMessage} />
  );

  return {
    setMessage,
    Message,
  };
};

export default useMessage;
