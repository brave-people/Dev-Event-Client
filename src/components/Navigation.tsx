import React from 'react';
import {NavLink} from 'react-router-dom';

type NavigationProps = {
  list: string[];
};

const Navigation: React.FC<NavigationProps> = () => (
  <nav className={'nav'}>
    <div className={'nav__box'}><span>{new Date().getMonth() + 1}</span></div>
    <NavLink to="/" exact={true} activeClassName={'nav__text--active'} className={'nav__text'}>2020 event</NavLink>
    <NavLink to='/education' exact={true} activeClassName={'nav__text--active'}
             className={'nav__text'}>education</NavLink>
    <p className={'nav__text'}>meet</p>
    <p className={'nav__text'}>circles</p>
  </nav>
);

export default Navigation;
