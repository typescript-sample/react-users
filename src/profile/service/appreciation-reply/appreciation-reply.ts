import { Attributes, Service, Filter } from 'onecore';
import { Appreciation, AppreciationFilter, Useful } from '../appreciation/appreciation';

export class ReplyFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
  id?: string;
  author?: string;
  comment?: string;
  time?: Date;
  updateAt?: Date;
  userId?: string;
  commentId?: string;
}

export interface Reply {
  id: string;
  author: string;
  comment: string;
  time?: Date;
  updateAt?: Date;
  userId: string;
  commentId?: string;
  userURL?:string
}

export interface Result<T> {
  value: T;
  status: number;
}

export interface ReplyService extends Service<Reply, string, ReplyFilter> {
  insertReply: (obj: Appreciation) => Promise<Result<Appreciation>>;
  usefulAppreciation(obj: Useful): Promise<number>;
}
export const appreciationModel: Attributes = {
  id: {
    key: true,
    required: true,
    length: 40,
  },
  userId: {
    required: true,
    q: true
  },
  author: {
    required: true,
    q: true
  },
  review: {
    length: 255,
    q: true
  },
  time: {
    type: 'datetime',
    q: true
  },
};
