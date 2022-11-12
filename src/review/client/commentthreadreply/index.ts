import { HttpRequest } from "axios-core";
import { CommentThreadReply, CommentThreadReplyService } from "../commentthreadreply";
import { CommentThreadReplyFilter } from "./commentThreadReply";
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
    reply(id: string, author: string, commentThreadId: string, commentThreadReply: CommentThreadReply): Promise<string> {
        return this.http.post<string>(this.url + `/${id}/${author}/reply/${commentThreadId}`, commentThreadReply);
    }
    getReplyComments(commentThreadId: string, userId?:string): Promise<CommentThreadReply[]> {        
        let obj:CommentThreadReplyFilter = {}
        if(userId) obj.userId = userId
        return this.http.post<CommentThreadReply[]>(this.url + `/${commentThreadId}/reply`,obj)
    }
    removeComment(commentThreadId: string, commentId: string): Promise<number> {
        return this.http.delete<number>(this.url + `/${commentThreadId}/reply/${commentId}`)
    }
}