import { useState } from 'react';
import { storage } from 'uione';
import { Comment } from 'reaction-client';
import moment from 'moment';
import ReactModal from 'react-modal';
import '../rate.css';


export interface Props {
  cmt: Comment;
  isModalOpen: boolean;
  close(): void;
  updateComment: any;
  setIsModalOpen: any;
  setShowActions: any;
}

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};

export const PostCommentForm = ({ cmt, isModalOpen, close, updateComment, setIsModalOpen, setShowActions }: Props) => {
  const username = storage.username();
  const [comment, setComment] = useState(cmt.comment);

  const closeModal = () => {
    close();
  };

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setComment(e.target.value);
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      style={customStyles}
      onRequestClose={() => close()}
      contentLabel='Modal'
      portalClassName='modal-portal'
      className='modal-portal-content small-width'
      bodyOpenClassName='modal-portal-open'
      overlayClassName='modal-portal-backdrop'>

      <div className='view-container'>
        <form
          id='addNewRate'
          name='addNewRate'
          model-name='addNewRate'
        >
          <header>
            <button
              type='button'
              id='btnClose'
              name='btnClose'
              className='btn-close'
              onClick={() => closeModal()}
            />
            <h2>{username} - {moment(cmt.time).format('DD/MM/YYYY')}</h2>
          </header>
          <div>
            <section className='user-input'>
              <textarea
                className='rateReview'
                id='review'
                name='review'
                onChange={(e) => handleChange(e)}
                defaultValue={comment}
              />
            </section>
          </div>
          <footer>
            <span className='btn-update-comment'
              onClick={(e) => updateComment(e, comment, cmt, setIsModalOpen, setShowActions)}
            >
              Post
            </span>
          </footer>
        </form>
      </div>
    </ReactModal>
  )
}