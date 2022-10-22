import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { FileInfo } from 'reactx-upload';
import { options, useResource } from 'uione';
import { FileUpload } from '../core/upload';

const httpRequest = new HttpRequest(Axios, options);


interface Props {
  modalUploadGalleryOpen: boolean;
  closeModalUploadGallery: (e: OnClick) => void;
  setGallery: (file: FileInfo[]) => void;
  fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []>;
  uploadExternalResource(id: string, videoId: string): Promise<number>;
  deleteFile(id: string, fileUrl: string): Promise<number>;
  deleteFileYoutube(id: string, fileUrl: string): Promise<number>;
  updateData(id: string, data: FileInfo[]): Promise<number>;
  url:string
  id:string
}
export const ModalUploadGallery = ({
  modalUploadGalleryOpen,
  closeModalUploadGallery,
  url,
  id,
  setGallery,
  fetchImageUploadedGallery,
  uploadExternalResource,
  deleteFile,
  deleteFileYoutube,
  updateData
}: Props) => {

  const resource = useResource();

  return (
    <ReactModal
      isOpen={modalUploadGalleryOpen}
      onRequestClose={closeModalUploadGallery}
      contentLabel='Modal'
      className='modal-portal-content'
      bodyOpenClassName='modal-portal-open'
      overlayClassName='modal-portal-backdrop'
    >
      <div className='view-container profile-info'>
        <form model-name='data'>
          <header>
            <h2>{resource.title_modal_uploads}</h2>
            <button
              type='button'
              id='btnClose'
              name='btnClose'
              className='btn-close'
              onClick={closeModalUploadGallery}
            />
          </header>
          <FileUpload
            setGallery={setGallery}
            type='gallery'
            post={httpRequest.post}
            id={id || ''}
            url={url}
            sizes={[]}
            getGalllery={fetchImageUploadedGallery}
            uploadExternalResource={uploadExternalResource}
            deleteFileYoutube={deleteFileYoutube}
            deleteFile={deleteFile}
            update={updateData}
          />

          <footer>
            <button
              type='button'
              id='btnSave'
              name='btnSave'
              onClick={closeModalUploadGallery}
            >
              {resource.button_modal_ok}
            </button>
          </footer>
        </form>
      </div>
    </ReactModal>
  );
};
