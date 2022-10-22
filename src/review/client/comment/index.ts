import { HttpRequest } from "axios-core";
import { SearchResult } from "onecore";
import {
  Comment,
  CommentFilter,
  commentModel,
  CommentService,
} from "./comment";

export * from "./comment";

export class CommentClient implements CommentService {
  constructor(protected http: HttpRequest, private url: string) {
    this.getComment = this.getComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.comment = this.comment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.search = this.search.bind(this);
  }

  search(id: string, author: string, ctx?: any): Promise<SearchResult<Comment>> {
    const url = `${this.url}/comments`;
    const newCmt: any = { id, author };
    return this.http.post(url, newCmt, ctx);
  }
  getComment(id: string, author: string, commentId: string, ctx?: any): Promise<Comment> {
    const url = `${this.url}/${id}/${author}/comments/${commentId}`;
    return this.http.get(url, ctx);
  }
  getComments(id: string, author: string, ctx?: any): Promise<Comment[]> {
    const url = `${this.url}/${id}/${author}/comments`;
    return this.http.get(url, ctx);
  }
  comment(id: string, author: string, userId: string, comment: Comment, ctx?: any): Promise<boolean> {
    const url = `${this.url}/${id}/${author}/comments/${userId}`;
    return this.http.post(url, comment, ctx);
  }
  updateComment(id: string, author: string, userId: string, commentId: string, comment: Comment, ctx?: any): Promise<number> {
    const url = `${this.url}/${id}/${author}/comments/${userId}/${commentId}`;
    return this.http.put(url, comment, ctx);
  }
  removeComment(id: string, author: string, commentId: string, ctx?: any): Promise<number> {
    const url = `${this.url}/${id}/${author}/comments/${commentId}`;
    return this.http.delete(url, ctx);
  }
}