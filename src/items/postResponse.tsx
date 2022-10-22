import { useState } from "react";
import ReactModal from "react-modal";
import { storage } from "uione";


interface Props {
  name: string;
  postResponse: (data: DataPostResponse) => Promise<void>;
  isOpenResponseModal: boolean;
  close(): void;
}

export interface DataPostResponse {
  description: string;
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

export const PostResponseForm = (props: Props) => {
  const [description, setDescription] = useState("");
  const [resource] = useState(storage.resource().resource());
  const closeModal = () => {
    props.close();
  };
  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setDescription(value);
  };

  const postDescription = async (e: any) => {
    e.preventDefault();
    const response: DataPostResponse = {
      description,
    };
    await props.postResponse(response);
  };

  return (
    <ReactModal
      isOpen={props.isOpenResponseModal}
      style={customStyles}
      onRequestClose={() => props.close()}
      contentLabel="Modal"
      portalClassName="modal-portal"
      className="modal-portal-content small-width"
      bodyOpenClassName="modal-portal-open"
      overlayClassName="modal-portal-backdrop"
    >
      <div className="view-container">
        <form id="addNewResponse" name="addNewResponse" model-name="addNewResponse">
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
            <section className="user-input">
              <textarea
                className="responseDescription"
                id="description"
                name="description"
                onChange={handleChange}
                value={description}
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
            <button type="submit" id="btnSave" name="btnSave" onClick={(e) => postDescription(e)}>
              Post
            </button>
          </footer>
        </form>
      </div>
    </ReactModal>
  );
};
