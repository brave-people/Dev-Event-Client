import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type PopupProps = {
  message: string;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
};

type SuccessPopup = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  message: string;
  ms?: number;
};

const Popup = ({ message, setShowPopup }: PopupProps) => {
  if (!message) return null;

  return (
    <div className="list__button--pop--right bg-blue-500">
      <button onClick={() => setShowPopup(false)}>
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

const SuccessPopup = ({ show, setShow, message, ms = 2000 }: SuccessPopup) => {
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return <Popup message={message} setShowPopup={setShow} />;
};

export default SuccessPopup;
