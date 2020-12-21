import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { activeFilter } from "../slices/filter";
import { FilterModel } from "../models/filter";
import { MonthModel } from "../models/month";

function Filter() {
  const { tags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const { activeTags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const { month } = useSelector<ReducerType>(state => state.month) as MonthModel;
  const dispatch = useDispatch();
  let [showTags, setTags] = useState(false);

  // month 클릭 한 경우 필터 닫기
  if (month && showTags) {
    setTags(false)
  }

  function setShowTags() {
    setTags(!showTags)
  }

  function setTag(tag: string) {
    dispatch(activeFilter(tag))
  }

  return (
    <div className={ 'filter__box' }>
      <button onClick={ () => setShowTags() }>
        <img className={ 'card__tag__image' }
             style={ { top: 0 } }
             src="https://s3.ap-northeast-2.amazonaws.com/cdn.cindy.com/dev-event/price-tag-fill.svg" alt="tag"/>
        Tag
        <div className={ 'filter--arrow' }></div>
      </button>
      <div className={ showTags ? 'filter filter--active' : 'filter' }>
        { tags.map((el: string, index: number) => {
          return <p onClick={ () => setTag(el) } key={ index }
                    className={ activeTags.find(tag => tag === el) ? 'tag tag--active' : 'tag' }>{ el }</p>
        }) }
      </div>
    </div>
  )
}

export default Filter;
