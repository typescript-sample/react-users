import { Attributes, Filter, Service, Tracking } from 'onecore';
import { FileInfo } from 'reactx-upload';

export interface FilmFilter extends Filter {
  id: string;
  title: string;
  description?: string;
  imageURL?: string;
  trailerUrl?: string;
  status?: string[] | string;
  categories?: string[];
  directors?: string[];
  casts?: string[];
  productions?: string[];
  countries?: string[];
  language?:string;
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
  info?: FilmInfo;
  language?:string;
  writer?:string[];
  gallery?: FileInfo[];
}
export interface FilmInfo{
  viewCount: number;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
}


export interface FilmSearch {
  list: Film[];
  total: number;
}

export interface UsefulFilm {
  updatedat?: Date|string;
  createdat?: Date|string;
  id: string;
  author: string;
}

export interface FilmService extends Service<Film, string, FilmFilter> {
  getFilmsByCategoryId(id: string): Promise<FilmSearch>;
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
  imageURL: {
    length: 300
  },
  trailerUrl: {
    length: 300
  },
  categories: {
    type: 'primitives',
  },
  language:{
    type:'string'
  },
  writer:{
    type:'strings'
  },
  status: {
    match: 'equal',
    length: 1
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
  }
};

export const filmRateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
    
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 10
  },
  rateTime: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
};
