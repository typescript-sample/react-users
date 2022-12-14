import { OnClick } from "react-hook-core";
import { storage, StringMap } from "uione";
import { CommentThreadItem } from "./comment-thread-item";
import "../rate.css";
import { useState } from "react";
import { CommentThread, CommentThreadService, ShortComment } from "./client/commentthread";
import {  CommentService } from "./client/comment/comment";
import {CommentReactionService} from "reaction-client"
export interface Props {
  user:any;
  id: string;
  list: CommentThread[];
  loadCommentThreads: any;
  commentThreadService: CommentThreadService;
  commentThreadReplyService: CommentService;
  commentThreadReactionService: CommentReactionService;
  commentReactionService: CommentReactionService
  resource: StringMap;
  userId: string;
}

export const CommentThreadComponent = ({ list, resource, id, commentThreadService, commentThreadReplyService, commentReactionService, commentThreadReactionService, userId }: Props) => {
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>(list);
  const updateCommentThread = async (e: OnClick, input: string, comment: CommentThread) => {
    if(!comment.comment  || !comment.time){
      return storage.alert("error")
    }
    if (comment.author !== userId) {
      return storage.alert("...");
    }
    if (comment.commentId == null || comment.commentId.length <= 0) {
      return storage.alert("...")
    }
    const newComment: CommentThread = {
      commentId: comment.commentId,
      comment: input,
      time: new Date(),
    };
    const res = await commentThreadService.update(comment.commentId, input);
    if(res<=0){
      return storage.alert("error")
    }
    const obj = [...commentThreads]
    const itemIndex = obj.findIndex(obj => obj.commentId === newComment.commentId)
    const shortComment :ShortComment = {
      comment:comment.comment,
      time:comment.time
    }
    obj[itemIndex].comment = newComment.comment
    obj[itemIndex].histories = newComment.histories && newComment.histories.length>0 ?[...newComment.histories,shortComment] : [shortComment]
    obj[itemIndex].updatedAt = newComment.updatedAt
    setCommentThreads(obj)
    return storage.message("submited successfully")
  };
  const removeCommentThread = async (e: OnClick, commentId: string) => {
    if (commentId === null || commentId === undefined || commentId.length === 0) return storage.alert("...")
    const res = await commentThreadService.delete(commentId)
    if (res <= 0) {
      return storage.alert("Error")
    }
    
    setCommentThreads(commentThreads.filter(item => item.commentId !== commentId))
    return storage.message("submited successfully")

  }
  return (
    <>

      <ul className="row list-view">
        {
          commentThreads && commentThreads.length > 0 && commentThreads.map((i: any) => {
            return (
              <CommentThreadItem
                id={id}
                disable={i.disable}
                userId={userId}
                key={i.time}
                commentThreadReactionService={commentThreadReactionService}
                commentThreadService={commentThreadService}
                commentThreadReplyService={commentThreadReplyService}
                commentReactionService={commentReactionService}
                resource={resource} data={i}
                updateCommentThread={updateCommentThread}
                removeCommentThread={removeCommentThread}
              />
            )
          })
        }
      </ul>
    </>
  )
}