import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import SplashScreen from "./components/Splash";
import Home from "./pages/Event";
import PastEvent from "./pages/PastEvent";

import "./App.scss";
import "./styles/index.scss";

import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "./rootReducer";
import { MonthModel } from "./models/month";
import { activeMonth } from "./slices/month";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { date } = useSelector<ReducerType>(
    (state) => state.month
  ) as MonthModel;

  document.addEventListener("mousemove", (e) => {
    let circle = document.getElementById("circle");
    if (circle) circle.style.transform = `translate(${e.x}px, ${e.y}px)`;
  });

  // 최초 날짜 설정
  const addZero = Number(new Date().getMonth() + 1) < 10 ? "0" : "";
  if (!date) {
    const currentDate = `${new Date().getFullYear()}.${addZero}${Number(
      new Date().getMonth() + 1
    )}`;
    dispatch(activeMonth(currentDate));
  }

  return (
    <div id={"app"}>
      <div id={"circle"}></div>
      <SplashScreen />
      <div className={"header"}>
        <img
          id={"logo"}
          src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/dev-128.png"
          alt="logo"
        />
        <div className={"hambuger"} onClick={() => setShow(!show)}>
          <div className={"hambuger__icon"}>
            <span className={"hambuger__icon--line"}></span>
            <span className={"hambuger__icon--line"}></span>
          </div>
        </div>
      </div>
      <BrowserRouter>
        <div className={show ? "nav nav--show" : "nav nav--hide"}>
          <div className={"nav__item"} onClick={() => setShow(false)}>
            <img
              src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/GitHub-Mark-120px-plus.png"
              alt="github"
              onClick={() =>
                window.open("https://github.com/brave-people/Dev-Event-Client")
              }
            />
            <div className={"nav__item__wrap"}>
              <Link to="/Dev-Event-Client" className={"nav__text"}>
                EVENT
              </Link>
              <Link to="/Dev-Event-Client/productPast" className={"nav__text"}>
                PAST EVENT
              </Link>
            </div>
          </div>
          <div className={"nav__item--point"}></div>
        </div>
        <ScrollToTop />
        <Switch>
          <Route exact path={"/Dev-Event-Client"} component={Home} />
          <Route
            exact
            path={"/Dev-Event-Client/productPast"}
            component={PastEvent}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
