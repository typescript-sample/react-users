import { Attributes, Filter, Service, Tracking,NumberRange } from 'onecore';

export interface CompanyFilter extends Filter {
    id?: string;
    name?: string;
    description?: string;
    address?: string;
    size?: NumberRange;
    status: string;
    establishedAt?: Date;
    categories: string[];
    imageURL?: string;
    coverURL?: string;
    gallery?: string[];
}
export interface Company extends Tracking {
    id: string;
    name: string;
    description: string;
    size: number;
    status: string;
    establishedAt: Date;
    categories: string[];
    imageURL?: string;
    coverURL?: string;
    info?: Info;
}
export interface Info {
    viewCount: number;
    rateLocation: number;
    rate: number;
    rate1: number;
    rate2: number;
    rate3: number;
    rate4: number;
    rate5: number;
  }
export interface CompanyService extends Service<Company, string, CompanyFilter> {
    getCompany(id: string): Promise<Company[]>;
}

export const companyModel: Attributes = {
    id: {
        length: 40,
        required: true,
        key: true
    },
    name: {
        length: 120,
        required: true,
        q: true
    },
    description: {
        length: 1000,
        required: true,
        q: true
    },
    size: {
    },
    status: {
        length: 1,
        required: true,
        q: true
      },
    establishedAt: {
        type: 'datetime'
    },
    categories: {
        type:'strings'
    },
    imageURL:{},
    coverURL:{}
};
