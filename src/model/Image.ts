export interface ResponseUploadImage {
  file_url: string;
  size: number;
  message?: string;
}

export type UploadImageTypes = 'NONE' | 'DEV_EVENT' | 'VOD' | 'HOST';
export interface UploadImageProps {
  fileType: UploadImageTypes;
  body: FormData;
}
