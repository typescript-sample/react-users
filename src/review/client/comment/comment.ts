import { Attributes, Filter, SearchResult } from 'onecore';

export interface commentId {
  id?: string;
  author?: string;
}
export interface Comment {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  userURL?: string
  comment?: string;
  time?: Date;
}

export class CommentFilter implements Filter {
  commentId?: string;
  id?: string;
  author?: string;
  authorURL?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
}

export interface CommentService {
  search(id: string, author: string,  ctx?: any): Promise<SearchResult<Comment>>;
  getComments(id: string, author: string, ctx?: any): Promise<Comment[]>;
  getComment(id: string, author: string, commentId: string, ctx?: any): Promise<Comment>;
  comment(id: string, author: string, userId: string, comment: Comment, ctx?: any): Promise<boolean>;
  updateComment(id: string, author: string, userId: string, commentId: string, comment: Comment, ctx?: any): Promise<number>;
  removeComment(id: string, author: string, commentId: string, ctx?: any): Promise<number>;
}

export const commentModel: Attributes = {
  commentId: {
    key: true
  },
  id: {
    required: true,
    match: 'equal'
  },
  author: {
    required: true,
    match: 'equal'
  },
  userId: {
    required: true,
    match: 'equal'
  },
  comment: {},
  time: {
    type: 'datetime'
  }
};
