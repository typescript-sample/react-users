import { HttpRequest } from "./comment";
import { Comment, CommentService } from "./comment";
import { CommentFilter } from "./comment";
export * from "./comment"
export class CommentClient implements CommentService {
    constructor(protected http: HttpRequest, private url: string) {
        this.getComments = this.getComments.bind(this)
        this.comment = this.comment.bind(this)
        this.delete = this.delete.bind(this)
        this.update = this.update.bind(this)
    }
    update(commentId: string, comment: Comment): Promise<number> {
        return this.http.put<number>(this.url + `/reply/${commentId}`, comment)
    }
    comment(id: string, author: string, commentThreadId: string, comment: Comment): Promise<string> {
        return this.http.post<string>(this.url + `/${id}/${author}/reply/${commentThreadId}`, comment);
    }
    getComments(commentThreadId: string, userId?:string): Promise<Comment[]> {        
        let obj:CommentFilter = {}
        if(userId) obj.userId = userId
        return this.http.post<Comment[]>(this.url + `/${commentThreadId}/reply`,obj)
    }
    delete(commentThreadId: string, commentId: string): Promise<number> {
        return this.http.delete<number>(this.url + `/${commentThreadId}/reply/${commentId}`)
    }
}