import { useEffect, useState } from 'react';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';

import { OnClick } from 'react-hook-core';
import { useNavigate } from 'react-router-dom';
import { FileInfo } from 'reactx-upload';
import { getLocations } from '../backoffice/service';
import { Cinema } from '../backoffice/service/cinema/cinema';
import '../location/carousel.css';

interface Props {
  //edit: (e: any, id: string) => void;
  cinema: Cinema;
}

export default function CinemaCarousel({ cinema }: Props) {
  const [carousel, setCarousel] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetch();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinema, carousel]);

  const locationService = getLocations();

  let gallery = cinema.gallery || [];

  const handleFetch = async () => {
    let res;
    try {
      res = await locationService.fetchImageUploaded(cinema.id);
    } catch (error) { }
    //console.log(res);
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
      const info: FileInfo[] = [...gallery];
      setFiles(info);
    }
  };

  //console.log(files);
  
  // console.log('not fetch thumbnail');
  // const info: FileInfo[] = [...files];      
  // gallery && gallery.length > 0 && gallery.forEach((i: any) => {
  //   info.push({
  //     source: '',
  //     type: 'image',
  //     url: `${i.url}` || '',
  //   });
  // });
  // setFiles(info);     


  // const toggleCarousel = (e: OnClick, enable: boolean, files: FileInfo[]) => {
  //   e.preventDefault();
  //   setCarousel(enable);
  //   let len = files.length;
  //   console.log(len);
  // };

  // const navigateEdit = (e: OnClick) => {
  //   e.preventDefault();
  //   navigate(`edit/${cinema.id}`);
  // };

  return (
    <>
      {carousel ? (
        <div className='col s12 m6 l4 xl3 '>
          <div
            className='user-carousel-container '
            //onClick={(e) => toggleCarousel(e, false, files)}
            onClick={() => setCarousel(false)}
          >
            {files && files.length > 0 ? (
              <Carousel
                infiniteLoop={true}
              >
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
                        <>
                          <CarouselImageItem key={index} src={itemData.url} />
                        </>
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
          </div>
        </div>
      ) : (

        <li
          className='col s12 m6 l4 xl3 card '
        >
          <section>
            <div
              //onClick={(e) => toggleCarousel(e, true, files)}
              onClick={() => setCarousel(true)}
              className='cover'
              style={{
                backgroundImage: `url('${cinema.imageURL}')`,
              }}
            ></div>

            <h3 className='title-location'>{cinema.name}</h3>
          </section>
        </li>
      )}
    </>
  );
}
