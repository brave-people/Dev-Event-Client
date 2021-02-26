import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "../rootReducer";
import ListCard from "../components/ListCard";
import { updateYears } from "../slices/list";
import CardListData from "../data/dataPast.json";
import { ListModel } from "../models/card";

function ProductPast() {
  const { years } = useSelector<ReducerType>((state) => state.list) as {
    years: string[];
  };
  const dispatch = useDispatch();

  function setUpdateYears(value: string) {
    dispatch(updateYears(value));
  }

  const filterCardListData: ListModel[] = CardListData.filter((card) => {
    return years.find((v) => {
      // 선택한 years에 부합하는 조건 찾기
      if (
        card.startDate.split(".")[0] === v ||
        card.endDate.split(".")[0] === v
      ) {
        return card;
      }
    });
  }).sort(
    // 날짜와 시 순으로 정렬
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <section className={"filter__box list__filter__box"}>
      <article className={"filter__button__wrap"}>
        <button
          className={
            years.findIndex((v) => v === "2020") > -1
              ? "filter__button filter__button--active"
              : "filter__button"
          }
          onClick={() => setUpdateYears("2020")}
        >
          2020
        </button>
        <button
          className={
            years.findIndex((v) => v === "2021") > -1
              ? "filter__button filter__button--active"
              : "filter__button"
          }
          onClick={() => setUpdateYears("2021")}
        >
          2021
        </button>
      </article>
      <ListCard cards={years.length ? filterCardListData : CardListData} />
    </section>
  );
}

export default ProductPast;
