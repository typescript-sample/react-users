import { Attributes, Filter } from 'onecore';

export interface Useful {
  id?: string;
  author?: string;
  userId?: string;
  time?: Date;
}

export interface UsefulFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  time?: Date;
}

export interface ReactionService {
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}

export const usefulModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  time: {
    type: 'datetime',
  },
}

