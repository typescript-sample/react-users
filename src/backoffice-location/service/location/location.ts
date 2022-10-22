import { Attributes, Filter, Service } from 'onecore';
import { FileInfo, Thumbnail } from 'reactx-upload';
import { UploadSerivce } from '../../../backoffice/upload-form';
export interface Location {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  type: string;
  thumbnail?: string;
  imageURL?: string;
  status: string;
  gallery?: FileInfo[];
  customURL?: string;
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
  extends Service<Location, string, LocationFilter>,UploadSerivce<Location> {
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
  gallery:{
    
  }
};

