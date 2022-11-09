import { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import type { CalendarProps } from '../../../model/Calendar';
import { getEventsApi } from '../../../pages/api/events';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarHtml, setCalendarHtml] = useState('');
  const [lastWeekIndex, setLastWeekIndex] = useState(6);

  const calendarRef = useRef<HTMLDivElement>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { refetch } = useQuery(
    ['fetchEvents', { year, month }],
    async () => await getEventsApi({ year, month: month + 1 }),
    { refetchOnWindowFocus: false }
  );

  const convertNumberAddTen = (number: number) => {
    return number < 10 ? '0' + number : number;
  };

  const createCalendar = ({ year, month }: CalendarProps) => {
    let returnHtml = '';

    const getFirstDate = new Date(year, month, 1);
    const getLastDate = new Date(year, month + 1, 0);
    const getPrevLastDate = new Date(year, month, 0);

    let firstDateCount = 1;
    let lastDateCount = 1;

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        if (weekIndex === lastWeekIndex) break;
        if (weekIndex === 0 && dayIndex < getFirstDate.getDay()) {
          returnHtml += `<div class='calendar__box'><span>${
            getPrevLastDate.getDate() - (getFirstDate.getDay() - 1) + dayIndex
          }</span><span></span></div>`;
        } else if (firstDateCount <= getLastDate.getDate()) {
          if (weekIndex <= lastWeekIndex) {
            returnHtml += `<div class='calendar__box'><span>${convertNumberAddTen(
              firstDateCount++
            )}</span></div>`;
          }
        }
      }

      setLastWeekIndex(weekIndex - 1);
    }

    const lastWeek = firstDateCount > getLastDate.getDate();
    let dayIndex = getLastDate.getDay() + 1;
    while (lastWeek && dayIndex < 7) {
      returnHtml += `<div class='calendar__box'><span>${convertNumberAddTen(
        lastDateCount
      )}</span></div>`;

      dayIndex++;
      lastDateCount++;
    }

    return returnHtml;
  };

  const initMonth = () => {
    const today = new Date();
    setCurrentDate(today);
    refetch();
  };

  const changePrevMonth = () => {
    if (currentDate) {
      const newDate = new Date(
        currentDate.setMonth(currentDate.getMonth() - 1)
      );
      setCurrentDate(newDate);
      refetch();
    }
  };

  const changeNextMonth = () => {
    if (currentDate) {
      const newDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      );
      setCurrentDate(newDate);
      refetch();
    }
  };

  useEffect(() => {
    if (!currentDate) initMonth();
  }, []);

  useEffect(() => {
    setCalendarHtml(
      createCalendar({
        year,
        month,
      })
    );
  }, [currentDate]);

  return (
    <div>
      {currentDate && (
        <div>
          <span>{currentDate.getFullYear()}.</span>
          <span>{convertNumberAddTen(currentDate.getMonth() + 1)}</span>
        </div>
      )}
      <button type="button" onClick={changePrevMonth}>
        prev
      </button>
      <button type="button" onClick={changeNextMonth}>
        next
      </button>
      <button type="button" onClick={initMonth}>
        TODAY
      </button>
      <div ref={calendarRef} className="calendar__wrap">
        <div
          className="calendar"
          dangerouslySetInnerHTML={{ __html: calendarHtml }}
        />
      </div>
    </div>
  );
};

export default Calendar;
