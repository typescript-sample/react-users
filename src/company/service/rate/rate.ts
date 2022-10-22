import { Attributes, Filter, SearchService, Service } from 'onecore';
export interface RatesService extends SearchService<Rates, RatesFilter> {
  getRate(obj: Rates): Promise<Rates[]>;
  rate(obj: Rates): Promise<any>;
}


export const shortRateModel: Attributes = {
  rates:{
    type: 'integers'
  },
  time:{
    type: 'datetime'
  },
  review:{}
}

export const ratesModel: Attributes = {
  id: {
    key: true,
    required: true,
    match: 'equal'
  },
  author: {
    key: true,
    required: true,
    match: 'equal'
  },
  rate: {
    type: 'integer',
  },
  rates: {
    type: 'integers'
  },
  time: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
  usefulCount: {
    type: 'integer',
    min: 0
  },
  replyCount: {
    type: 'integer',
    min: 0
  },
  histories: {
    type: 'array',
    typeof: shortRateModel
  }
};
export interface Rates {
  id?: string;
  author?: string;
  rate?: number;
  rates?: number[];
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  histories?: ShortRate[];
  authorURL?: string;
}
export interface ShortRate {
  rates: number[];
  time: Date;
  review: string;
}

export interface RateCriteriaFilter extends Filter {
  id?: string;
  author?: string;
  rates?: number[];
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}

export class RatesFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  id?: string;
  author?: string;
  rates?: number[];
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
}