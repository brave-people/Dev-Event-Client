import { useState } from 'react';
import type { EventErrorForm } from '../../model/Event';

export const useErrorContext = ({
  title,
  organizer,
  eventLink,
  replayLink = '',
  tags,
}: EventErrorForm<string>) => {
  const [formErrors, setFormErrors] = useState<EventErrorForm<boolean>>({
    title: false,
    organizer: false,
    eventLink: false,
    replayLink: false,
    tags: false,
  });

  const validateForm = () =>
    setFormErrors({
      title: !title,
      organizer: !organizer,
      eventLink: !eventLink,
      replayLink: !replayLink,
      tags: !tags.length,
    });

  return { formErrors, validateForm };
};

const ErrorContext = ({
  errorMessage = '필수 입력값 입니다',
}: {
  errorMessage?: string;
}) => {
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
      {errorMessage}
    </p>
  );
};

export default ErrorContext;
