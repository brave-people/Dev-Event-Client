import React from "react";
import Card from '../components/Card'
import Filter from "../components/Filter";
import ScrollElement from "../components/ScrollElement";
import { useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { MonthModel } from "../models/month";
import CardData from '../models/data.json';

function Home() {
  const { date } = useSelector<ReducerType>(state => state.month) as MonthModel;

  const filterCardData = CardData.filter(card => {
    if (card.startDate.indexOf(date) !== -1 || card.endDate.indexOf(date) !== -1) {
      return card.startDate.split('.')[1];
    }
  })

  return (
    <div>
      <h2 className={'title'}>2021 EVENT</h2>
      {/*<ScrollElement />*/ }
      <Filter/>
      {/*<div className={'landing__wrap'}>
        <h1 className={'landing__title'}>DEV EVENT</h1>
        <p>개발자 컨퍼런스 및 해커톤 일정을 알려드립니다</p>
      </div>*/ }
      <Card cards={ filterCardData }/>
    </div>
  );
}

export default Home;
