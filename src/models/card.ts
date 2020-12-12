export interface CommonCardModel {
  id: number,
  title: string,
  description: string,
  link: string,
}

export interface CardModel extends CommonCardModel{
  id: number,
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  owner: string,
  tags: string,
  thumbnail: string,
  link: string,
  linkDetail?: string,
}

export interface TextCardModel extends CommonCardModel {
  color: string,
}
