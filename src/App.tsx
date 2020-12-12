import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SplashScreen from './components/Splash'
import Home from './pages/Home'
import Education from './pages/Education'
import Navigation from "./components/Navigation";
import './App.scss';
import './styles/index.scss'

function App() {
  document.addEventListener('mousemove', (e) => {
    let circle = document.getElementById('circle');
    if (circle) circle.style.transform = `translate(${ e.x }px, ${ e.y }px)`
  });

  return (
    <div>
      <div id={ 'circle' }></div>
      <SplashScreen/>
      <div className={"logo__wrap"}>
        <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/GitHub-Mark-Light-120px-plus.png"
             alt="github" id={ "logo--github" } onClick={() => window.open('https://github.com/brave-people/Dev-Event-Client')}/>
        <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/brave_logo.png" id={ "logo" }/>
      </div>
      <BrowserRouter>
        <Switch>
          <Route exact path={ "/Dev-Event-Client" } component={ Home }/>
          <Route path={ "/Dev-Event-Client/education" } component={ Education }/>
        </Switch>
        <Navigation list={ [] }/>
      </BrowserRouter>
    </div>
  );
}

export default App;
