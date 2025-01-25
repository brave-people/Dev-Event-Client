import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type PopupProps = {
  message: string;
  setShowPopup: Dispatch<
    SetStateAction<{ showSuccessPopup: boolean; successPopupMessage: string }>
  >;
};

type SuccessPopup = {
  show: boolean;
  setShow: Dispatch<
    SetStateAction<{ showSuccessPopup: boolean; successPopupMessage: string }>
  >;
  message: string;
  ms?: number;
};

const Popup = ({ message, setShowPopup }: PopupProps) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out animate-slide-up">
        <div className="flex items-center gap-3 min-w-[240px] max-w-[480px]">
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-white flex-1">
            {message}
          </p>
          <button
            onClick={() => setShowPopup({ showSuccessPopup: false, successPopupMessage: '' })}
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

const SuccessPopup = ({ show, setShow, message, ms = 2000 }: SuccessPopup) => {
  useEffect(() => {
    const timer = setTimeout(
      () => setShow({ showSuccessPopup: false, successPopupMessage: '' }),
      ms
    );
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return <Popup message={message} setShowPopup={setShow} />;
};

export default SuccessPopup;
