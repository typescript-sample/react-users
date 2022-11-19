import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { OnClick } from 'react-hook-core';
import { storage, StringMap } from 'uione';
import { Comment } from 'reaction-client';
import { CommentItem } from './comment-item';
import { useComment } from './service';
import { Rates } from './service/rate/rate';
import moment from 'moment';
import like from '../assets/images/like.svg';
import likeFilled from '../assets/images/like_filled.svg';
import '../rate.css';


interface Props {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
  load: any;
  reactionService: any;
}
export const RateItem = ({ data, maxLengthReviewText, resource, load, reactionService }: Props) => {
  const userId: string | undefined = storage.getUserId() || '';
  const [isShowComment, setIsShowComment] = useState(false);
  const [isReplies, setIsReplies] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(data.replycount || 0);
  const [input, setInput] = useState('');
  const [comment, setComment] = useState<Comment[]>([]);
  const [more, setMore] = useState(false);
  const commentService = useComment();
  const rateCategories = ['Job Work/Life Balance', 'Compensation/Benefits', 'Job Security/Advancement', 'Management', 'Culture'];

  const formatReviewText = (text: string) => {
    if (text && text.length > maxLengthReviewText) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      const a = <span>{resource.review} {textSub} <span className='more-reviews' onClick={(e) => setMore(!more)}>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const addUseful = async (e: OnClick, rate: Rates) => {
    const id = rate.id || '';
    const author = rate.author || '';
    if (!userId) {
      return storage.alert("Please sign in");
    }
    await reactionService.setUseful(id, author, userId);
    await load();
  }

  const removeUseful = async (e: OnClick, rate: Rates) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    await reactionService.removeUseful(id, author, userId);
    await load();
  }

  const createComment = async (e: OnClick, rate: Rates, input: any) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return storage.alert('You must sign in');;
    }
    const comment: Comment = {
      comment: input,
      time: new Date(),
    };
    const rs = await commentService.comment(id, author, userId, comment);
    if (rs === false) {
      return;
    } else {
      storage.message('Your review is submited');
      setInput("");
      setCommentCount(commentCount + 1);
      setIsReplies(false);
      setIsShowComment(true);
      showComments(e, data.id, data.author);
    }
  }

  const showComments = async (e: OnClick, id: string, author: string) => {
    const cmt = await commentService.getComments(id, author);
    setComment(cmt);
  }

  const updateComment = async (e: OnClick, input: any, comment: Comment, setIsModalOpen: any, setShowActions: any) => {
    if (comment.userId !== userId) {
      return storage.alert("Please sign in!");
    } else {
      const commentId = comment.commentId || '';
      const id = comment.id || '';
      const author = comment.author || '';
      const newComment: Comment = {
        comment: input,
        time: new Date(),
      };
      await commentService.updateComment(id, author, userId, commentId, newComment);
      setIsModalOpen(false);
      setShowActions(false);
      showComments(e, id, author);
    }
  }

  const removeComment = async (e: OnClick, comment: Comment, setShowActions: any) => {
    const id = comment.id || '';
    const commentId = comment.commentId || '';
    const author = comment.author || '';
    await commentService.removeComment(id, author, commentId).then(res => {
      if (res > 0) {
        storage.message("Removed successfully!")
        setShowActions(false);
        showComments(e, id, author);
        setCommentCount(commentCount - 1);
      }
    })

  }

  const mapTitleToRateNumber = (rates: Number[]) => {
    return rates?.map((item, index) => {
      return { title: rateCategories[index], rate: rates[index]?.toString() }
    })
  }

  const calculatorPercentStar = (value: any) => Number(value * 100 / 5);

  const ReviewOverallScore = (rate: number) => {
    return (
      <div className='company-summary' >
        <div className='score'><span>{Math.ceil(rate * 100) / 100}</span></div>
        <div className='average'>
          <div className='empty-stars' />
          <div className='full-stars'
            style={{ width: `${(calculatorPercentStar(rate) || 0)}%` }} />
        </div>
      </div>
    );
  };
  return (
    <li className='col s12 m12 l12 review-custom'>
      <section className='review'>
        <div className='rate-overall'>
          {ReviewOverallScore(data.rate)}
        </div>
        <div className='rate-detail'>
          <p className="username">Anonymous</p>
          <p className='time'>{moment(data.time).format('DD/MM/YYYY')}</p>
          {more ? <span className='review'>{data.review}</span> : formatReviewText(data.review ?? '')}
          <p className='title'>Ratings by category</p>
          <div className='row rating-categories'>
            {mapTitleToRateNumber(data.rates).map((item, idx) => (
              <div className='cate-item' key={idx}>
                <p>{item.rate}</p>
                <p><FontAwesomeIcon icon={faStar} color="gold" /></p>
                <p className='title'>{item.title}</p>
              </div>
            ))}
          </div>
          <hr></hr>
          <div className="footer">
            <div className="left">
              {data.disable ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => removeUseful(e, data)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => addUseful(e, data)} />}
              {data.usefulcount ? data.usefulcount : 0}
            </div>
            <div className="right">
              {commentCount !== 0 && (
                <span
                  className="btn-reply"
                  onClick={(e) => {
                    showComments(e, data.id, data.author);
                    setIsShowComment(!isShowComment);
                  }}
                >
                  {commentCount === 1 ? isShowComment ? "Hide Comment" : `Show 1 comment` : isShowComment ? "Hide comments" : `Show ${commentCount} comments`}
                </span>
              )}
              <span className="btn-reply" onClick={() => setIsReplies(!isReplies)}>
                Replies
              </span>
            </div>
          </div>
        </div>
      </section>
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
    </li>
  );
};
