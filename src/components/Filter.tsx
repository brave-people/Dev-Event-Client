import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import { activeFilter } from "../slices/filter";
import { FilterModel } from "../models/filter";

function Filter() {
  const { tags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  const { activeTags } = useSelector<ReducerType>(state => state.filter) as FilterModel;
  console.log('activeFilterList: ', activeTags);
  const dispatch = useDispatch();
  const [showTags, setTags] = useState(false);

  function setShowTags() {
    setTags(!showTags)
  }

  function setTag(tag: string) {
    dispatch(activeFilter(tag))
    // console.log(activeFilterList);
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
          return <p onClick={ () => setTag(el) } key={ index }>{ el }</p>
        }) }
      </div>
    </div>
  )
}

export default Filter;
