import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import SplashScreen from './components/Splash'
import Home from './pages/Home'
import Education from './pages/Education'
import Navigation from "./components/Navigation";
import './App.scss';
import './styles/index.scss'

function App() {
  const [show, setShow] = useState(false);

  document.addEventListener('mousemove', (e) => {
    let circle = document.getElementById('circle');
    if (circle) circle.style.transform = `translate(${ e.x }px, ${ e.y }px)`
  });

  return (
    <div>
      <div id={ 'circle' }></div>
      <SplashScreen/>
      <div className={ "header" }>
        <img id={ 'logo' } src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/dev-128.png"
             alt="logo"/>
        <div className={ 'hambuger' } onClick={ () => setShow(!show) }>
          <div className={ 'hambuger__icon' }>
            <span className={ 'hambuger__icon--line' }></span>
            <span className={ 'hambuger__icon--line' }></span>
          </div>
        </div>
      </div>
      <BrowserRouter>
        <div className={ show ? 'nav nav--show' : 'nav nav--hide' }>
          <div className={ 'nav__item' } onClick={ () => setShow(false) }>
            <div className={ 'nav__item__wrap' }>
              {/*<div>
                <img
                  src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/GitHub-Mark-Light-120px-plus.png"
                  alt="github" id={ "logo--github" }
                  onClick={ () => window.open('https://github.com/brave-people/Dev-Event-Client') }/>
              </div>*/}
              <Link to="/Dev-Event-Client" className={ 'nav__text' }>
                EVENT
              </Link>
              <Link to="/Dev-Event-Client/productPast" className={ 'nav__text' }>
                PAST EVENT
              </Link>
            </div>
          </div>
          <div className={ 'nav__item--point' }></div>
        </div>
        <Switch>
          <Route exact path={ "/Dev-Event-Client" } component={ Home }/>
          <Route path={ "/Dev-Event-Client/education" } component={ Education }/>
        </Switch>
        {/*<Navigation list={ [] }/>*/ }
      </BrowserRouter>
    </div>
  );
}

export default App;
