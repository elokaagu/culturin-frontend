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
}
