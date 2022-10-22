import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { Comment, CommentItem, Rate } from '../review';
import { customStyles } from './appreciations';
import { HistoryAppreciation } from './history-appreciation';
import { PostRateForm } from './post-appreciation-form';
import { useReplyService, useAppreciation, useAppreciationComment } from './service';
import { Appreciation, Useful } from './service/appreciation';
import { Reply, ReplyFilter } from './service/appreciation-reply';
interface Props {
  dataAppreciation?: Appreciation;
  dataComment?: Comment;
  replyAppreciation: boolean;
  setDataComment?: (data: Comment) => void;
  deletedAppreciation?: (data: Appreciation) => void;
  deletedComment?: (data: Comment) => void;
}
const userId = storage.getUserId() || ''

export const Replys = ({ dataAppreciation, dataComment, replyAppreciation, setDataComment, deletedAppreciation, deletedComment }: Props) => {
  const appreciationService = useAppreciation();
  const appreciationReplyService = useReplyService();
  const [appreciation, setAppreciation] = useState<Appreciation>();
  const [comment, setComment] = useState<Comment>();
  const [appreciationsReply, setAppreciationsReply] = useState<Comment[]>([]);
  const [maxLengthReviewText] = useState(210);
  const [resource] = useState(storage.resource().resource());
  const [showmore, setShowmore] = useState(false);
  // const [skip, setSkip] = useState(24);
  const [limit] = useState(24);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalHistory, setIsOpenModalHistory] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const commentService = useAppreciationComment();
  const { id = "" } = useParams();


  useEffect(() => {
    setAppreciation(dataAppreciation);
  }, [dataAppreciation]);

  const getMoreAppreciations = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciationService || !dataAppreciation) { return; }
    const rs = await appreciationService.getReplys(dataAppreciation.id, dataAppreciation.author);
    console.log('first', (rs as any)["list"])
    if (rs) {
      console.log('appreciationsReply', rs, showReply)
      setAppreciationsReply((rs as any)["list"]);
    }
    setShowReply(!showReply);
  };

  const handleShow = (e: OnClick, isShow: boolean) => {
    e.preventDefault();
    setShowmore(isShow);
  };

  const setDataCommment = (reply: Comment) => {
    if (!replyAppreciation) {
      const newList = [...appreciationsReply];
      newList.unshift(reply as Reply);
      setAppreciationsReply(newList);
      const replyCount = appreciation?.replyCount !== undefined ? appreciation?.replyCount + 1 : 0
      setAppreciation({ ...appreciation, replyCount } as Appreciation)
      return;
    }
    else if (setDataComment) {
      setDataComment(reply as Reply);
    }
  };

  const setDataAppreciation = (data: Appreciation) => {
    setAppreciation(data);
  };

  const formatReviewText = (text: string) => {
    if ((text && text.length > maxLengthReviewText) && !showmore) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      const a = <span>{resource.review} {textSub} <span onClick={e => handleShow(e, true)} className='more-reviews'>More</span></span>;
      return a;
    } else if ((text && text.length > maxLengthReviewText) && showmore) {
      return <span>{resource.review} {text}<span onClick={e => handleShow(e, false)} className='more-reviews'>Less</span></span>;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  // const postUseful = async (e: OnClick, comment: Appreciation) => {
  //   let rs;
  //   const useful: Useful = {
  //     appreciationId: comment.id || '',
  //     userId: storage.getUserId() || ''
  //   };
  //   if (appreciationReplyService && replyAppreciation) {
  //     rs = await appreciationReplyService.usefulAppreciation(useful);
  //   } else if (appreciationService && !replyAppreciation) {
  //     rs = await appreciationService.usefulAppreciation(useful);
  //   }
  //   if (rs === 2) {// 2:Delete 1:Insert
  //     setAppreciation({ ...comment, isUseful: false, usefulCount: comment.usefulCount - 1 });
  //   } else { setAppreciation({ ...comment, isUseful: true, usefulCount: comment.usefulCount + 1 }); }
  // };

  const handleDelete = async (e: OnClick) => {
    e.preventDefault();
    if (!commentService || !appreciationService) { return; }
    let rs = 0;
    if (replyAppreciation && comment) {
      console.log({ comment });
      const id = comment.id || '';
      const author = comment.author || '';

      //rs = await commentService.removeComment(id, author, userId);
      if (rs > 0 && deletedComment) {
        deletedComment(comment);
      }
    } else if (appreciation) {
      rs = await appreciationService.delete({ id: appreciation.id, author: appreciation.author });
      if (rs > 0 && deletedAppreciation) {
        deletedAppreciation(appreciation);
      }
    }
  };

  //update appre
  const editAppreciation = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciation) { return; }
    setIsEdit(true);
    setIsOpenModal(true);
  };
  const openAppreciationHistory = async (e: OnClick) => {
    e.preventDefault();
    setIsOpenModalHistory(true)
  };

  const handleDeleteComment = (reply: Comment) => {
    if (replyAppreciation && deletedComment) {
      deletedComment(reply); return
    }
    const newAppreciations = appreciationsReply.filter(obj => obj.id !== reply.id);
    setAppreciationsReply(newAppreciations);
    const replyCount = appreciation?.replyCount ? appreciation?.replyCount - 1 : 0
    setAppreciation({ ...appreciation, replyCount } as Appreciation)
  };

  const openModalReply = (e: OnClick) => {
    e.preventDefault()
    setIsEdit(false)
    setIsOpenModal(true)
  }

  const showDelete = useMemo(() => {
    if (!replyAppreciation && dataAppreciation)
      return userId === dataAppreciation.author;
    else if (dataComment) {
      return userId === dataComment.userId;
    }
  }, [])

  // console.log({ dataComment });

  // const loadComments = async (e: OnClick, data: Rate) => {
  //   //const cmt = await commentService.getComments(id, String(data.author));
  //   const cmt = await commentService.search(id, String(data.author));
  //   setComment(cmt.list);
  // };

  // const updateComment = async (e: OnClick, input: any, comment: Comment) => {
  //   if (comment.userId !== userId) {
  //     return storage.alert("...");
  //   } else {
  //     const commentId = comment.commentId || "";
  //     const author = comment.author || "";
  //     const newComment: Comment = {
  //       comment: input,
  //       time: new Date(),
  //     };
  //     await commentService.updateComment(id, author, userId, commentId, newComment);
  //     loadComments(e, comment);
  //   }
  // };

  // const removeComment = async (e: OnClick, comment: Comment) => {
  //   const commentId = comment.commentId || "";
  //   const author = comment.author || "";
  //   await commentService.removeComment(id, author, commentId).then((res: any) => {
  //     if (res > 0) {
  //       storage.message("Removed successfully!");
  //       setCommentCount(commentCount - 1);
  //       loadComments(e, comment);
  //     }
  //   });
  // };


  return (
    <> {appreciation &&
      <li className='appreciation-custom'>
        <div className='appreciation-wapper'>
          {appreciation.authorURL ? <img src={appreciation.authorURL ? appreciation.authorURL : ""} alt="img" /> :
            <FontAwesomeIcon icon={faUserCircle} size="3x" color="lightgrey" />}
          <section className='card appreciation-section'>
            {formatReviewText(appreciation.review ?? '')}
            <p>{moment(appreciation.time).format('DD/MM/YYYY')}</p>
            <p>
              {/* {appreciation.isUseful ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => postUseful(e, appreciation)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => postUseful(e, appreciation)} />} */}

              {/* {appreciation.usefulCount} */}
              <button onClick={openModalReply}>Reply</button>
            </p>
            {(!replyAppreciation && appreciation.replyCount && appreciation.replyCount > 0 && !showReply) ?
              <button onClick={getMoreAppreciations}>View {appreciation.replyCount} replies</button> : null}

          </section>
          <div className='tool-section'>
            {/* <h4>
             {appreciation.title}
           </h4> */}
            {showDelete &&
              <div className='tool-section-bar'>
                <button onClick={editAppreciation}><span className='material-icons-outlined'>edit</span>
                </button>
                <button onClick={openAppreciationHistory}><span className='material-icons-outlined'>history</span>
                </button>
                <button onClick={handleDelete}><span className='material-icons-outlined'>delete</span></button>
              </div>
            }
          </div>
        </div>


        <div className='more-appreciations'>
          {
            showReply && appreciationsReply.map((reply, index) => (
              <Replys key={index + "reply"} deletedAppreciation={deletedAppreciation} deletedComment={handleDeleteComment} dataComment={reply} replyAppreciation={true} setDataComment={setDataCommment} />
            ))
          }
        </div>
      </li>
    }

      {/* {
        appreciationsReply &&
        appreciationsReply.length > 0 &&
        appreciationsReply.map((cmt: Comment) => {
          return (
            <CommentItem
              key={cmt.commentId}
              cmt={cmt}
              userId={userId}
              removeComment={removeComment}
              updateComment={updateComment}
            />
          );
        })} */}

      {dataComment &&
        <li className='col s12 m12 l12 appreciation-custom'>
          {/* <img src="" alt="" /> */}
          <div className='appreciation-wapper'>
            <img src={dataComment.userURL ?? ""} alt="" />
            <section className='card appreciation-section'>
              {formatReviewText(dataComment.comment ?? '')}
              <p>{moment(dataComment.time).format('DD/MM/YYYY')}</p>
            </section>
            <div className='tool-section'>
              {/* <h4>
             {appreciation.title}
           </h4> */}
              {showDelete &&
                <div className='tool-section-bar'>
                  <button onClick={editAppreciation}><span className='material-icons-outlined'>edit</span>
                  </button>
                  <button onClick={openAppreciationHistory}><span className='material-icons-outlined'>history</span>
                  </button>
                  <button onClick={handleDelete}><span className='material-icons-outlined'>delete</span>
                  </button>
                </div>}
            </div>
          </div>

        </li>
      }

      <ReactModal
        isOpen={isOpenModal}
        style={customStyles}
        onRequestClose={() => setIsOpenModal(false)}
        contentLabel='Modal'
        portalClassName='modal-portal'
        className='modal-portal-content small-width'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'>

        <PostRateForm isReply={!isEdit} isEdit={isEdit} dataAppreciation={dataAppreciation} dataComment={dataComment} setDataComment={setDataCommment} setDataAppreciation={setDataAppreciation} closeModal={() => setIsOpenModal(false)} />
      </ReactModal>
      {/* <ReactModal
        isOpen={isOpenModalHistory}
        style={customStyles}
        onRequestClose={() => setIsOpenModalHistory(false)}
        contentLabel='Modal'
        portalClassName='modal-portal'
        className='modal-portal-content small-width'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'>

      <HistoryAppreciation data={appreciation?.histories ?? []} closeModal={() => setIsOpenModalHistory(false)} />
      </ReactModal> */}
    </>
  );
};
