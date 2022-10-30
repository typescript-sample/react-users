import { Attributes, Filter, Service, Tracking, NumberRange } from 'onecore';
import { FileInfo } from 'reactx-upload';

export interface ItemFilter extends Filter {
  id?: string;
  title?: string;
  author?:string;
  status?: string|string[];
  description?: string;
  categories?: string[];
  brand?: string[];
  price?: NumberRange;
}
export interface Item extends Tracking {
  id: string;
  author: string;
  title: string;
  price: number;
  imageURL?: string;
  brand: string;
  status: string;
  description?: string;
  categories?: string[];
  gallery?: FileInfo[];
}

export const itemModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  title: {
    required: true,
    length: 300,
    q: true
  },
  author:{
    required: true,
    length:300,
  },
  imageURL: {
    length: 1500,
  },
  price: {
    type: 'number',
  },
  brand: {
    type: 'string',
    length: 255,
  },
  publishedAt: {
    type: 'datetime'
  },
  expiredAt: {
    type: 'datetime'
  },
  description: {
    length: 1000,
  },
  status: {
    required: true,
    length: 1,
    match: 'equal',
  },
  categories: {
    type: 'primitives',
  },
};

export interface ItemService extends Service<Item, string, ItemFilter> {
  fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []>;
  deleteFile(id: string, fileUrl: string): Promise<number>;
  deleteFileYoutube(id: string, fileUrl: string): Promise<number>;
  uploadExternalResource(id: string, videoId: string): Promise<number>;
  updateData(id: string, data: FileInfo[]): Promise<number>;
}
