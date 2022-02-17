export interface ResponseUploadImage {
  file_url: string;
  size: number;
}

export type UploadImageTypes = 'NONE' | 'DEV_EVENT' | 'VOD';
export interface UploadImageProps {
  fileType: UploadImageTypes;
  body: FormData;
}
