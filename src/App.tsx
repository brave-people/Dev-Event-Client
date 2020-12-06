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
