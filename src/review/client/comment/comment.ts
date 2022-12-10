type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number
export interface HttpRequest {
    get<T>(url: string, options?: { headers?: Headers }): Promise<T>;
    delete<T>(url: string, options?: { headers?: Headers }): Promise<T>;
    post<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
    put<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
    patch<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  }
export interface Model {
  name?: string;
  attributes: Attributes;
  source?: string;
  table?: string;
  collection?: string;
  // for mongo lowcode
  sort?: string;
  geo?: string;
  latitude?: string;
  longitude?: string;
}

interface Attribute {
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
interface Attributes {
  [key: string]: Attribute;
}

export interface Comment {
    commentId: string
    id?: string
    author?: string
    commentThreadId?: string
    comment: string
    parent?: string
    time?: Date
    updatedAt?: Date
    Histories?: ShortComment[]
    authorURL?: string
    userURL?: string
    userId?: string
    replyCount?: number
    usefulCount?:number
    authorName?: string
    disable?:boolean    
}

export interface CommentFilter {
    commentId?: string
    id?: string
    author?: string
    userId?:string
    commentThreadId?: string
    comment?: string
    parent?: string
    time?: Date
    updatedAt?: Date
    Histories?: ShortComment[]
    authorURL?: string
    userURL?: string
}
interface ShortComment {
    comment?: string;
    time?: Date;
}

export interface CommentService {
    getComments(commentThreadId: string, userId?:string): Promise<Comment[]>;
    comment(id: string, author: string, commentThreadId: string, comment: Comment): Promise<string>;
    delete(commentThreadId: string, commentId: string): Promise<number>
    update(commentId:string,comment: Comment):Promise<number>
}

const commentHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}

export const commentModel: Attributes = {
    commentId: {
        key: true,
        column: "commentid"
    },
    id: {},
    commentThreadId: {
        column: "commentthreadid"
    },
    author: {},
    comment: {},
    time: {},
    parent: {},
    histories: {
        type: "array",
        typeof: commentHistoryModel
    }

}