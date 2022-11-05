import { Attributes, Filter, SearchService, Tracking } from "onecore";

export interface CommentThread extends Tracking {
  commentId: string;
  id?: string;
  author?: string;
  userId?: string;
  comment: string;
  time: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
  userURL?: string;
  authorURL?: string;
  replyCount?: number;
  usefulCount?: number;
  authorName?:string;
}

export interface ShortComment {
  comment: string;
  time: Date;
}

export interface CommentThreadService extends SearchService<CommentThread, CommentThreadFilter> {
  comment(id: string, author: string, comment: CommentThread, ctx?: any): Promise<number>;
  updateComment(commentid: string, newComment: CommentThread, ctx?: any): Promise<number>;
  removeComment(commentid: string, ctx?: any): Promise<number>;
}

export interface CommentThreadFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  comment?: string;
  time?: Date;
}
export const commentThreadHistoryModel: Attributes = {
  comment: {

  },
  time: {
    type: 'datetime'
  },
}
export const commentThreadModel: Attributes = {
  commentid: {
    key: true,
    required: true,
    match: 'equal'
  },
  id: {
    required: true,
  },
  author: {
    required: true
  },
  userId: {
  },
  comment: {

  },
  time: {
    type: 'datetime'
  },
  histories: {
    type: 'array',
    typeof: commentThreadHistoryModel
  }
}