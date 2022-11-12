import { Attributes } from "onecore"

export interface CommentThreadReply {
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

export interface CommentThreadReplyFilter {
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

export interface CommentThreadReplyService {
    getReplyComments(commentThreadId: string, userId?:string): Promise<CommentThreadReply[]>;
    reply(id: string, author: string, commentThreadId: string, commentThreadReply: CommentThreadReply): Promise<string>;
    removeComment(commentThreadId: string, commentId: string): Promise<number>
    updateComment(commentId:string,commentThreadReply: CommentThreadReply):Promise<number>
}

const commentThreadReplyHistoryModel: Attributes = {
    comment: {

    },
    time: {
        type: 'datetime'
    },
}

export const commentThreadReplyModel: Attributes = {
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
        typeof: commentThreadReplyHistoryModel
    }

}