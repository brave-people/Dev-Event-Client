import type { Host, HostLink } from '../../model/Host';

export type HostRequestBody = {
  hostName: string;
  description: string;
  imageLink: string;
  classification: Host['classification'];
  domain: string | null;
  bannerImageLink: string | null;
  metaLocation: string | null;
  displayOrder: number;
  links: Array<{
    type: HostLink['type'];
    description: string;
    url: string;
    primary: boolean;
    displayOrder: number;
  }>;
  topics: Array<{
    name: string;
    displayOrder: number;
  }>;
};

export const toHostRequestBody = (data: Host): HostRequestBody => ({
  hostName: data.host_name,
  description: data.description,
  imageLink: data.image_link,
  classification: data.classification,
  domain: data.domain,
  bannerImageLink: data.banner_image_link,
  metaLocation: data.meta_location,
  displayOrder: data.display_order,
  links: data.links.map((l) => ({
    type: l.type,
    description: l.description,
    url: l.url,
    primary: l.primary,
    displayOrder: l.display_order,
  })),
  topics: data.topics.map((t) => ({
    name: t.name,
    displayOrder: t.display_order,
  })),
});
