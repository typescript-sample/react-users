import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { FileInfo } from 'reactx-upload';
import { options, storage, useResource } from 'uione';
import { config } from '../config';
import { FileUpload } from '../core/upload';
import { useMyProfileService } from './my-profile';

const httpRequest = new HttpRequest(Axios, options);

const id: string | undefined = storage.getUserId();

interface Props {
  modalUploadGalleryOpen: boolean;
  closeModalUploadGallery: (e: OnClick) => void;
  setGallery: (file: FileInfo[]) => void;
}
export const ModalUploadGallery = ({
  modalUploadGalleryOpen,
  closeModalUploadGallery,
  setGallery,
}: Props) => {
  const service = useMyProfileService();

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
            url={config.authentication_url + '/my-profile'}
            sizes={[]}
            getGalllery={service.fetchImageUploadedGallery}
            uploadExternalResource={service.uploadExternalResource}
            deleteFileYoutube={service.deleteFileYoutube}
            deleteFile={service.deleteFile}
            update={service.updateData}
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
