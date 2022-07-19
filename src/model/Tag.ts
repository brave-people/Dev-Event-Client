export interface TagNameModel {
  tag_name: string;
  tag_color: string;
}

export interface TagModel extends TagNameModel {
  id: number;
}
