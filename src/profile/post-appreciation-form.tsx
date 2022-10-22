import React, { useMemo, useState } from 'react';
import { buildId } from 'react-hook-core';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { Comment } from '../review';
import { useReplyService, useAppreciation, useAppreciationComment } from './service';
import { Appreciation } from './service/appreciation';
import { Reply } from './service/appreciation-reply';

interface Props {
  closeModal: () => void;
  setDataAppreciation?: (data: Appreciation) => void;
  setDataComment?: (data: Comment) => void;
  dataAppreciation?: Appreciation;
  dataComment?: Comment;
  isReply: boolean;
  isEdit: boolean
}

export const PostRateForm = ({ closeModal, setDataAppreciation, setDataComment, dataAppreciation, dataComment, isReply, isEdit }: Props) => {
  // const [title, setTitle] = useState(isReply ? '' : data?.title ?? '');
  const [review, setReview] = useState('')
  const appreciationService = useAppreciation();
  const appreciationReplyService = useReplyService();
  const commentService = useAppreciationComment();

  const params = useParams();

  const postReview = async (event: any) => {
    const id = buildId<string>(params) || '';
    console.log({id});
    
    event.preventDefault();
    const userId = storage.getUserId() || '';
    console.log({ userId });

    if (!appreciationService) { closeModal(); return; }
    if (!isReply) {
      const dataReq: Appreciation = {
        id: id,
        author: userId || '',
        review: review,
        replyCount: 0,
        usefulCount: 0
      };
      if (!setDataAppreciation) return;
      const rs = await appreciationService.reply(dataReq);
      console.log({ rs });

      if (rs === 0)
        return
      if (dataAppreciation) {
        const histories = dataAppreciation.histories ? dataAppreciation.histories : []
        histories.push({ review: dataAppreciation.review ?? '', time: dataAppreciation.time! })
        dataReq.histories = histories
      }
      setDataAppreciation(dataReq);
      closeModal();
      return;
    }
    if ((!dataComment && !dataAppreciation) || !setDataComment) { closeModal(); return; }
    const reply: Comment = {
      userId: userId ?? '',
      author: dataComment ? dataComment.author : dataAppreciation?.author ?? '',
      comment: review,
      id: dataComment ? dataComment.id : dataAppreciation?.id ?? ''
    };
    if(dataComment){
      const author = dataComment.author || '' ;
      const appreciationId =  dataComment.id || '';
      const comment: Comment = {
        comment: review,
        time: new Date(),
      };
      await commentService.comment(appreciationId, author, userId, comment);
      const newAppreciation: Comment = (reply as any)['value'];
      console.log({ newAppreciation });
  
      setDataComment(newAppreciation);
      closeModal();
      return;
    }
    
  };
  const headerText = useMemo(() => {
    return (isReply ? "Reply" : isEdit ? "Update" : "Create") + " Appreciation"
  }, [isEdit])
  return (
    <div className='view-container'>
      <form
        id='addNewRate'
        name='addNewRate'
        model-name='addNewRate'
      // ref="form"
      >
        <header>
          <button
            type='button'
            id='btnClose'
            name='btnClose'
            className='btn-close'
            onClick={() => closeModal()}
          />
          <h2>{headerText}</h2>
        </header>
        <div>
          <section className='section-appreciate'>
            {/* {!isReply && <input type={'text'} className='input-appreciate' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />} */}
            <textarea style={{ height: 140 }} className='input-appreciate' placeholder='Description' value={review} onChange={e => setReview(e.target.value)} />
          </section>
        </div>
        <footer>
          <button
            type='submit'
            id='btnSave'
            name='btnSave'
            onClick={(event) => postReview(event)}
          >
            Post
          </button>
        </footer>
      </form>
    </div>
  );
};
