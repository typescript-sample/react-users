import { HttpRequest } from "axios-core";
import { CommentReactionService } from "./commentreaction";
export * from "./commentreaction"
export class CommentReactionClient implements CommentReactionService {
    constructor(protected http: HttpRequest, protected url: string) {
        this.setUseful = this.setUseful.bind(this);
        this.removeUseful = this.removeUseful.bind(this);
    }

    setUseful(
        commentId: string,
        author: string,
        userId: string,
        ctx?: any
    ): Promise<number> {
        const url = `${this.url}/${commentId}/${author}/useful/${userId}`;
        return this.http.post(url, {}, ctx);
    }

    removeUseful(
        commentId: string,
        author: string,
        userId: string,
        ctx?: any
    ): Promise<number> {
        const url = `${this.url}/${commentId}/${author}/useful/${userId}`;
        return this.http.delete(url, ctx);
    }

}
