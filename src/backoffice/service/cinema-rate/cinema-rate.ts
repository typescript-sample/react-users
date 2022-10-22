import { Attributes, Filter, Service } from 'onecore';

export interface CinemaRate {
  cinemaId?: string;
  id?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRateService extends Service<CinemaRate, string, CinemaRateFilter>{
  getCinemaByCinemaId(cinemaId: string): Promise<CinemaRate[]>;
}

export class CinemaRateFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  cinemaId?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
  limit?: number;
}

export const cinemaRateModel: Attributes = {
  id: {
    key: true,
    required: true,
    q: true
  },
  cinemaId: {
    required: true,
    key: true,
    q: true
  },
  userId: {
    required: true,
    q: true
  },
  rate: {
    required: true,
    q: true,
    type: 'number'
  },
  rateTime: {
    type: 'datetime'
  },
  review: {
    q: true
  }
}