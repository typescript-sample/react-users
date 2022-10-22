import moment from "moment";
import { useState } from "react";
import { faUserCircle, faPencil, faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "./client";
import "../rate.css";

interface Props {
  cmt: Comment;
  userId: string;
  removeComment: any;
  updateComment: any;
}

export const CommentItem = ({ cmt, userId, removeComment, updateComment }: Props) => {
  const [showActions, setShowActions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(cmt.comment || "");

  return (
    <>
      <div className="comments-container">
        <div className="comments2">
          <div className="avatar">
            {cmt.userURL ? <img src={cmt.userURL ? cmt.userURL : ""} alt="" className="img" /> : <FontAwesomeIcon icon={faUserCircle} size="3x" color="lightgrey" />}
          </div>
          <div className="content">
            <div className="header">
              <p className="username">Anonymous</p>
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
              <p className="comment">{comment}</p>
            )}
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
                  <div className="btn-delete-comment" onClick={(e) => removeComment(e, cmt)}>
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
    </>
  );
};
