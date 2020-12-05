import React from "react";
import Card from '../components/Card.tsx'
import Filter from "../components/Filter";
import ScrollElement from "../components/ScrollElement";
import CardData from '../models/data.json';

function Home() {
  const filter = ["웨비나", "온라인", "오픈소스", "컨퍼런스", "다양한", "애자일", "해커톤"];

  const filterCardData = CardData.filter(card => {
    return card.startDate.split('.')[1] === String(new Date().getMonth() + 1);
  })

  return (
    <div>
      {/*<ScrollElement />*/}
      <Filter filter={filter} />
      {/*<div className={'landing__wrap'}>
        <h1 className={'landing__title'}>DEV EVENT</h1>
        <p>개발자 컨퍼런스 및 해커톤 일정을 알려드립니다</p>
      </div>*/}
      <Card cards={filterCardData}/>
    </div>
  );
}

export default Home;
