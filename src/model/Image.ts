export interface ResponseUploadImage {
  file_url: string;
  size: number;
  message?: string;
}

export type UploadImageTypes =
  | 'NONE'
  | 'DEV_EVENT'
  | 'DEV_EVENT_DETAIL'
  | 'VOD'
  | 'HOST';
export interface UploadImageProps {
  fileType: UploadImageTypes;
  body: FormData;
}
