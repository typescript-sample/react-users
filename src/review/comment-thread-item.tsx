import { faEllipsisVertical, faPencil, faTrash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useState } from "react";
import { storage, StringMap } from "uione";
import "../rate.css";
import { OnClick } from "react-hook-core";
import { CommentThread, CommentThreadService } from "./client/commentthread";
import { CommentItem } from "./commentItem";
import { CommentThreadReply, CommentThreadReplyService } from "./client/commentthreadreply";
import like from "../assets/images/like.svg";
import likeFilled from "../assets/images/like_filled.svg";

export interface Props {
  disable: boolean
  userId: string
  id: string
  data: CommentThread
  commentThreadService: CommentThreadService
  commentThreadReplyService: CommentThreadReplyService
  resource: StringMap
  updateCommentThread: (e: OnClick, input: string, comment: CommentThread) => Promise<void>
  removeCommentThread: (e: OnClick, commentId: string) => Promise<void>
}
export const CommentThreadItem = ({ disable, id, resource, data, commentThreadReplyService, updateCommentThread, removeCommentThread, userId }: Props) => {
  // const maxLengthReviewText = 300;
  // const [more, setMore] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [commentThread, setCommentThread] = useState(data.comment || "");
  const [showActions, setShowActions] = useState(false)
  const [isShowComment, setShowComment] = useState(false)
  const [isReply, setShowReply] = useState(false)
  const [input, setInput] = useState("")
  const [replyCount, setReplyCount] = useState(data.replyCount || 0)
  const [replycomments, setReplyComments] = useState<CommentThreadReply[]>([])
  const [isDisable, setDisable] = useState(disable)
  const [likeCount, setLikeCount] = useState<number>(data.usefulCount || 0);

  // const formatReviewText = (text: string) => {
  //   if (text && text.length > maxLengthReviewText) {
  //     let textSub = text.substring(0, maxLengthReviewText);
  //     textSub = textSub + " ...";
  //     const a = (
  //       <span>
  //         {resource.review} {textSub}{" "}
  //         <span className="more-reviews" onClick={(e) => setMore(!more)}>
  //           More
  //         </span>
  //       </span>
  //     );
  //     return a;
  //   } else {
  //     return (
  //       <span>
  //         {resource.review} {text}
  //       </span>
  //     );
  //   }
  // };
  const loadComments = async (commentThreadId?: string) => {
    if (commentThreadId) {
      const res = await commentThreadReplyService.getReplyComments(commentThreadId)
      setReplyComments(res)
    }
  }
  const toggleComments = (commentThreadId?: string) => {
    loadComments(commentThreadId)
    setShowComment(!isShowComment)
  }
  const removeReplyComment = async (e: OnClick, comment: CommentThreadReply) => {
    e.preventDefault()
    const res = await commentThreadReplyService.removeComment(comment.commentThreadId, comment.commentId)
    if (res <= 0) {
      return storage.alert("error")
    }
    storage.message("delete comment submited")
    setReplyCount(replyCount - 1)
    loadComments(data.commentId)
    return res
  }
  const createComment = async (e: OnClick, input: string, parent?: string) => {
    e.preventDefault()
    if (!userId) {
      return storage.alert("You must sign in")
    }
    if (data && data.commentId) {
      const comment: CommentThreadReply = {
        comment: input,
        time: new Date(),
        parent: parent,
        commentId: "",
        commentThreadId: ""
      }
      return commentThreadReplyService.reply(id, userId, data.commentId, comment).then(res => {
        if (res > 0) {
          setReplyCount(replyCount + 1)
        }
        return res
      });
    }
  }
  const reply = async (e: OnClick, input: string) => {
    const rs = await createComment(e, input)
    if (rs) {
      storage.message("your comment is submited")
      setInput("")
      setReplyCount(replyCount + 1)
      setShowReply(false)
      setShowComment(true)
      loadComments(data.commentId)
    }
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
      time: new Date(),
      commentThreadId: ""
    };

    const res = await commentThreadReplyService.updateComment(comment.commentId, newComment);
    if (res <= 0) {
      return storage.alert("Error")
    }
    await loadComments(comment.commentThreadId);
    return storage.message("submited successfully")
  }
  const addUseful = (e:OnClick, data: CommentThread)=>{

  }

  const removeUseful = (e:OnClick, data:CommentThread)=>{

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
                <p className="comment">{data.comment}</p>
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
                    <span className="btn-reply" onClick={() => toggleComments(data.commentId)}>
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

        {isShowComment && replycomments && replycomments.map((item, index) =>
          (<CommentItem key={index} isReplyEnable cmt={item} userId={userId} removeComment={removeReplyComment} updateComment={updateComment} createComment={createComment} loadComments={loadComments} commentThreadId={item.commentThreadId} />)
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