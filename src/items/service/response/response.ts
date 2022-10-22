import { Attributes, Filter, SearchService, Tracking } from 'onecore';

export interface Response extends Tracking {
  id?: string;
  author?: string;
  time?: Date;
  description?: string;
  usefulCount?: number;
  replyCount?: number;
}

export class ResponseFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  id?: string;
  author?: string;
  time?: Date;
  description?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
}

export interface ResponseService extends SearchService<Response, ResponseFilter> {
  response(id: string, author: string, obj: Response, ctx?: any): Promise<boolean>;
}

export const responseModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  time: {
    type: 'datetime',
  },
  description: {
    q: true,
  },
  usefulCount: {
    type: 'integer'
  }
}
