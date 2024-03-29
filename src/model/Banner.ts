export type Banner = {
  title: string;
  event_link: string;
  priority: number;
  visible_yn: 'Y' | 'N';
  start_date_time: string;
  end_date_time: string;
  banner_image: string;
  background_color: string;
};

export type BannerResponse = Banner & {
  id: number;
  createDateTime: string;
  updateDateTime: string;
};
