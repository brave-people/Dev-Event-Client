import { useEffect, useState } from 'react';

interface createCalendarProps {
  year: number;
  month: number;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>();
  const [calendarHtml, setCalendarHtml] = useState('');
  const convertNumberAddTen = (number: number) => {
    return number < 10 ? '0' + number : number;
  };

  const createCalendar = ({ year, month }: createCalendarProps) => {
    let returnHtml = '';

    const getFirstDate = new Date(year, month, 1);
    const getLastDate = new Date(year, month + 1, 0);
    const getPrevLastDate = new Date(year, month, 0);

    let firstDateCount = 1;
    let lastDateCount = 1;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < getFirstDate.getDay()) {
          returnHtml += `<div class='admin__calendar--day'><span>${
            getPrevLastDate.getDate() - (getFirstDate.getDay() - 1) + j
          }</span><span></span></div>`;
        } else if (i > 0 && firstDateCount <= getLastDate.getDate()) {
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
    }
  };

  const changeNextMonth = () => {
    if (currentDate) {
      const newDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      );
      setCurrentDate(newDate);
    }
  };

  useEffect(() => {
    const today = new Date();
    if (!currentDate) setCurrentDate(today);
  }, []);

  useEffect(() => {
    if (currentDate) {
      setCalendarHtml(
        createCalendar({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth(),
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
      <button onClick={changePrevMonth}>prev</button>
      <button onClick={changeNextMonth}>next</button>
      <div
        className="admin__calendar"
        dangerouslySetInnerHTML={{ __html: calendarHtml }}
      />
    </div>
  );
};

export default Calendar;
