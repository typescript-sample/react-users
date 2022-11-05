import { HttpRequest } from "axios-core";
import { CommentThreadReply, CommentThreadReplyService } from "../commentthreadreply";
export * from "./commentThreadReply"
export class CommentThreadReplyClient implements CommentThreadReplyService {
    constructor(protected http: HttpRequest, private url: string) {
        this.getReplyComments = this.getReplyComments.bind(this)
        this.reply = this.reply.bind(this)
        this.removeComment = this.removeComment.bind(this)
        this.updateComment = this.updateComment.bind(this)
    }
    updateComment(commentId: string, commentThreadReply: CommentThreadReply): Promise<number> {
        return this.http.put<number>(this.url + `/reply/${commentId}`, commentThreadReply)
    }
    reply(id: string, author: string, commentThreadId: string, commentThreadReply: CommentThreadReply): Promise<number> {
        return this.http.post<number>(this.url + `/${id}/${author}/reply/${commentThreadId}`, commentThreadReply);
    }
    getReplyComments(commentThreadId: string): Promise<CommentThreadReply[]> {
        return this.http.get<CommentThreadReply[]>(this.url + `/${commentThreadId}/reply`)
    }
    removeComment(commentThreadId: string, commentId: string): Promise<number> {
        return this.http.delete<number>(this.url + `/${commentThreadId}/reply/${commentId}`)
    }
}