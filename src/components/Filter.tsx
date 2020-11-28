import React from "react";
import {FilterModel} from "../model/filter";

type FilterProps = FilterModel;

class Filter extends React.Component<FilterProps> {
  render() {
    const filterList: string[] = this.props.filter;

    return (
      <div className={'filter__box'}>
        <p>Find Your Tags</p>
        {filterList.map((el: string, index: number) => {
          return <div key={index}>{el}</div>
        })}
      </div>
    )
  }
}

export default Filter;
