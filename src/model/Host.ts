export type HostClassification =
  | 'COMPANY'
  | 'COMMUNITY'
  | 'ACADEMIC'
  | 'GOVERNMENT'
  | 'EDUCATION'
  | 'MEDIA';

export type HostLinkType =
  | 'HOMEPAGE'
  | 'YOUTUBE'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'LINKEDIN'
  | 'GITHUB'
  | 'BLOG'
  | 'ETC';

export type HostLink = {
  id?: number;
  type: HostLinkType;
  description: string;
  url: string;
  primary: boolean;
  display_order: number;
};

export type HostTopic = {
  id?: number;
  name: string;
  display_order: number;
};

export type Host = {
  host_name: string;
  description: string;
  image_link: string;
  classification: HostClassification | null;
  domain: string | null;
  banner_image_link: string | null;
  meta_location: string | null;
  display_order: number;
  links: HostLink[];
  topics: HostTopic[];
};

export type HostResponse = Host & {
  id: number;
  verified: boolean;
};
