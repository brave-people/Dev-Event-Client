import classNames from 'classnames';
import type { EventTime } from '../../model/Event';

const EventType = ({ eventTimeType, changeEventTimeType }: EventTime) => {
  return (
    <div className="form__content__input">
      <span className="form__content__title inline-block text-base text-gray-600">
        시간 유형
      </span>
      <button
        onClick={(e) => changeEventTimeType(e, 'DATE')}
        className={classNames(
          'border-solid border rounded py-2 px-6 text-sm text-gray-600 mr-2',
          {
            'border-blue-500': eventTimeType === 'DATE',
            'border-gray-300': eventTimeType !== 'DATE',
          }
        )}
      >
        일시
      </button>
      <button
        onClick={(e) => changeEventTimeType(e, 'RECRUIT')}
        className={classNames(
          'border-solid border rounded py-2 px-6 text-sm text-gray-600',
          {
            'border-blue-500': eventTimeType === 'RECRUIT',
            'border-gray-300': eventTimeType !== 'RECRUIT',
          }
        )}
      >
        모집
      </button>
    </div>
  );
};

export default EventType;
