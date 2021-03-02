import React, { useState } from "react";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import Filter from "../components/Filter";
import { ReducerType } from "../rootReducer";
import { MonthModel } from "../models/month";
import { CardModel } from "../models/card";
import CardData from "../data/data.json";

function Home() {
  const { date } = useSelector<ReducerType>(
    (state) => state.month
  ) as MonthModel;
  let [search, setSearch] = useState("");
  let [searchList, setSearchList] = useState<CardModel[] | []>([]);
  const consonant: string[] = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  const filterCardData = CardData.filter((card) => {
    if (
      card.startDate.indexOf(date) !== -1 ||
      card.endDate.indexOf(date) !== -1
    ) {
      return card.startDate.split(".")[1];
    }
  });

  let consonantList = filterCardData.map((v) => {
    return {
      id: v.id,
      value: changeWordToConsonant(v.title.replace(/ /g, "")),
    };
  });

  function onChangeHandler(keyword: string) {
    const result = consonantList
      .filter((v) => {
        return v.value.includes(keyword);
      })
      .map((x) => {
        return filterCardData.filter((y) => {
          return y.id === x.id;
        })[0];
      });

    setSearch(keyword);
    setSearchList(result);
  }

  function changeWordToConsonant(str) {
    const result: string[] = [];
    const startHangel = 44032; //한글 시작 코드
    const consonantLength = 588; // 초성 코드

    for (let i in str) {
      const index = Math.floor(
        (str[i].charCodeAt() - startHangel) / consonantLength
      );
      result.push(consonant[index] || str[i]);
    }
    return result.join("").toLocaleLowerCase();
  }

  return (
    <div>
      <div className={"search"}>
        <input
          type="text"
          placeholder={"Search"}
          onChange={(e) => onChangeHandler(e.target.value)}
        />
      </div>
      <Filter />
      <Card cards={search ? searchList : filterCardData} />
      <article
        className={
          search && !searchList.length ? "search--no--result" : "search--no"
        }
      >
        <p>검색 결과가 존재하지 않아요</p>
      </article>
    </div>
  );
}

export default Home;
