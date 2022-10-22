import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import { Cinema } from '../service/cinema/cinema';
import { useCinema } from '../service/index';


export interface Props {
  cinema: Cinema;
  setCinema: any;
}

export const CinemaPhoto = ({cinema, setCinema}: Props) => {
  if (cinema && window.location.pathname.includes('photo')) {
    return (
      <>
        <section className='row'>
          <div className='user-carousel-container img-border'>
            <Carousel infiniteLoop={true}>
              {cinema?.gallery
                ? cinema.gallery.map((itemData, index) => {
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
      </>
    );
  }
  return (<></>);
};
