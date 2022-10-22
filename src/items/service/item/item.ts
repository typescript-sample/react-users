import { Attributes, Filter, Service, Tracking, NumberRange } from 'onecore';
import { FileInfo } from 'reactx-upload';

export interface ItemFilter extends Filter {
  id?: string;
  title?: string;
  status?: string;
  description?: string;
  categories?: string[];
  brand?: string[];
  price?: NumberRange;

}
export interface Item extends Tracking {
  id: string;
  title: string;
  status: string;
  imageURL: string;
  description: string;
  categories: string[];
  brand: string;
  price: number;
  publishedAt?: Date;
  expiredAt?: Date;
  info?: Info;
  gallery?: FileInfo[];
}

export interface Info {
  viewCount: number;
}


export const itemModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  title: {
    length: 100,
    required: true,
    q: true
  },
  imageURL: {
    length: 1500,
  },
  description: {
    length: 1000,
    q: true
  },
  status: {
    length: 1,
    required: true,
    q: true
  },
  categories: {
    type: 'primitives',
  },
  brand: {
    type: 'string',
    length: 100,
  },
  price: {
  },
  gallery:{
    
  }
};


export interface ItemService extends Service<Item, string, ItemFilter> {
  getItem(id: string | undefined): Promise<Item | null>;
  updateItem(item: Item, id: string): Promise<Item | null>;
  saveItem(item: Item): Promise<number>;
}

export interface BrandService {
  getBrand(q: string, max?: number): Promise<string[] | null>;
}