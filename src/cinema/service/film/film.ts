import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface FilmFilter extends Filter {
  filmId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  status?: string[] | string;
}

export interface Film extends Tracking {
  filmId: string;
  title: string;
  status: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  categories?: string[];
  info?: FilmInfo
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

export interface FilmRate {
  id: string;
  filmId: string;
  userId: string;
  rate: number;
  rateTime: Date;
  review: string;
}

export interface FilmRateFilter extends Filter {
  id?: string;
  review?: string;
  filmId?: string;
  userId?: string;
  rateTime?: Date;
}

export interface FilmSearch {
  list: Film[];
  total: number;
}
export interface FilmService extends Service<Film, string, FilmFilter> {
  getFilmsByCategoryId(id: string): Promise<FilmSearch>;
  rateFilm(obj: FilmRate): Promise<any>;
}
export interface FilmRateService extends Service<FilmRate, string, FilmRateFilter> {
}

export const filmModel: Attributes = {
  filmId: {
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
    type: 'primitives',
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
};

export const filmRateModel: Attributes = {
  id: {
    key: true,
  },
  filmId: {
    required: true
  },
  userId: {
    // required: true
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
