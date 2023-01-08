export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
export type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number
export interface SearchResult<T> {
  list: T[];
  total?: number;
  last?: boolean;
  nextPageToken?: string;
}
export interface Tracking {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export interface SearchService<T, F extends Filter> {
  keys?(): string[];
  search(s: F, limit?: number, offset?: number|string, fields?: string[], ctx?: any): Promise<SearchResult<T>>;
}
export interface Filter {
  page?: number;
  limit?: number;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;

  q?: string;
  keyword?: string;
  excluding?: string[]|number[];
  refId?: string|number;

  pageIndex?: number;
  pageSize?: number;
}
export interface Attribute {
  name?: string;
  field?: string;
  column?: string;
  type?: DataType;
  format?: FormatType;
  required?: boolean;
  match?: MatchType;
  default?: string|number|Date|boolean;
  key?: boolean;
  unique?: boolean;
  enum?: string[] | number[];
  q?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  nopatch?: boolean;
  version?: boolean;
  length?: number;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  precision?: number;
  scale?: number;
  exp?: RegExp | string;
  code?: string;
  noformat?: boolean;
  ignored?: boolean;
  jsonField?: string;
  link?: string;
  typeof?: Attributes;
  true?: string|number;
  false?: string|number;
}
export interface Attributes {
  [key: string]: Attribute;
}
export interface CommentThread extends Tracking {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
  userURL?: string;
  parent?:string;
  replyCount?: number;
  usefulCount?: number;
  authorName?: string;
  disable?:boolean;
}

export interface ShortComment {
  comment: string;
  time: Date;
}
export interface HttpRequest {
  get<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  delete<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  post<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  put<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  patch<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
}
export  interface SearchCommentThreadService extends SearchService<CommentThread, CommentThreadFilter>{}
export interface CommentThreadService{
  comment(id: string, author: string, comment: string, ctx?: any): Promise<string>;
  update(commentid: string, newComment: string, ctx?: any): Promise<number>;
  delete(commentid: string, ctx?: any): Promise<number>;
}

export interface CommentThreadFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  comment?: string;
  time?: Date;
  authorURL?: string;
  userId?:string;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
}
export const commentThreadHistoryModel: Attributes = {
  comment: {

  },
  time: {
    type: 'datetime'
  },
}
export const commentThreadModel: Attributes = {
  commentId: {
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
  },
  userURL:{
    column:'authorURL'
  }
}