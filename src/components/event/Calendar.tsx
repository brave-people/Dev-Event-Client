import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import type { CalendarProps } from '../../model/Calendar';
import { getEventsApi } from '../../pages/api/events';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarHtml, setCalendarHtml] = useState('');
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { status, isError, data, refetch } = useQuery(
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
        if (weekIndex === 0 && dayIndex < getFirstDate.getDay()) {
          returnHtml += `<div class='admin__calendar--day'><span>${
            getPrevLastDate.getDate() - (getFirstDate.getDay() - 1) + dayIndex
          }</span><span></span></div>`;
        } else if (weekIndex > 0 && firstDateCount <= getLastDate.getDate()) {
          returnHtml += `<div class='admin__calendar--day'><span>${convertNumberAddTen(
            firstDateCount++
          )}</span></div>`;
        } else if (firstDateCount > getLastDate.getDate()) {
          returnHtml += `<div class='admin__calendar--day'><span>${convertNumberAddTen(
            lastDateCount++
          )}</span></div>`;
        }
      }
    }

    return returnHtml;
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

  console.log('result: ', status, isError, data);

  useEffect(() => {
    const today = new Date();
    if (!currentDate) setCurrentDate(today);
  }, []);

  useEffect(() => {
    if (currentDate) {
      setCalendarHtml(
        createCalendar({
          year,
          month,
        })
      );
    }
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
      <button type="button">TODAY</button>
      <div
        className="admin__calendar"
        dangerouslySetInnerHTML={{ __html: calendarHtml }}
      />
    </div>
  );
};

export default Calendar;
