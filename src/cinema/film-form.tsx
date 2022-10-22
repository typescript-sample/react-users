import  React, {useEffect, useState} from 'react';
import {  useFilm } from './service';
import { Film } from './service/film';
import { Link, useParams } from 'react-router-dom';
import { getFileExtension, removeFileExtension, TypeFile } from 'reactx-upload';

export const FilmForm = () => {
  const filmService = useFilm();
  const { id = '' } = useParams();
  const [film, setFilm] = useState<Film>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  useEffect(() => {
    getLocation(id ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getLocation = async (locId: string) => {
    const currentFilm = await filmService.load(locId);
    if (currentFilm) {
      setFilm(currentFilm);
      // setUploadedCover(currentLocation?.coverURL);
      setUploadedAvatar(currentFilm?.imageUrl);
    }
  };
  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };
  return (
    <div className='profile view-container'>

      <form id='locationForm' name='locationForm'>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
              <img alt='' src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' />
          </div>
          <div className='avatar-wrapper'>
            <img alt='' className='avatar' src={getImageBySize(uploadedAvatar, 400)  || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} />
           
          </div>
          <div className='profile-title'>
            <h3>{film?.title}</h3>
          </div>
        </header>
        <div className='row'>
          {/* <ReviewFilm  film={film} /> */}
        </div>
      </form>
      
    </div>
  );
};
