import { useState } from 'react';
import type {
  EventErrorFormProps,
  EventErrorFormModel,
} from '../../../model/Event';

export const useErrorContext = ({
  title,
  organizer,
  eventLink,
  tags,
}: EventErrorFormProps) => {
  const [error, setError] = useState<EventErrorFormModel>({
    title: false,
    organizer: false,
    eventLink: false,
    tags: false,
  });

  const validateForm = () => {
    setError((prevState) => ({ ...prevState, title: !title }));
    setError((prevState) => ({ ...prevState, organizer: !organizer }));
    setError((prevState) => ({ ...prevState, eventLink: !eventLink }));
    setError((prevState) => ({ ...prevState, tags: !tags.length }));
  };

  return { error, validateForm };
};

const ErrorContext = () => {
  return (
    <p className="form__content--error">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      필수 입력값입니다
    </p>
  );
};

export default ErrorContext;
