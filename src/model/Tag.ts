import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from 'react-query';

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

export type TagApi = {
  createTag: (data: TagName) => Promise<{ status_code: number }>;
  modifyTag: (data: TagName, id: number) => Promise<{ status_code: number }>;
  deleteTag: (id: number) => Promise<unknown>;
};

export type TagRefetch = {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<Tag[], unknown>>;
};
