import moment from "moment";
import { useState } from "react";
import { faUserCircle, faPencil, faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment, CommentReactionService } from "reaction-client";
import "../rate.css";
import { CommentThreadReply } from "./client/commentthreadreply";
import { handleError, storage } from "uione";
import { OnClick } from "react-hook-core";
import like from "../assets/images/like.svg";
import likeFilled from "../assets/images/like_filled.svg";

interface Props {
  cmt: Comment | CommentThreadReply;
  userId: string;
  removeComment: any;
  updateComment: any;
  disable?: boolean
  commentReactionService?: CommentReactionService
  createComment?: (e: any, input: string, parent?: string) => Promise<void>;
  loadComments?: (commentThreadId?: string) => Promise<void>;
  commentThreadId?: string;
  isReplyEnable?: boolean;
  isUsefulEnable?: boolean;

}

export const CommentItem = ({ isUsefulEnable, commentReactionService, disable, cmt, userId, isReplyEnable, removeComment, updateComment, createComment,commentThreadId }: Props) => {
  const [isDisable, setIsDisable] = useState(disable)
  const [likeCount, setLikeCount] = useState<number>(cmt.usefulCount || 0);
  const [showActions, setShowActions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(cmt.comment || "");
  const [isReply, setShowReply] = useState(false)
  const [input, setInput] = useState("")

  const handleUpdateComment = (e:any, newComment:string, cmt:CommentThreadReply | Comment)=>{
    updateComment(e,newComment,cmt).then(()=>{
      setComment(newComment)
      setIsEdit(false);
    })
    

  }
  const handleRemoveComment = async (e: any, cmt: Comment | CommentThreadReply) => {
    if (isReplyEnable) {
      removeComment(e, commentThreadId, cmt.commentId).then(()=>{
        setShowActions(false)
      })
    } else {
      removeComment(e, cmt)
    }
  }
  const handleReplyComment = async (e: any, input: string, parent?: string) => {
    if (createComment) {
      createComment(e, input, parent).then(() => {
        storage.message("your comment is submited")
        setInput("")
        setShowReply(false)
      }).catch(err => {
        return storage.message(err)
      })
    }
  }

  const addUseful = (e: OnClick, data: Comment | CommentThreadReply) => {
    const author = data.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    if (data.commentId && commentReactionService && isUsefulEnable) {
      commentReactionService.setUseful(data.commentId, author, userId).then(res => {
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

  }

  const removeUseful = (e: OnClick, data: Comment | CommentThreadReply) => {
    const author = data.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    if (data.commentId && commentReactionService && isUsefulEnable) {
      commentReactionService.removeUseful(data.commentId, author, userId).then(res => {
        if (res <= 0) {
          return storage.alert("error")
        }
        setIsDisable(!isDisable);
        setLikeCount(likeCount - 1);
      }).catch(err => {
        handleError(err)
      });
    }
  }
  return (
    <>
      <div className="comments-container">
        <div className="comments2">
          <div className="avatar">
            {cmt.userURL ? <img src={cmt.userURL ? cmt.userURL : ""} alt="" className="img" /> : <FontAwesomeIcon icon={faUserCircle} size="3x" color="lightgrey" />}
          </div>
          <div className="content">
            <div className="header">
              <p className="username">{cmt.authorName || 'Anonymous'}</p>
              <p className="time">{moment(cmt.time).format("DD/MM/YYYY")}</p>
            </div>
            {isEdit ? (
              <div className="post-comment-container">
                <div className="post-comment">
                  <textarea
                    placeholder="Type comment here..."
                    className="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="btn-area">
                    <span className="btn-post" onClick={() => setIsEdit(false)}>
                      Cancel
                    </span>
                    <span
                      className={comment.length > 0 ? "btn-post value" : "btn-post"}
                      onClick={(e) => handleUpdateComment(e, comment, cmt)}
                    >
                      Save
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="comment">{cmt.parent ? <a href={cmt.authorName}>@{cmt.authorName}</a> : ""} {comment}</p>
            )}
            <div className="footer">
              <div className="left">
                {isUsefulEnable && <>
                  {isDisable ? (
                    <img
                      alt=""
                      className="useful-button"
                      width={20}
                      src={likeFilled}
                      onClick={(e) => removeUseful(e, cmt)}
                    />
                  ) : (
                    <img alt="" className="useful-button" width={20} src={like} onClick={(e) => addUseful(e, cmt)} />
                  )}
                  {likeCount}
                </>}
              </div>
              <div className="right">
                {isReplyEnable && cmt.author && (<span className="btn-reply" onClick={() => setShowReply(!isReply)}>Replies</span>)}
              </div>
            </div>
          </div>
          {cmt.userId === userId && (
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
                  <div className="btn-delete-comment" onClick={(e) => handleRemoveComment(e, cmt)}>
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
      {isReply && isReplyEnable && cmt.author && (
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
                  onClick={(e) => handleReplyComment(e, input, cmt.author)}
                >
                  Post
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
