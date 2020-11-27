import React from "react";
import Card from '../components/Card'
import Navigation from '../components/Navigation.tsx'
import CardData from '../model/data.json'

function Home() {
  document.addEventListener('mousemove', function(e) {
    let circle = document.getElementById('circle');
    circle.style.left = e.pageX + 'px';
    circle.style.top = e.pageY + 'px';
  });

  return (
    <div>
      <div id={'circle'}></div>
      <Card cards={CardData} />
      <Navigation />
    </div>
  );
}

export default Home;
