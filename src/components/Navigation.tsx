import React from 'react';

type NavigationProps = {
  list: string[];
};

const Navigation: React.FC<NavigationProps> = () => (
  <nav className={'nav'}>
    <div className={'nav__box'}><span>12</span></div>
    <p className={'nav__text nav__text--active'}>2020 event</p>
    <p className={'nav__text'}>education</p>
    <p className={'nav__text'}>meet</p>
    <p className={'nav__text'}>circles</p>
  </nav>
);

export default Navigation;
