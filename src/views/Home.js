import React from "react";
import Card from '../components/Card.tsx'
import Navigation from '../components/Navigation.tsx'
import Filter from "../components/Filter";
import ScrollElement from "../components/ScrollElement";
import CardData from '../model/data.json';

function Home() {
  const filter = ["웨비나", "온라인", "오픈소스", "컨퍼런스", "다양한", "애자일", "해커톤"];

  document.addEventListener('mousemove', (e) => {
    let circle = document.getElementById('circle');
    circle.style.transform = `translate(${e.x}px, ${e.y}px)`
  });

  return (
    <div>
      <div id={'circle'}></div>
      {/*<ScrollElement />*/}
      {/*<Filter filter={filter} />*/}
      <Card cards={CardData} />
      <Navigation />
    </div>
  );
}

export default Home;
