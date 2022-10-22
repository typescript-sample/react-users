import { Attributes, Filter, Service } from 'onecore';
import { Result } from 'web-clients';
import { Reply } from '../appreciation-reply';

export class AppreciationFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  id?: string;
  author?: string;
  title?: string;
  review?: string;
  createAt?: Date;
  replyCount?: number;
  userId?: string;
  limit?: number;
  pageSize?: number;
  pageIndex?: number;
  page?: number;
}

export interface AppreciationId {
  id: string;
  author: string;
}
export interface Appreciation {
  id: string;
  author: string;
  // title?: string;
  review?: string;
  time?: Date;
  updateAt?:Date;
  histories?: Histories[];
  replyCount:number;
  usefulCount?:number
  authorURL?:string
}

export interface Histories {
  time: Date;
  review: string;
  // title:string;
}

export interface Useful {
  id?: string;
  updatedAt?: Date|string;
  createdAt?: Date|string;
  userId: string;
  appreciationId: string;
  histories:Histories[]
}
export interface AppreciationService extends Service<Appreciation, AppreciationId, AppreciationFilter> {
  reply(reply: Appreciation): Promise<number>;
  comment(reply: Reply): Promise<boolean>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  getReplys(id: string, author: string, ctx?: any): Promise<Result<Reply>>;
  updateReply(reply: Reply): Promise<number>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  appreciation(obj: Appreciation): Promise<number>
}
export const appreciationModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  author: {
    required: true,
    length: 255,
  },
  title: {
    length: 255
  },
  review: {
    length: 255
  },
  createAt: {
    type: 'datetime'
  },
  histories:{

  }
};
