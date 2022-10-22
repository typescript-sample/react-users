import { Attributes, Filter, Service, Tracking } from 'onecore';
export interface CinemaFilter extends Filter {
  id?: string;
  name?: string;
  address?: string;
  status?: string;
  parent?: string;
  longitude: number;
  latitude: number;
}

export const galleryModel: Attributes = {
  url: {
    required: true,
  },
  type: {
    required: true,
  },
};

export interface Gallery {
  url: string;
  type: string;
}

export interface Cinema extends Tracking {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  imageURL?: string;
  status?: string;
  address?: string;
  parent?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
  coverURL?: string;
  gallery?: Gallery[];
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

export interface CinemaRate {
  id?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRateFilter extends Filter {
  id?: string;
  userId?: string;
  rateTime?: Date;
  review?: string;
}

export interface CinemaSearch {
  list: Cinema[];
  total: number;
}

export interface CinemaService extends Service<Cinema, string, CinemaFilter> {
  getCinemasByRole(id: string): Promise<Cinema[]>;
  rateCinema(obj: CinemaRate): Promise<any>;
}

export interface CinemaRateService extends Service<CinemaRate, string, CinemaRateFilter> { }

export const cinemaModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 255,
  },
  longitude: {
    type: 'number',
  },
  latitude: {
    type: 'number',
  },
  address: {
    length: 255,
  },
  parent: {
    length: 40
  },
  status: {
    length: 1
  },
  imageURL: {},
  createdBy: {},
  createdAt: {
    column: 'createdat',
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    column: 'createdat',
    type: 'datetime'
  },
  gallery: {
    column: 'gallery',
    type: 'array',
    typeof: galleryModel,
  }
};

export const cinemaRateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 5
  },
  rateTime: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
}

