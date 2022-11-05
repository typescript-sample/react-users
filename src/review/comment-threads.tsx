import { OnClick } from "react-hook-core";
import { storage, StringMap } from "uione";
import { CommentThreadItem } from "./comment-thread-item";
import "../rate.css";
import { useEffect, useState } from "react";
import { CommentThread, CommentThreadService } from "./client/commentthread";
import { CommentThreadReplyService } from "./client";

export interface Props {
  id: string;
  list: CommentThread[];
  commentThreadService: CommentThreadService;
  commentThreadReplyService: CommentThreadReplyService;
  resource: StringMap;
  userId: string;
}

export const CommentThreadComponent = ({ list, resource, id, commentThreadService, commentThreadReplyService, userId }: Props) => {
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>(list);
  const loadComments = async (e: OnClick, id: string) => {
    //const cmt = await commentService.getComments(id, String(data.author));
    const cmt = await commentThreadService.search({ id: id });
    setCommentThreads(cmt.list);
  };
  useEffect(() => {
    const load = async () => {
      const cmt = await commentThreadService.search({ id: id });
      setCommentThreads(cmt.list);

    }
    load()
  }, [list])
  const updateCommentThread = async (e: OnClick, input: string, comment: CommentThread) => {
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

    const res = await commentThreadService.updateComment(comment.commentId, newComment);
    if (res === -1) {
      return storage.alert("Error")
    }
    await loadComments(e, id);
    return storage.message("submited successfully")
  };
  const removeCommentThread = async (e: OnClick, commentId: string) => {
    if (commentId === null || commentId === undefined || commentId.length === 0) return storage.alert("...")
    const res = await commentThreadService.removeComment(commentId)
    if (res < 0) {
      return storage.alert("Error")
    }
    await loadComments(e, id);
    return storage.message("submited successfully")

  }
  return (
    <>
      <ul className="row list-view">
        {
          commentThreads && commentThreads.length > 0 && commentThreads.map((i: any) => {
            return (
              <CommentThreadItem disable userId={userId} key={i.time} commentThreadService={commentThreadService} commentThreadReplyService={commentThreadReplyService} resource={resource} data={i} id={id} updateCommentThread={updateCommentThread} removeCommentThread={removeCommentThread} />
            )
          })
        }
      </ul>
    </>
  )
}