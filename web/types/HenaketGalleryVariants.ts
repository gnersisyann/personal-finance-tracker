export type HenaketGalleryImage = {
  id: string;
  url?: string;
  title?: string;
  description?: string;
};

export type HenaketGalleryItem = {
  image: HenaketGalleryImage;
  alt?: string;
  width: number;
  height: number;
  type: string;
};

export type HenaketGalleryProps = {
  items: HenaketGalleryItem[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
};

export type HenaketLightboxSlide = HenaketGalleryItem;

export type HenaketLightboxProps = {
  slides: HenaketLightboxSlide[];
  visible?: boolean;
  showThumbnails?: boolean;
  showCounter?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};
