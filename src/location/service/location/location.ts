import { Attributes, Filter, Service } from 'onecore';
import { FileInfo, Thumbnail } from 'reactx-upload';
export interface Location {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  type: string;
  info?: LocationInfo;
  thumbnail?: string;
  imageURL?: string;
  status: string;
  customURL?: string;
  gallery?: FileInfo[];
  upload?: FileInfo[];
}

// filter
export interface LocationFilter extends Filter {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}

export interface LocationService
  extends Service<Location, string, LocationFilter> {
  getLocationByType(type: string): Promise<Location[]>;
  fetchImageUploaded(id: string): Promise<FileInfo[]> | FileInfo[];
  fetchThumbnailVideo(videoId: string): Promise<Thumbnail>;
}

export const locationModel: Attributes = {
  id: {
    key: true,
    required: true,
    q: true,
  },
  name: {
    required: true,
    q: true,
  },
  description: {
    required: true,
    q: true,
  },
  longitude: {
    type: 'number',
    required: true,
    q: true,
  },
  latitude: {
    type: 'number',
    required: true,
    q: true,
  },
};

export interface LocationInfo {
  viewCount: number;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
}
