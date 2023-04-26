export type Banner = {
  title?: string;
  priority: number;
  visibleYn: 'Y' | 'N';
  startDateTime: string;
  endDateTime: string;
  bannerImage: string;
};

export type BannerResponse = Banner & {
  id: number;
  createDateTime: string;
  updateDateTime: string;
};
