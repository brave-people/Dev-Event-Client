import React from 'react';
import { useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import TextCard from "../components/TextCard";
import { TextCardModel } from "../models/card";

function Education() {
  const cardData: TextCardModel[] = [
    {
      id: 0,
      title: '양재동 코드랩',
      description: '이러한 것들을 합니다! 상세 설명',
      link: 'https://www.codelabs.kr/',
      color: 'repeating-linear-gradient(-45deg,#ee7752,#7448ff,#23a6d5,#7448ff,#23d5ab)',
    },
    {
      id: 1,
      title: '스프링 캠프',
      description: '최근 모임: 2019 스프링 캠프(19. 04. 27.)',
      link: 'https://www.springcamp.io/2019/',
      color: 'repeating-linear-gradient(45deg, #34B05F, #1E703E)',
    },
    {
      id: 2,
      title: 'CCCR 아카데미',
      description: '이러한 것들을 합니다! 상세 설명',
      link: 'https://www.cccr-edu.or.kr/main/index.jsp',
      color: '#288DCA',
    },
    {
      id: 3,
      title: '모두의 연구소',
      description: '모두 연구를 해보아요! 상세 설명',
      link: 'https://modulabs.co.kr/',
      color: 'repeating-linear-gradient(-45deg, #FBB1B2, #ff1357)',
    }
  ];
  const { id } = useSelector<ReducerType>(state => state.textCard) as TextCardModel;

  return (
    <div>
      <h2 className={'title'}>Education</h2>
      <TextCard cards={ cardData }/>
      <div className={ 'edu--circle' } style={{ background: cardData[id - 1].color }}></div>
    </div>
  )
}

export default Education;
