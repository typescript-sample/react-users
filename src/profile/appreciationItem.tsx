import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { Appreciation } from "./service/appreciation";
import "../rate.css";
import { handleAppend, OnClick } from "react-hook-core";
import { Comment, CommentItem, Rate } from "../review";
import { storage } from "uione";
import { useAppreciationComment } from "./service";
import ReactModal from "react-modal";
import { customStyles } from './appreciations';
import { HistoryAppreciation } from "./history-appreciation";
export interface Props {
  id: string,
  userId: string,
  data: Appreciation,
  resource: any,
  setIsOpenModal: any;
  setIsEdit: any;
  isEdit: boolean;
}

export const AppreciationItem = (props: Props) => {
  const { id, userId, data, resource , setIsOpenModal, setIsEdit, isEdit} = props;
  const [more, setMore] = useState<boolean>(false);
  const maxLengthReviewText = 300;
  const [isShowComment, setIsShowComment] = useState<boolean>(false);
  const [isReplies, setIsReplies] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [comment, setComment] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(data.replyCount ? data.replyCount : 0);
  const commentService = useAppreciationComment();
  const [isOpenModalHistory, setIsOpenModalHistory] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  
 
  
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

  const loadComments = async (e: OnClick, data: Rate) => {
    const cmt = await commentService.search(id, String(data.author));
    setComment(cmt.list);
  };

  const createComment = async (e: OnClick, rate: Rate, input: any) => {
    const author = rate.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    const comment: Comment = {
      comment: input,
      time: new Date(),
    };
    const rs = await commentService.comment(id, author, userId, comment);
    if (rs) {
      storage.message("Your review is submited");
      setInput("");
      setCommentCount(commentCount + 1);
      setIsReplies(false);
      setIsShowComment(true);
      loadComments(e, data);
    }
  };

  const updateComment = async (e: OnClick, input: any, comment: Comment) => {
    if (comment.userId !== userId) {
      return storage.alert("...");
    } else {
      const commentId = comment.commentId || "";
      const author = comment.author || "";
      const newComment: Comment = {
        comment: input,
        time: new Date(),
      };
      await commentService.updateComment(id, author, userId, commentId, newComment);
      loadComments(e, comment);
    }
  };

  const removeComment = async (e: OnClick, comment: Comment) => {
    const commentId = comment.commentId || "";
    const author = comment.author || "";
    await commentService.removeComment(id, author, commentId).then((res: any) => {
      if (res > 0) {
        storage.message("Removed successfully!");
        setCommentCount(commentCount - 1);
        loadComments(e, comment);
      }
    });
  };

  const handleEdit = () => {
    props.setIsOpenModal(true);
    setIsEdit(true);
  }
  useEffect(() => {
    handleShowActions();
  }, []);

  const handleShowActions = () => {
    if (userId === data.author) {
      setShowActions(!showActions)
    }
  }

  return (
    <>
      <li className="row review-custom">
        <div className="row rate-area">
          <section className="avatar">
            {data.authorURL ?
              <img src={data.authorURL ? data.authorURL : ""} alt="" className="img" />
              : <FontAwesomeIcon icon={faUserCircle} size="3x" color="lightgrey" />}
          </section>
          <section className="appre-card">
            <div className="content">
              <div className="header">
                <p>{moment(data.time).format("DD/MM/YYYY")}</p>
                {showActions ?
                  <div className="tools">
                    <div className='tool-section-bar'>
                      <div onClick={() => handleEdit()}><span className='material-icons-outlined'>edit</span>
                      </div>
                      <div onClick={() => setIsOpenModalHistory(!isOpenModalHistory)} ><span className='material-icons-outlined'>history</span>
                      </div>

                    </div>
                  </div>
                  : null}

              </div>
              {more ? <span>{data.review}</span> : formatReviewText(data.review ?? "")}


              <div className="right">
                {commentCount !== 0 && (
                  <span
                    className="btn-reply"
                    onClick={(e) => {
                      loadComments(e, data);
                      setIsShowComment(!isShowComment);
                    }}
                  >
                    {commentCount === 1
                      ? isShowComment
                        ? "Hide Comment"
                        : `Show 1 comment`
                      : isShowComment
                        ? "Hide comments"
                        : `Show ${commentCount} comments`}
                  </span>
                )}
                <span className="btn-reply" onClick={() => setIsReplies(!isReplies)}>
                  Replies
                </span>
              </div>
            </div>
          </section>
        </div>

        {isShowComment &&
          comment &&
          comment.length > 0 &&
          comment.map((cmt: Comment) => {
            return (
              <CommentItem
                key={cmt.commentId}
                cmt={cmt}
                userId={userId}
                removeComment={removeComment}
                updateComment={updateComment}
              />
            );
          })}

        {isReplies && (
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
                  <span className="btn-post" onClick={() => setIsReplies(!isReplies)}>
                    Cancel
                  </span>
                  <span
                    className={input.length > 0 ? "btn-post value" : "btn-post"}
                    onClick={(e) => createComment(e, data, input)}
                  >
                    Post
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <ReactModal
          isOpen={isOpenModalHistory}
          style={customStyles}
          onRequestClose={() => setIsOpenModalHistory(false)}
          contentLabel='Modal'
          portalClassName='modal-portal'
          className='modal-portal-content small-width'
          bodyOpenClassName='modal-portal-open'
          overlayClassName='modal-portal-backdrop'>
          <HistoryAppreciation data={data?.histories ?? []} closeModal={() => setIsOpenModalHistory(false)} />
        </ReactModal>
      </li >
    </>
  )
}