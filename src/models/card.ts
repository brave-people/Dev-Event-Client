export interface CommonCardModel {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  owner: string;
  tags: string;
  thumbnail: string;
}

export interface CardModel extends CommonCardModel {
  description: string;
  link: string;
  linkDetail?: string;
}

export interface ListModel extends CommonCardModel {
  link?: string;
  video?: string;
}
