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
  return <p className="form__content--error">이 칸을 입력해주세요</p>;
};

export default ErrorContext;
