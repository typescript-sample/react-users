import { Attributes, Filter, Service, Tracking } from 'onecore';
import { FileInfo } from 'reactx-upload';
import { UploadSerivce } from '../../../upload-form';
// import { UploadSerivce } from '../../../backoffice/upload-form';

export interface FilmFilter extends Filter {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  status?: string[] | string;
  categories?: string[];
  directors?: string[];
  casts?: string[];
  productions?: string[];
  countries?: string[];
  language:string;
  writer?:string[];
}

export interface Film extends Tracking {
  id: string;
  title: string;
  status: string;
  description?: string;
  imageURL?: string;
  trailerUrl?: string;
  categories?: string[];
  directors?: string[];
  casts?: string[];
  productions?: string[];
  countries?: string[];
  language:string;
  writer?:string[];
  gallery?:FileInfo[]
  coverURL?: string;
}

export interface FilmSearch {
  list: Film[];
  total: number;
}
export interface FilmService extends Service<Film, string, FilmFilter>,UploadSerivce<Film>{
 
}


export const filmModel: Attributes = {
  id: {
    length: 40,
    key: true,
    required: true,
  },
  title: {
    length: 300,
    required: true,
  },
  description: {
    length: 300,
  },
  imageUrl: {
    length: 300
  },
  trailerUrl: {
    length: 300
  },
  categories: {
    type: 'strings',
  },
  status: {
    match: 'equal',
    length: 1
  },
  directors: {
    type: 'strings',
  },
  casts: {
    type: 'strings',
  },
  productions: {
    type: 'strings',
  },
  countries: {
    type: 'strings',
  },
  languages:{
    type:'string'
  },
  writer:{
    type:'strings'
  },
  createdBy: {
    length: 40
  },
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {
    length: 40
  },
  updatedAt: {
    type: 'datetime'
  },
  gallery:{

  },
  coverURL:{
    
  }
};
