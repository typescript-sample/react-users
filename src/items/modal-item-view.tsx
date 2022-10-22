import React, { useRef, useState } from 'react'
import { OnClick } from 'react-hook-core'
import ReactModal from 'react-modal'
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel'
import { FileInfo } from 'reactx-upload'
import "./item.css"
interface Props {
  modalConfirmIsOpen: boolean,
  closeModalConfirm: () => void,
  gallery: FileInfo[],
  selectedImage: number,
}
export const ModalItemView = ({ modalConfirmIsOpen, closeModalConfirm, gallery, selectedImage }: Props) => {
  const [currentSelectImage, setCurrentSelectImage] = useState(selectedImage)
  const ref = useRef<any>()
  const handleSelectImage = (e: OnClick, index: number) => {
    e.preventDefault()
    setCurrentSelectImage(index)

  }
  return (
    <ReactModal
      isOpen={modalConfirmIsOpen}
      onRequestClose={closeModalConfirm}
      contentLabel='Modal'
      className='modal-portal-content medium-width-height'
      bodyOpenClassName='modal-portal-open'
      overlayClassName='modal-portal-backdrop'
    >
      <div className='view-container item-modal-body'>
        <form model-name='data'>
          <div className="row ">
            <div className="col s8">
              <div className='user-carousel-container'>
                <Carousel infiniteLoop={true}>
                  {gallery
                    ? gallery.map((itemData, index) => {
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
              </div></div>
            <div className="col s4 image-wrapper">
              {gallery.map((g, index) => (<img onClick={(e) => handleSelectImage(e, index)} className={currentSelectImage === index ? 'image-selected' : ''} src={g.url} key={index} />
              ))}
            </div>
          </div>
        </form>
      </div>
    </ReactModal>
  )
}
