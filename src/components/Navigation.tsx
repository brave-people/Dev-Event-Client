import React from 'react';
import {NavLink} from 'react-router-dom';

type NavigationProps = {
  list: string[];
};

function Navigation(props: NavigationProps) {
  return (
    <nav className={'nav'}>
      <div className={'nav__box'}><span>{new Date().getMonth() + 1}월</span></div>
      <NavLink to="/" exact={true} activeClassName={'nav__text--active'} className={'nav__text'}>
        2020<br/>event
      </NavLink>
      <NavLink to='/education' exact={true} activeClassName={'nav__text--active'}
               className={'nav__text'}>education</NavLink>
      <p className={'nav__text'}>meet</p>
      <p className={'nav__text'}>circles</p>
    </nav>
  )
}

export default Navigation;
