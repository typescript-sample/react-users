import { faEllipsisVertical, faPencil, faTrash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { handleError, storage, StringMap } from "uione";
import "../rate.css";
import { OnClick } from "react-hook-core";
import { CommentThread, CommentThreadService } from "./client/commentthread";
import { CommentItem } from "./commentItem";
import { CommentThreadReply, CommentThreadReplyService } from "./client/commentthreadreply";
import like from "../assets/images/like.svg";
import likeFilled from "../assets/images/like_filled.svg";
import { CommentReactionService } from "./client";

export interface Props {
  disable: boolean
  userId: string
  data: CommentThread
  id: string
  commentThreadService: CommentThreadService
  commentThreadReplyService: CommentThreadReplyService
  commentThreadReactionService: CommentReactionService
  commentReactionService: CommentReactionService
  resource: StringMap
  updateCommentThread: (e: OnClick, input: string, comment: CommentThread) => Promise<void>
  removeCommentThread: (e: OnClick, commentId: string) => Promise<void>
}
export const CommentThreadItem = ({ disable = false, resource, id, data, commentReactionService, commentThreadReactionService, commentThreadReplyService, updateCommentThread, removeCommentThread, userId }: Props) => {
  const maxLengthReviewText = 300;
  const [more, setMore] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [commentThread, setCommentThread] = useState(data.comment || "");
  const [showActions, setShowActions] = useState(false)
  const [isShowComment, setShowComment] = useState(false)
  const [isReply, setShowReply] = useState(false)
  const [input, setInput] = useState("")
  const [replyCount, setReplyCount] = useState(data.replyCount || 0)
  const [replycomments, setReplyComments] = useState<CommentThreadReply[]>([])
  const [isDisable, setIsDisable] = useState<boolean>(disable)
  const [likeCount, setLikeCount] = useState<number>(data.usefulCount || 0);
  useEffect(() => {
    commentThreadReplyService.getReplyComments(data.commentId, userId).then(res => {
      setReplyComments(res)
    })
  }, [])

  const formatReviewText = (text: string) => {
    if (text && text.length > maxLengthReviewText) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + " ...";
      const a = (
        <span>
          {resource.review} {textSub}{" "}
          <span className="more-reviews" onClick={(e) => setMore(!more)}>
            More
          </span>
        </span>
      );
      return a;
    } else {
      return (
        <span>
          {resource.review} {text}
        </span>
      );
    }
  };

  const removeReplyComment = async (e: OnClick, commentThreadId: string, commentId: string) => {
    e.preventDefault()
    const res = await commentThreadReplyService.removeComment(commentThreadId, commentId)
    if (res <= 0) {
      return storage.alert("error")
    }
    storage.message("delete comment submited")
    setReplyCount(replyCount - 1)
    const newReplies = replycomments.filter(item => item.commentId !== commentId)    
    setReplyComments(newReplies)
    return res
  }

  const createComment = async (e: OnClick, input: string, parent?: string) => {
    e.preventDefault()

    const comment: CommentThreadReply = {
      comment: input,
      time: new Date(),
      parent: parent,
      commentId: "",
      commentThreadId: data.commentId,
    }
    return commentThreadReplyService.reply(id, userId, data.commentId, comment).then(res => {
      comment.commentId = res
      comment.userId = userId
      comment.author = userId
      const user = storage.user()
      comment.authorName = user && user.username ? user.username : "anonymous"
      setReplyComments([...replycomments, comment])
      setReplyCount(replyCount + 1)
    });

  }
  const reply = async (e: OnClick, input: string) => {
    if (!userId) {
      return storage.alert("You must sign in")
    }
    createComment(e, input).then(() => {
      storage.message("your comment is submited")
      setInput("")
      setShowReply(false)
      setShowComment(true)

    }).catch(err => {
      return storage.alert(err)
    })

  }
  const updateComment = async (e: OnClick, input: string, comment: CommentThreadReply) => {
    if (comment.author !== userId) {
      return storage.alert("...");
    }
    if (comment.commentId == null || comment.commentId.length <= 0) {
      return storage.alert("...")
    }
    const newComment: CommentThreadReply = {
      commentId: comment.commentId,
      comment: input,
      updatedAt: new Date(),
    };

    const res = await commentThreadReplyService.updateComment(comment.commentId, newComment);
    if (res <= 0) {
      return storage.alert("Error")
    }

    newComment.Histories = newComment.Histories && newComment.Histories.length > 0 ?
      [...newComment.Histories, { comment: comment.comment, time: comment.updatedAt ?? comment.time }]
      : [{ comment: comment.comment, time: comment.updatedAt ?? comment.time }]

    return storage.message("submited successfully")
  }
  const addUseful = (e: OnClick, data: CommentThread) => {
    const author = data.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    commentThreadReactionService.setUseful(data.commentId, author, userId).then(res => {
      if (res <= 0) {
        return storage.alert("error")
      } else {
        setIsDisable(!isDisable);
        setLikeCount(likeCount + 1);
      }
    }).catch(err => {
      handleError(err)
    });
  }

  const removeUseful = (e: OnClick, data: CommentThread) => {
    const author = data.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    commentThreadReactionService.removeUseful(data.commentId, author, userId).then(res => {
      if (res <= 0) {
        return storage.alert("error")
      }
      setIsDisable(!isDisable);
      setLikeCount(likeCount - 1);
    }).catch(err => {
      handleError(err)
    });

  }

  return (

    <li className="row review-custom">
      <>
        <div className="comments-container" style={{ justifyContent: "flex-start" }}>
          <div className="comments2" style={{ width: "100%" }}>
            <div className="avatar">
              {data.authorURL ? <img src={data.authorURL ? data.authorURL : ""} alt="" className="img" /> : <FontAwesomeIcon icon={faUserCircle} size="3x" color="lightgrey" />}
            </div>
            <div className="content">
              <div className="header">
                <p className="username">{data.authorName || 'Anonymous'}</p>
                <p className="time">{moment(data.time).format("DD/MM/YYYY")}</p>
              </div>
              {isEdit ? (<div className="post-comment-container">
                <div className="post-comment">
                  <textarea
                    placeholder="Type comment here..."
                    className="comment"
                    value={commentThread}
                    onChange={(e) => setCommentThread(e.target.value)}
                  />
                  <div className="btn-area">
                    <span className="btn-post" onClick={() => setIsEdit(false)}>
                      Cancel
                    </span>
                    <span
                      className={commentThread.length > 0 ? "btn-post value" : "btn-post"}
                      onClick={(e) => {
                        updateCommentThread(e, commentThread, data);
                        setIsEdit(false);
                      }}
                    >
                      Save
                    </span>
                  </div>
                </div>
              </div>) : (
                <p className="comment">{formatReviewText(data.comment)}</p>
              )}
              <div className="footer">
                <div className="left">
                  {isDisable ? (
                    <img
                      alt=""
                      className="useful-button"
                      width={20}
                      src={likeFilled}
                      onClick={(e) => removeUseful(e, data)}
                    />
                  ) : (
                    <img alt="" className="useful-button" width={20} src={like} onClick={(e) => addUseful(e, data)} />
                  )}
                  {likeCount}
                </div>
                <div className="right">
                  {replyCount !== 0 && (
                    <span className="btn-reply" onClick={ replyCount > 0 ? () =>  setShowComment(!isShowComment) : ()=>{}}>
                      {isShowComment ? "Hide Comment" : `Show ${replyCount} Comment`}
                    </span>
                  )

                  }
                  <span className="btn-reply" onClick={() => { setShowReply(!isReply) }}>Replies</span>
                </div>
              </div>
            </div>
            {data.author === userId && (
              <>
                <div className="action" onClick={() => setShowActions(!showActions)}>
                  <span>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </span>
                </div>
                {showActions && (
                  <div className="actions">
                    <div
                      className="btn-edit-comment"
                      onClick={() => {
                        setIsEdit(true);
                        setShowActions(false);
                      }}
                    >
                      <p>
                        <FontAwesomeIcon icon={faPencil} color="grey" />
                      </p>
                      <span>Edit</span>
                    </div>
                    <div className="btn-delete-comment" onClick={(e) => { removeCommentThread(e, data.commentId || "") }}>
                      <p>
                        <FontAwesomeIcon icon={faTrash} color="grey" />
                      </p>
                      <span>Delete</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {isShowComment && replycomments && replycomments.map((item) =>
          (<CommentItem key={item.commentId} isReplyEnable isUsefulEnable cmt={item} userId={userId} removeComment={removeReplyComment} updateComment={updateComment} createComment={createComment} commentThreadId={item.commentThreadId} disable={item.disable} commentReactionService={commentReactionService} />)
        )}
        {isReply && (
          <div className="comments-container">
            <div className="post-comment-container">
              <div className="post-comment">
                <textarea
                  placeholder="Type comment here..."
                  className="comment"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="btn-area">
                  <span className="btn-post" onClick={() => setShowReply(false)}>
                    Cancel
                  </span>
                  <span
                    className={input.length > 0 ? "btn-post value" : "btn-post"}
                    onClick={(e) => reply(e, input)}
                  >
                    Post
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </li>
  )
}