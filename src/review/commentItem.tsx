import moment from "moment";
import { useState } from "react";
import { faUserCircle, faPencil, faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "./client";
import "../rate.css";
import { CommentThreadReply } from "./client/commentthreadreply";
import { storage } from "uione";
import { OnClick } from "react-hook-core";

interface Props {
  cmt: Comment | CommentThreadReply;
  userId: string;
  removeComment: any;
  updateComment: any;
  createComment?: (e: any, input: string, parent?: string) => Promise<number | void>;
  loadComments?: (commentThreadId?: string) => Promise<void>;
  commentThreadId?: string;
  isReplyEnable?: boolean;
}

export const CommentItem = ({ cmt, userId, isReplyEnable, removeComment, updateComment, createComment, loadComments, commentThreadId }: Props) => {
  const [showActions, setShowActions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(cmt.comment || "");
  const [isReply, setShowReply] = useState(false)
  const [input, setInput] = useState("")
  const handleRemoveComment = async (e: any, cmt: Comment | CommentThreadReply) => {
    if (isReplyEnable && loadComments) {
      await removeComment(e, cmt)
      setShowActions(false)
      loadComments(commentThreadId)

    } else {
      removeComment(e, cmt)
    }
  }
  const handleReplyComment = async (e: any, input: string, parent?: string) => {
    if (createComment && loadComments) {
      const res = await createComment(e, input, parent)
      if (res) {
        storage.message("your comment is submited")
        setInput("")
        setShowReply(false)
        loadComments(commentThreadId)
      }
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
                      onClick={(e) => {
                        updateComment(e, comment, cmt);
                        setIsEdit(false);
                      }}
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
