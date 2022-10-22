import { Attributes, Filter, Service, Tracking,NumberRange } from 'onecore';
import { FileInfo } from 'reactx-upload';
import { UploadSerivce } from '../../../backoffice/upload-form';

export interface CompanyFilter extends Filter {
    id?: string;
    name?: string;
    description?: string;
    address?:string,
    size?: NumberRange;
    status: string;
    establishedAt?: Date;
    categories: string[];
}
export interface Company extends Tracking {
    id: string;
    name: string;
    description: string;
    address:string,
    size: number;
    status: string;
    establishedAt: Date;
    categories: string[];
    imageURL?:string;
    coverURL?:string;
    gallery?:FileInfo[];
}
export interface CompanyService extends Service<Company, string, CompanyFilter> ,UploadSerivce<Company>{
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
    address:{
        length:255
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
    gallery:{

    },
    coverURL:{
      
    },
    imageURL: {
    },
};
