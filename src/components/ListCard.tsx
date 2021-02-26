import { ListModel } from "../models/card";
import React from "react";

type ListCardProps = {
  cards: ListModel[];
};

function moveLink(video?: string, link?: string) {
  if (video) {
    window.open(video);
  } else if (link) {
    window.open(link);
  }
}

function ListCard(props: ListCardProps) {
  return (
    <article className={"list__wrap"}>
      {props.cards.map((el) => {
        const splitTags = el.tags.split(",");

        return (
          <div
            key={el.id}
            className={"list"}
            onClick={() => moveLink(el.video, el.link)}
          >
            <div
              className={"list__image"}
              style={{ backgroundImage: `url(${el.thumbnail})` }}
            />
            <p className={"list__date"}>{el.startDate.split(".")[1]}</p>
            <h2 className={"list__title"}>{el.title}</h2>
            <div className={"list__description"}>
              <p>{el.owner}</p>
              <div className={"list__tags"}>
                {splitTags.map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </article>
  );
}

export default ListCard;
