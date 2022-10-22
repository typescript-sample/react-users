import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import { useEffect, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { FileInfo, getFileExtension, removeFileExtension, TypeFile } from 'reactx-upload';
import { alert, message, useResource } from 'uione';
import imageOnline from '../assets/images/online.svg';
import { UploadContainer } from '../core/upload';
import { ModalSelectCover } from '../my-profile/modal-select-cover';
import { Result } from 'onecore';
import { ModalUploadGallery } from './modal-upload-gallery';

export interface UploadSerivce<T> {
  fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []>;
  uploadExternalResource(id: string, videoId: string): Promise<number>;
  deleteFile(id: string, fileUrl: string): Promise<number>;
  deleteFileYoutube(id: string, fileUrl: string): Promise<number>;
  updateData(id: string, data: FileInfo[]): Promise<number>;
  load(id: string, ctx?: any): Promise<T | null>;
  update(obj: T, ctx?: any): Promise<Result<T>>;
}

interface Props<T> {
  post: (
    url: string,
    obj: any,
    options?:
      | {
        headers?: Headers | undefined;
      }
      | undefined
  ) => Promise<any>;
  url: string;
  sv: UploadSerivce<T>
}

export function UploadForm<T extends {
  id: string
  imageURL?: string;
  coverURL?: string;
  gallery?: FileInfo[];
}>({ post, url, sv }: Props<T>) {
  const resource = useResource();
  const { id = '' } = useParams();

  const [data, setData] = useState<T>();
  const [modalUpload, setModalUpload] = useState(false);
  const [typeUpload, setTypeUpload] = useState<TypeFile>('cover');
  const [aspect, setAspect] = useState<number>(1);
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const [sizes, setSizes] = useState<number[]>([]);
  const [dropdownCover, setDropdownCover] = useState<boolean>(false);
  const [modalSelectGalleryOpen, setModalSelectGalleryOpen] = useState(false);
  const [modalUploadGalleryOpen, setModalUploadGalleryOpen] = useState(false);
  useEffect(() => {
    getData(id);
    console.log('id', id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getData = async (locId: string) => {
    const currentData = await sv.load(locId);
    if (currentData) {
      setData(currentData);
      setUploadedCover(currentData?.coverURL);
      setUploadedAvatar(currentData?.imageURL);
    }
  };
  if (!data) {
    return (<div></div>);
  }

  const openModalUpload = (e: OnClick, type: TypeFile) => {
    e.preventDefault();
    setModalUpload(true);
    setTypeUpload(type);
    if (type === 'cover') {
      setAspect(2.7);
      setSizes([576, 768]);
    } else { setAspect(1); }
    setSizes([40, 400]);
  };

  const handleChangeFile = (fi: string | undefined) => {
    if (typeUpload === 'cover') {
      setUploadedCover(fi);
    } else {
      setUploadedAvatar(fi);
    }
  };

  const closeModalUpload = (e: OnClick) => {
    e.preventDefault();
    setModalUpload(false);
  };
  const toggleDropdownCover = (e: OnClick) => {
    e.preventDefault();
    setDropdownCover(!dropdownCover);
  };
  const toggleSelectGallery = (e: OnClick) => {
    e.preventDefault();
    setModalSelectGalleryOpen(!modalSelectGalleryOpen);
  };

  const saveImageCover = (e: OnClick, url: string) => {
    e.preventDefault();
    setData({ ...data, coverURL: url });
    setUploadedCover(url);
    sv.update
      ({ ...data, coverURL: url })
      .then((successs) => {
        if (successs) {
          message(resource.success_save_my_profile);
        } else {
          alert(resource.fail_save_my_profile, resource.error);
        }
      });
  };
  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };
  const toggleModalUploadGallery = (e: OnClick, isOpen: boolean) => {
    e.preventDefault();
    setModalUploadGalleryOpen(isOpen);
  };
  return (
    <div className='profile view-container'>

      <form id='dataForm' name='dataForm'>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            {
              ((uploadedCover) && <img alt='' src={uploadedCover} />)
              || (<img alt='' src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' />)
            }
          </div>
          <button id='btnCamera' name='btnCamera' className='btn-camera' onClick={toggleDropdownCover} />
          <ul
            id='dropdown-basic'
            className={`dropdown-content-profile dropdown-upload-cover ${dropdownCover ? 'show-upload-cover' : ''
              }`}
          >
            <li className='menu' onClick={(e) => openModalUpload(e, 'cover')}>
              Upload
            </li>
            {/* <hr style={{ margin: 0 }} />
            <li className='menu' onClick={toggleSelectGallery}>
              Choose from gallery
            </li> */}
          </ul>
          <div className='avatar-wrapper'>
            <img alt='' className='avatar' src={getImageBySize(uploadedAvatar, 400) || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} />
            <button
              id='btnCamera'
              name='btnCamera'
              className='btn-camera'
              onClick={(e) => openModalUpload(e, 'upload')}
            />
            <img className='profile-status' alt='status' src={imageOnline} />
          </div>

          
        </header>
        <div className='row'>
          <div className='col m12 l4' ></div>
          <div className='col m12 l8' >
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight btn-camera'></i>
                {resource.title_modal_gallery}
                <button
                  type='button'
                  id='btnGallery'
                  name='btnGallery'
                  className={'btn-edit'}
                  onClick={(e) => toggleModalUploadGallery(e, true)}
                />
              </header>
              <section className='row'>
                <div className='user-carousel-container'>
                  <Carousel infiniteLoop={true}>
                    {data.gallery
                      ? data.gallery.map((itemData, index) => {
                        switch (itemData.type) {
                          case 'video':
                            return (
                              <CarouselVideoItem
                                key={index}
                                type={itemData.type}
                                src={itemData.url}
                              />
                            );
                          case 'image':
                            return (
                              // <img className='image-carousel' src={itemData.url} key={index} alt={itemData.url} draggable={false}/>
                              <CarouselImageItem
                                key={index}
                                src={itemData.url}
                              />
                            );
                          case 'youtube':
                            return (
                              <div className='data-item-youtube'>
                                <iframe
                                  src={itemData.url + '?enablejsapi=1'}
                                  frameBorder='0'
                                  className='iframe-youtube'
                                  title='youtube video'
                                ></iframe>
                                ;
                              </div>
                            );
                          default:
                            return <></>;
                        }
                      })
                      : [<></>]}
                  </Carousel>
                </div>
              </section>
            </div>
          </div>
        </div>
      </form>
      <ReactModal
        isOpen={modalUpload}
        onRequestClose={closeModalUpload}
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
                onClick={closeModalUpload}
              />
            </header>
            <UploadContainer
              post={post}
              setURL={(dt: any) => handleChangeFile(dt)}
              type={typeUpload}
              id={data.id}
              url={url}
              aspect={aspect}
              sizes={sizes}
            />

            <footer>
              <button
                type='button'
                id='btnSave'
                name='btnSave'
                onClick={closeModalUpload}
              >
                {resource.button_modal_ok}
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
      <ModalUploadGallery
        closeModalUploadGallery={e => toggleModalUploadGallery(e, false)}
        modalUploadGalleryOpen={modalUploadGalleryOpen}
        setGallery={(files) => {
          setData({ ...data, gallery: files });
        }}
        fetchImageUploadedGallery={sv.fetchImageUploadedGallery}
        deleteFile={sv.deleteFile}
        deleteFileYoutube={sv.deleteFileYoutube}
        updateData={sv.updateData}
        uploadExternalResource={sv.uploadExternalResource}
        url={url}
        id={data.id}
      />
      <ModalSelectCover
        list={data.gallery ?? []}
        modalSelectGalleryOpen={modalSelectGalleryOpen}
        closeModalUploadGallery={toggleSelectGallery}
        setImageCover={saveImageCover}
      />
    </div>
  );
};
