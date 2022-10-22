import { useState } from 'react';
import { storage } from 'uione';
import { RatingStar } from './rating-star';
import ReactModal from 'react-modal';
import cloneDeep from 'lodash/cloneDeep';
import '../rate.css';


interface Props {
  name: string;
  rate: number;
  postRate: (data: DataPostRate, voteStarCate: any, setVoteStarCate: any) => Promise<void>;
  isOpenRateModal: boolean;
  close(): void;
}
export interface DataPostRate {
  review: string;
  rate: number;
  rates: number[];
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

ReactModal.setAppElement('#root');

export const PostRateForm = (props: Props) => {
  const [review, setReview] = useState('');
  const [resource] = useState(storage.resource().resource());
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const [voteStarCate, setVoteStarCate] = useState(
    [
      {
        name: 'Job Work/Life Balance',
        rate: 0
      }, {
        name: 'Compensation/Benefits',
        rate: 0
      }, {
        name: 'Job Security/Advancement',
        rate: 0
      }, {
        name: 'Management',
        rate: 0
      },
      {
        name: 'Culture',
        rate: 0
      }]
  );


  const closeModal = () => {
    props.close();
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setReview(value);
  };

  const postReview = async (event: any) => {
    const mapRatesCate = cloneDeep(voteStarCate).map(item => item.rate);
    event.preventDefault();
    const rate: DataPostRate = {
      rate: props.rate,
      review,
      rates: mapRatesCate
    };
    await props.postRate(rate, voteStarCate, setVoteStarCate);
  };

  return (
    <ReactModal
      isOpen={props.isOpenRateModal}
      style={customStyles}
      onRequestClose={() => props.close()}
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
            <h2>{props.name}</h2>
          </header>
          <div>
            <section className='user-title'>
              <span>
                <b>{resource.user_name}</b>
              </span>
            </section>
            <section className='user-stars'>
              {voteStarCate.map((cate, idx) => (
                <div className='stars' key={idx}>
                  <RatingStar
                    key={idx}
                    ratingText={cate.name}
                    setIsOpenRateModal={setIsOpenRateModal}
                    setVoteStar={(setVoteStar)}
                    voteStar={cate.rate || 0}
                    setVoteStarCate={setVoteStarCate}
                    voteStarCate={voteStarCate}
                  />
                </div>
              ))}
            </section>
            <section className='user-input'>
              <textarea
                className='rateReview'
                id='review'
                name='review'
                onChange={handleChange}
                value={review}
                placeholder={resource.placeholder_text}
              />
            </section>
            <section className='user-input'>
              <div className='takePhoto'>
                <button className='addPhoto'>
                  <i className='camera' />
                  <i className='text-camera'>{resource.add_photo_btn}</i>
                </button>
              </div>
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
    </ReactModal>
  );
};
