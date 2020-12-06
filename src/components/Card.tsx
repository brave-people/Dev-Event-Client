import React from "react";
import { CardModel } from "../models/card";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { addFilter } from "../slices/filter";
import { FilterModel } from "../models/filter";

type CardProps = {
  cards: CardModel[];
};

function Card(props: CardProps) {
  const { tags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const { activeTags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const dispatch = useDispatch();

  const list: string[] = [];
  props.cards.forEach(el => {
    el.tags.split(',').forEach(tag => {
      if (!list.includes(tag)) {
        list.push(tag);
      }
    })
  })
  if (!tags.length) dispatch(addFilter(list))

  function getDate(date: string) {
    const sliceDate = date.split('.');

    if (date.includes('T')) {
      const sliceTime = sliceDate[sliceDate.length - 1].split('T');
      const time = `${ sliceTime[0] } ${ sliceTime[1] }`;
      return `${ sliceDate[1] }.${ time }`;
    } else {
      return date.split('.').splice(1, 2).join('.');
    }
  }

  function moveLink(link: string) {
    window.open(link, '_blank');
  }

  function setTransCard(e: React.MouseEvent) {
    const target = e.target as HTMLTextAreaElement;
    if (target.classList.contains('card')) {
      // console.log('x: ', e.clientX, target.offsetLeft);
      // console.log('y: ', e.clientY, target.offsetTop);
      if (target.offsetLeft + target.clientWidth / 2 < e.clientX) {
        target.style.transform = 'rotate3d(1, 1, 1, 1deg)';
      } else {
        target.style.transform = 'rotate3d(1, 1, 1, -1deg)';
      }
    }
  }

  function setLeaveCard(e: React.MouseEvent) {
    const target = e.target as HTMLTextAreaElement;
    if (target.classList.contains('card')) {
      target.style.transform = 'rotate3d(1, 1, 1, 0)';
    }
  }

  return (
    <div className={ 'card__column' }>
      { props.cards.map((el) => {
        const splitTags = el.tags.split(',');
        const startDate = getDate(el.startDate);
        const endDate = getDate(el.endDate);

        // 필터 기능
        if (activeTags.length === 1) {
          // 하나만 선택했을 경우 하나라도 포함된 카드를 필터링 함
          if (splitTags.findIndex(el => activeTags.includes(el)) === -1) {
            return false;
          }
        } else if (activeTags.length) {
          // 다중 선택했을 경우 모두 포함하는 카드를 필터링 함
          if (!activeTags.every(v => splitTags.includes(v))) {
            return false;
          }
        }

        return (
          <div key={ el.id } className={ 'card' } style={ { backgroundImage: `url(${ el.thumbnail })` } }
               onClick={ () => moveLink(el.link) } onMouseMove={ setTransCard } onMouseLeave={ setLeaveCard }>
            <div className={ 'card__tag' }>
              <img className={ 'card__tag__image' }
                   src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/price-tag.svg" alt="tag"/>
              <div style={ { display: 'block' } }>
                { splitTags.map((tag, index) => <span key={ index }>{ tag }</span>) }
              </div>
            </div>
            <div className={ 'card__text' }>
              <p className={ 'card__text--date' }>{ startDate } { el.endDate && <span> ~ { endDate }</span> }</p>
              <h2>{ el.title }</h2>
              <p>{ el.description }</p>
              <p className={ 'font-medium' }>{ el.owner }</p>
            </div>
          </div>
        )
      }) }
    </div>
  )
}

export default Card;
