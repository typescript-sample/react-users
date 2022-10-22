import { Attributes, Filter, SearchService, Tracking } from 'onecore';


export interface Rate extends Tracking {
  id?: string;
  author?: string;
  authorURL?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}

export class RateFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  id?: string;
  author?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
  pageSize?: number;
  pageIndex?: number;
  page?: number;
}

export interface RateService extends SearchService<Rate, RateFilter> {
  rate(id: string, author: string, obj: Rate, ctx?: any): Promise<boolean>;
}

export const rateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 10
  },
  time: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
  usefulCount: {
    type: 'integer'
  }
}
