import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import {
  Comment, CommentFilter, CommentService, commentModel
} from './comment';

export * from './comment';

export class CommentClient extends Client<Comment, string, CommentFilter> implements CommentService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, commentModel);
    // this.searchGet = true;
  }

  protected postOnly(s: Comment): boolean {
    return true;
  }

  
}