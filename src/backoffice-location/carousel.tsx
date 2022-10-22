import { useEffect, useState } from 'react';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';

import { OnClick } from 'react-hook-core';
import { useNavigate } from 'react-router-dom';
import { FileInfo } from 'reactx-upload';
import { getLocations } from '../backoffice/service';
import { Location } from '../backoffice/service/location/location';
import './carousel.css';

interface Props {
  edit: (e: any, id: string) => void;
  location: Location;
}
export default function LocationCarousel({ edit, location }: Props) {
  const [carousel, setCarousel] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>();
  const navigate = useNavigate();
  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, carousel]);
  const locationService = getLocations();
  const handleFetch = async () => {
    if (!carousel || files) { return; }
    let res;
    try {
      res = await locationService.fetchImageUploaded(location.id);
    } catch (error) { }
    if (res && res.length > 0) {
      for (const item of res) {
        if (item.type === 'youtube') {
          const thumbnails = await locationService.fetchThumbnailVideo(
            item.url
          );
          item.thumbnail = thumbnails.thumbnail;
          item.standardThumbnail = thumbnails.standardThumbnail;
          item.mediumThumbnail = thumbnails.mediumThumbnail;
          item.maxresThumbnail = thumbnails.maxresThumbnail;
          item.hightThumbnail = thumbnails.hightThumbnail;
        }
      }
      setFiles(res);
    } else {
      const info: FileInfo[] = [
        {
          source: '',
          type: 'image',
          url: location.imageURL || '',
        },
      ];
      setFiles(info);
    }
  };

  const toggleCarousel = (e: OnClick, enable: boolean) => {
    e.preventDefault();
    setCarousel(enable);
  };

  // const navigateEdit = (e: OnClick) => {
  //   e.preventDefault();
  //   navigate(`edit/${location.id}`);
  // };
  return (
    <>
      {carousel ? (
        <div className='col s12 m6 l4 xl3 '>
          <div
            className='user-carousel-container '
            onClick={(e) => toggleCarousel(e, false)}
          >
            {files && files.length > 0 ? (
              <Carousel infiniteLoop={true}>
                {files.map((itemData, index) => {
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
                        <CarouselImageItem key={index} src={itemData.url} />
                      );
                    case 'youtube':
                      return (
                        <CarouselVideoItem
                          key={index}
                          type={itemData.type}
                          src={itemData.url}
                        />
                      );
                    default:
                      return <></>;
                  }
                })}
              </Carousel>
            ) : (
              ''
            )}
            <div className='user-carousel-content'>
              <h3
                onClick={(e) => edit(e, location.id)}
                className={location.status === 'I' ? 'inactive' : ''}
              >
                {location.name}
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <li
          className='col s12 m6 l4 xl3 card '
          
        >
          <section>
            <div
              className='cover'
              style={{
                backgroundImage: `url('${location.imageURL}')`,
              }}
              onClick={(e) => toggleCarousel(e, true)}
             ></div>
            <h3 onClick={(e) => edit(e, location.id)}>{location.name}</h3>
          </section>
        </li>
      )}
    </>
  );
}
