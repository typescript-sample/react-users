import { useState } from "react";
import ReactModal from "react-modal";
import { storage } from "uione";
import "../rate.css";

interface Props {
  name: string;
  rate: number;
  rateRange: number;
  postRate: (data: DataPostRate) => Promise<void>;
  isOpenRateModal: boolean;
  close(): void;
}
export interface DataPostRate {
  review: string;
  rate: number;
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

export const PostRateForm = (props: Props) => {
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
  const renderRateStar = (value: any) => {
    let list = Array(props.rateRange);
    list = list.fill(<i />).map((item, index) => {
      return <i key={index}></i>;
    });

    const listClass = [];
    for (let i = 1; i <= value; i++) {
      listClass.push(`star-${i}`);
    }
    const longClass = listClass.join(" ");
    const divStar = <div className={`rv-star3 ${longClass}`}>{list}</div>;
    return divStar;
  };
  const postReview = async (e: any) => {
    e.preventDefault();
    const rate: DataPostRate = {
      rate: props.rate,
      review,
    };
    await props.postRate(rate);
  };
  
  return (
    <ReactModal
      isOpen={props.isOpenRateModal}
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
            <h2>{props.name}</h2>
          </header>
          <div>
            <section className="user-title">
              <span>
                <b>{resource.user_name}</b>
              </span>
            </section>
            <section className="user-star">{renderRateStar(props.rate)}</section>
            <section className="user-input">
              <textarea
                className="rateReview"
                id="review"
                name="review"
                onChange={handleChange}
                value={review}
                placeholder={resource.placeholder_text}
              />
            </section>
            <section className="user-input">
              <div className="takePhoto">
                <button className="addPhoto">
                  <i className="camera" />
                  <i className="text-camera">{resource.add_photo_btn}</i>
                </button>
              </div>
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
