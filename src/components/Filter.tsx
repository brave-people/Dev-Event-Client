import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { activeFilter } from "../slices/filter";
import { FilterModel } from "../models/filter";
import { MonthModel } from "../models/month";

function Filter() {
  const { tags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const { activeTags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const { showMonth } = useSelector<ReducerType>(state => state.month) as MonthModel;
  const dispatch = useDispatch();
  let [showTags, setTags] = useState(false);

  // month 클릭 한 경우 필터 닫기
  if (showMonth && showTags) {
    setTags(false)
  }

  function setShowTags() {
    setTags(!showTags)
  }

  function setTag(tag: string) {
    dispatch(activeFilter(tag))
  }

  return (
    <section className={ 'filter__box' }>
      <article className={ 'filter__button__wrap' }>
        <button className={ 'filter__button' } onClick={ () => setTag('온라인') }>온라인</button>
        <button className={ 'filter__button' } onClick={ () => setTag('컨퍼런스') }>컨퍼런스</button>
        <button className={ 'filter__button' } onClick={ () => setTag('세미나') }>세미나</button>
        <button className={ 'filter__button--icon' } onClick={ () => setShowTags() }>
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/filter.svg" alt="filter"/>
        </button>
      </article>
      <div className={ showTags ? 'filter--background' : '' } onClick={ () => setShowTags() }></div>
      <article className={ showTags ? 'filter filter--active' : 'filter' }>
        <p className={ 'filter__title' }>태그</p>
        <div className={ 'filter--grid' }>
          { tags.map((el: string, index: number) => {
            return <p onClick={ () => setTag(el) } key={ index }
                      className={ activeTags.find(tag => tag === el) ? 'tag tag--active' : 'tag' }>{ el }</p>
          }) }
        </div>
        <div className={ 'filter--pointer' }></div>
      </article>
    </section>
  )
}

export default Filter;
