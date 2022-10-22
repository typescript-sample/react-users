import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface CommentFilter extends Filter {
  id?: string;
  author?: string;
}
export interface Comment extends Tracking{
  id: string;
  author: string;
  comment: string;
  createdat?: string;
}

export interface CommentService extends Service<Comment, string, CommentFilter> {
}

export const commentModel: Attributes = {
  id: {
    key: true,
    required: true,
    q: true
  },
  author: {
    required: true,
    q: true
  },
  comment: {
  },
  createdAt: {
    type: 'datetime'
  }
};




