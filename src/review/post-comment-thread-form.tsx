import { useState } from "react";
import ReactModal from "react-modal";
import { storage } from "uione";

export interface Props {
  name: string;
  postComment: (data: DataPostComment) => Promise<void>;
  isOpenCommentModal: boolean;
  close(): void;
}
export interface DataPostComment {
  comment: string;
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
}
ReactModal.setAppElement("#root");
export const PostCommentThreadForm = (props: Props) => {
  const [comment, setComment] = useState("");
  const [resource] = useState(storage.resource().resource());
  const handleChange = (event:any) => {
    const target = event.target.value
    setComment(target)
  }
  const closeModal = () => {
    props.close()
  }
  const postComment = async (e:any) => {
    e.preventDefault();
    const cmt: DataPostComment =  {
      comment
    }
    
    await props.postComment(cmt);
    setComment("")
  }
  return (
    <ReactModal
      isOpen={props.isOpenCommentModal}
      style={customStyles}
      onRequestClose={() => props.close()}
      contentLabel="Modal"
      portalClassName="modal-portal"
      className="modal-portal-content small-width"
      bodyOpenClassName="modal-portal-open"
      overlayClassName="modal-portal-backdrop"
    >
      <div className="view-container">
        <form id="addNewComment" name="addNewComment" model-name="addNewComment">
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
            {/* <section className="user-star">{renderRateStar(props.rate)}</section> */}
            <section className="user-input">
              <textarea
              style={{
                resize: "none",
                borderColor: "#EDEDED",
                padding:"10px",
                fontSize:"15px",
                height:"207px",
                width:"90%",
                borderRadius:"20px",
                marginLeft:"15px",
                marginRight: "5px"}}
                className="comment"
                id="comment"
                name="comment"
                onChange={handleChange}
                value={comment}
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
            <button type="submit" id="btnSave" name="btnSave" onClick={(e) => postComment(e)}>
              Post
            </button>
          </footer>
        </form>
      </div>
    </ReactModal>
  )
}