import { HttpRequest } from "axios-core";
import { SearchWebClient } from "web-clients";
import { CommentThread, CommentThreadFilter, commentThreadModel, CommentThreadService } from "./commentthread";
export * from "./commentthread"
export class CommentThreadClient extends SearchWebClient<CommentThread, CommentThreadFilter> implements CommentThreadService {
  constructor(protected http: HttpRequest, protected serviceUrl: string) {
    super(http, serviceUrl, commentThreadModel)
    this.searchGet = false
    this.search = this.search.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.comment = this.comment.bind(this)
    this.removeComment = this.removeComment.bind(this)
  }
  removeComment(commentid: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/${commentid}`
    return this.http.delete(url,ctx)
  }
  updateComment(commentid: string, newCommentThread: CommentThread,ctx?:any): Promise<number> {
    const url = `${this.serviceUrl}/${commentid}`
    return this.http.put(url, newCommentThread, ctx)
  }
  comment(id: string, author: string, comment:CommentThread,ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/${id}/${author}`;
    return this.http.post(url, comment, ctx)
  }
  postOnly(s: CommentThreadFilter): boolean {
    return true;
  }

}