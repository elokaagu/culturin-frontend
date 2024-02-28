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
  slug: string;
  bannerImage: BannerImage;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
  prices: number[];
  images: imageAsset[];
}

export interface BannerImage {
  image: {
    url: string;
    alt: string;
  };
}

export interface imageAsset {
  _id: string;
  url: string; // URL resolved from the asset reference ID
  dimensions: {
    width: number;
    height: number;
  };
}
