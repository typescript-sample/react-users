import { CommentThread, CommentThreadService, HttpRequest } from "./commentthread";
export * from "./commentthread"
export class CommentThreadClient implements CommentThreadService {
  constructor(protected http: HttpRequest, protected serviceUrl: string) {
    this.update = this.update.bind(this)
    this.comment = this.comment.bind(this)
    this.delete = this.delete.bind(this)
  }
  delete(commentid: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/${commentid}`
    return this.http.delete(url, ctx)
  }
  update(commentid: string, newCommentThread: CommentThread, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/${commentid}`
    return this.http.put(url, newCommentThread, ctx)
  }
  comment(id: string, author: string, comment: CommentThread, ctx?: any): Promise<string> {
    const url = `${this.serviceUrl}/${id}/${author}`;
    return this.http.post(url, comment, ctx)
  }
}