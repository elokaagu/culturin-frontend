export interface simpleBlogCard {
  title: string;
  summary: string;
  currentSlug: string;
  titleImage: any;
}

export interface fullBlog {
  title: string;
  currentSlug: string;
  summary: string;
  titleImage: any;
  body: any;
}

export interface videoCard {
  title: string;
  currentSlug: string;
  uploader: string;
  videoThumbnail: any;
  description: string;
}

export interface fullVideo {
  title: string;
  currentSlug: string;
  uploader: string;
  videoThumbnail: any;
  description: string;
  playbackId: string;
  _id: string;
}

export interface providerCard {
  name: string;
  eventName: string;
  slug: { current: string };
  bannerImage: any;
}

export interface fullProvider {
  name: string;
  eventName: string;
  slug: { current: string };
  bannerImage: any;
  description: string;
  location: string;
  contact: any;
  website: string;
  prices: number[];
  images: any[];
  _id: string;
}
