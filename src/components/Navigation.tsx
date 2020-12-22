import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { setShowMonth, activeMonth } from "../slices/month";
import { MonthModel } from "../models/month";

type NavigationProps = {
  list: string[];
};

function Navigation(props: NavigationProps) {
  const { date } = useSelector<ReducerType>(state => state.month) as MonthModel;
  const dispatch = useDispatch();
  let [show, showMonth] = useState(false);
  const startDate = new Date('2020-09-01');
  const monthArr: string[] = []
  for (let i = startDate.getMonth() + 1; i <= 12; i++) {
    monthArr.push(`${ startDate.getFullYear() }-${ i < 10 ? '0' + i : i }`)
  }
  monthArr.push('2021-01');
  monthArr.push('2021-02');

  // 최초 날짜 설정
  if (!date) {
    const currentDate = `${ new Date().getFullYear() }-${ Number(new Date().getMonth() + 1) }`
    setCurrentMonth(currentDate);
  }

  function clickShowMonth() {
    showMonth(!show);
    dispatch(setShowMonth(!show));
  }

  function setCurrentMonth(date) {
    // currentDate =`${new Date().getFullYear()}-${Number(new Date().getMonth() + 1)}`;
    // setActiveMonth(date);
    dispatch(activeMonth(date))
  }

  document.addEventListener('click', e => {
    const target = e.target as HTMLTextAreaElement;
    if (!target.parentElement!.id.includes('nav') && showMonth) {
      // showMonth(false);
      // dispatch(setShowMonth(false));
    }
  })

  return (
    <nav className={ 'nav' }>
      <div id={ 'nav' } className={ 'nav__box' } onClick={ () => clickShowMonth() }>
        <span>{ new Date().getMonth() + 1 }월</span>
      </div>
      <NavLink to="/Dev-Event-Client" exact={ true } activeClassName={ 'nav__text--active' } className={ 'nav__text' }>
        EVENT
      </NavLink>
      <NavLink to='/Dev-Event-Client/education' exact={ true } activeClassName={ 'nav__text--active' }
               className={ 'nav__text' }>
        Edu
      </NavLink>
      <p className={ 'nav__text' }>Meet</p>
      <p className={ 'nav__text' }>Circles</p>
      <div className={ show ? 'nav--month__box nav--month__box--active' : 'nav--month__box' } id={ 'nav--month' }>
        <div className={ 'nav--month' }>
          <div className={ 'nav--month__title' }>
            <h3>Calendar</h3>
            <p>12 2020</p>
          </div>
          <div className={ 'nav--month__text__box' }>
            { monthArr.map((el, index) => {
              return (
                <div key={ index }
                     className={ date === el ? 'nav--month__text nav--month__text--active' : 'nav--month__text' }
                     onClick={ () => setCurrentMonth(el) }
                >
                  <p>{ el.split('-')[0] }</p>
                  <p>{ el.split('-')[1] }</p>
                </div>
              )
            }) }
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation;
