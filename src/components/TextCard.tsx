import React from "react";
import TinySlider from "tiny-slider-react";
import { useDispatch } from "react-redux";
import { updateTextCard } from "../slices/textCard";
import { TextCardModel } from "../models/card";

type TextCardProps = {
  cards: TextCardModel[];
};

function TextCard(props: TextCardProps) {
  const dispatch = useDispatch();
  const settings = {
    lazyload: true,
    nav: false,
    mouseDrag: true,
    autoWidth: true,
    viewportMax: 'autoWidth',
    controlsText: ['', ''],
  };

  function updateIndex(data) {
    dispatch(updateTextCard(data.displayIndex))
  }

  function moveLink(link: string) {
    window.open(link, '_blank');
  }

  return (
    <TinySlider className={ 'text-card__column' } settings={ settings } onIndexChanged={ (data) => updateIndex(data) }>
      { props.cards.map((el) => {
        return (
          <div key={ el.id } className={ 'text-card' } id={ `text-card--${el.id}` }>
            <h2>{ el.title }</h2>
            <p>{ el.description }</p>
            <button onClick={() => moveLink(el.link)}>이동하기</button>
          </div>
        )
      }) }
    </TinySlider>
  )
}

export default TextCard;
