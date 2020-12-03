import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './views/Home.js'
import Education from './views/Education'
import './App.css';
import Navigation from "./components/Navigation";


function App() {
  document.addEventListener('mousemove', (e) => {
    let circle = document.getElementById('circle');
    circle.style.transform = `translate(${e.x}px, ${e.y}px)`
  });

  return (
    <BrowserRouter>
      <div id={'circle'}></div>
      <div>
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route path={"/education"} component={Education} />
        </Switch>
        <Navigation list={''} />
      </div>
    </BrowserRouter>
  );
}

export default App;
