import { Attributes } from "onecore"

export interface CommentReaction {
    commentId: string
    author: string
    userId: string
    time: Date
    reaction: number
}
export interface CommentReactionService {
    setUseful(commentId: string, author: string, userId: string, ctx?: any): Promise<number>
    removeUseful(commentId: string, author: string, userId: string, ctx?: any): Promise<number>
}
export const commentReactionModel: Attributes = {
    commentId: {
        key: true,
        match: 'equal'
    },
    author: {
        key: true,
        match: 'equal'
    },
    userId: {
        key: true,
        match: 'equal'
    },
    time: {
        type: 'datetime'
    },
    reaction: {
        type: 'integer'
    }
}