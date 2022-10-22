import { useState } from "react";
import ReactModal from "react-modal";
import { storage } from "uione";
import "../rate.css";

interface Props {
  postAppreciation: (review: string) => Promise<void>;
  isOpenModal: boolean;
  close(): void;
  isEdit: any;
}
export interface DataPostRate {
  review: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
ReactModal.setAppElement("#root");

export const PostAppreciationForm = (props: Props) => {
  const [review, setReview] = useState("");
  const [resource] = useState(storage.resource().resource());
  const closeModal = () => {
    props.close();
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setReview(value);
  };

  const postReview = async (e: any) => {
    e.preventDefault();
    await props.postAppreciation(review);
    setReview('');
  };
  
  return (
    <ReactModal
      isOpen={props.isOpenModal}
      style={customStyles}
      onRequestClose={() => props.close()}
      contentLabel="Modal"
      portalClassName="modal-portal"
      className="modal-portal-content small-width"
      bodyOpenClassName="modal-portal-open"
      overlayClassName="modal-portal-backdrop"
    >
      <div className="view-container">
        <form id="addNewRate" name="addNewRate" model-name="addNewRate">
          <header>
            <button type="button" id="btnClose" name="btnClose" className="btn-close" onClick={() => closeModal()} />
            {props.isEdit? <h2>Update appreciation</h2> : <h2>Create appreciation</h2> }
          </header>
          <div>
         
            <section className="user-input">
              <textarea
                className="rateReview"
                id="review"
                name="review"
                onChange={handleChange}
                value={review}
                placeholder="review"
              />
            </section>       
          </div>
          <footer>
            <button type="submit" id="btnSave" name="btnSave" onClick={(e) => postReview(e)}>
              Post
            </button>
          </footer>
        </form>
      </div>
    </ReactModal>
  );
};
