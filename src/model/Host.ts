export type Host = {
  host_name: string;
  description: string;
  image_link: string;
};

export type HostResponse = Host & {
  id: number;
};
