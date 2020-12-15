import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { activeMonth } from "../slices/month";

type NavigationProps = {
  list: string[];
};

function Navigation(props: NavigationProps) {
  const { month } = useSelector<ReducerType>(state => state.month) as { month: boolean };
  const dispatch = useDispatch();

  function setShowMonth() {
    dispatch(activeMonth(!month))
  }

  return (
    <nav className={ 'nav' }>
      <div className={ 'nav__box' } onClick={ () => setShowMonth() }><span>{ new Date().getMonth() + 1 }월</span></div>
      <NavLink to="/Dev-Event-Client" exact={ true } activeClassName={ 'nav__text--active' } className={ 'nav__text' }>
        EVENT
      </NavLink>
      <NavLink to='/Dev-Event-Client/education' exact={ true } activeClassName={ 'nav__text--active' }
               className={ 'nav__text' }>
        Edu
      </NavLink>
      <p className={ 'nav__text' }>Meet</p>
      <p className={ 'nav__text' }>Circles</p>
      <div className={'nav__box--month'}>

      </div>
    </nav>
  )
}

export default Navigation;
