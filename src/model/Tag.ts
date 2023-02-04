export interface TagName {
  tag_name: string;
  tag_color: string;
}

export interface Tag extends TagName {
  id: number;
}

export type TagLayerType = 'create' | 'modify' | 'delete';

export type TagState = {
  tagList: Tag[];
  selectTags: Tag[];
  activeType: TagLayerType | null;
  keyword: string;
  showLayer: boolean;
};
