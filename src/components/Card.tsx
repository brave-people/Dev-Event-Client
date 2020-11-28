import '../style/index.scss'
import React from "react";
import {CardModel} from "../model/card";

type CardProps = {
  cards: CardModel[];
};

class Card extends React.Component<CardProps> {
  render() {
    const cardList: CardModel[] = this.props.cards;

    function getDate(date: string) {
      const sliceDate = date.split('.');

      if (date.includes('T')) {
        const sliceTime = sliceDate[sliceDate.length - 1].split('T');
        const time = `${sliceTime[0]} ${sliceTime[1]}`;

        return `${sliceDate[0]}.${sliceDate[1]}.${time}`;
      } else {
        return date.split('.').splice(1, 2).join('.');
      }
    }

    return (
      <div className={'card__column'}>
        {cardList.map((el) => {
          const startDate = getDate(el.startDate);
          const endDate = getDate(el.endDate);

          return <div key={el.id} className={'card'} style={{backgroundImage: `url(${el.thumbnail})`}}>
            <div className={'card__tag'}>
              <img className={'card__tag__image'}
                   src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/price-tag.svg" alt="tag"/>
              {el.tags.split(',').map((tag, index) => <span key={index}>{tag}</span>)}
            </div>
            <div className={'card__text'}>
              <p className={'card__text--date'}>{startDate} {el.endDate && <span> ~ {endDate}</span>}</p>
              <h2>{el.title}</h2>
              <p>{el.description}</p>
              <p className={'font-medium'}>{el.owner}</p>
            </div>
          </div>
        })}
      </div>
    )
  }
}

export default Card;
