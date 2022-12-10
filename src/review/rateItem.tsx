import moment from "moment";
import { useEffect, useState } from "react";
import { StringMap, storage, handleError } from "uione";
import { OnClick } from "react-hook-core";
import like from "../assets/images/like.svg";
import likeFilled from "../assets/images/like_filled.svg";
import { Rate } from "web-clients";
import {Comment, ReactionService, CommentService} from "reaction-client"
import { CommentItem } from "./commentItem";
import "../rate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

interface Props {
  id: string;
  userId: string;
  user: any;
  rateRange: number;
  data: Rate;
  resource: StringMap;
  disable: boolean;
  reactionService: ReactionService;
  commentService: CommentService;
}

export const RateItem = ({ id, userId, user, data, resource, disable, rateRange, reactionService, commentService }: Props) => {
  const [isReplies, setIsReplies] = useState(false);
  const [isShowComment, setIsShowComment] = useState(false);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(data.replyCount || 0);
  const [likeCount, setLikeCount] = useState<number>(data.usefulCount || 0);
  const [isDisable, setIsDisable] = useState<boolean>(disable);

  const [more, setMore] = useState(false);
  const maxLengthReviewText = 300;
  useEffect(()=>{
    commentService.getComments(id,data.author ?? "")
    .then(res=>{
      setComments(res||[]);
    })
  },[])
  const renderReviewStar = (value: any) => {
    const starList = Array(rateRange)
      .fill(<i />)
      .map((item, index) => {
        return <i key={index}></i>;
      });
    const classes = Array.from(Array(value).keys())
      .map((i) => `star-${i + 1}`)
      .join(" ");
    return <div className={`rv-star2 ${classes}`}>{starList}</div>;
  };

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

  const addUseful = (e: OnClick, rate: Rate) => {
    const author = rate.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    reactionService.setUseful(id, author, userId);
    setIsDisable(!isDisable);
    setLikeCount(likeCount + 1);
  };

  const removeUseful = (e: OnClick, rate: Rate) => {
    const author = rate.author || "";
    if (!userId) {
      return storage.alert("You must sign in");
    }
    reactionService.removeUseful(id, author, userId);
    setIsDisable(!isDisable);
    setLikeCount(likeCount - 1);
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
    try{
    const rs = await commentService.comment(id, author, userId, comment);        
      storage.message("Your comment is submited");
      setInput("");
      setCommentCount(commentCount + 1);
      setIsReplies(false);
      setIsShowComment(true);
      comment.authorName = user.username
      comment.userId = userId
      comment.commentId = rs
      comment.author = author
      console.log(comments);
      
      setComments([...comments, comment])
  }catch(e){
    storage.alert("error")
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
      debugger
      commentService.update(id, author, userId, commentId, newComment)
        .then((res) => {
          if (res <= 0) {
            return storage.alert("error")
          }

          const updatedIndex = comments.findIndex(i => i.commentId === commentId)
          const newComments = [...comments]
          newComments[updatedIndex].comment = input
          setComments(newComments)
        })
        .catch((error) => {
          handleError(error)
        });
    }
  };

  const removeComment = async (e: OnClick, comment: Comment) => {
    
    const commentId = comment.commentId || "";
    const author = comment.author || "";
    await commentService.delete(id, author, commentId).then((res: any) => {
      if (res > 0) {
        storage.message("Removed successfully!");
        setCommentCount(commentCount - 1);

        setComments([...comments.filter(val => val.commentId !== comment.commentId)])
        return
      }
      return storage.alert("Error")
    });
  };

  return (
    <li className="row review-custom">
      <div className="row rate-area">
        <section className="avatar">
          {data.authorURL ? <img src={data.authorURL ? data.authorURL : ""} alt="" className="img" /> : <FontAwesomeIcon icon={faUserCircle} size="3x" color="lightgrey" />}
        </section>
        <section className="card">
          <p>{moment(data.time).format("DD/MM/YYYY")}</p>
          {renderReviewStar(data.rate)}
          {more ? <span>{data.review}</span> : formatReviewText(data.review ?? "")}
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
              {commentCount !== 0 && (
                <span
                  className="btn-reply"
                  onClick={() => setIsShowComment(!isShowComment)
                  }
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
        comments &&
        comments.length > 0 &&
        comments.map((cmt: Comment) => {
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
    </li>
  );
};
