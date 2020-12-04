import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import SplashScreen from './components/Splash'
import Home from './views/Home.js'
import Education from './views/Education'
import Navigation from "./components/Navigation";
import './App.scss';


function App() {
  document.addEventListener('mousemove', (e) => {
    let circle = document.getElementById('circle');
    circle.style.transform = `translate(${e.x}px, ${e.y}px)`
  });

  return (
    <div>
      <div id={'circle'}></div>
      <SplashScreen/>
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path={"/"} component={Home}/>
            <Route path={"/education"} component={Education}/>
          </Switch>
          <Navigation list={''}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
