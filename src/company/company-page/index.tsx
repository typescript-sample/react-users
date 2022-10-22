import { Company, useCompanyService } from '../service';
import { Link, useParams } from "react-router-dom";
import { Overview } from "./overview";
import { ReviewPage } from "./review";
import { useEffect, useRef, useState } from 'react';
import { getFileExtension, removeFileExtension } from 'reactx-upload';
import imageOnline from '../../assets/images/online.svg';
import "../../rate.css";

export const CompanyFormClient = () => {
  const { id = '' } = useParams();
  const refForm = useRef();
  const [company, setCompany] = useState<Company>()
  const companyService = useCompanyService();
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  

  useEffect(() => {
    getCompany(id ?? '');
  }, [id])

  const getCompany = async (id: string) => {
    const currentCompany = await companyService.load(id);
    if (currentCompany) {
      setCompany(currentCompany);
      setUploadedAvatar(currentCompany.imageURL);
      setUploadedCover(currentCompany.coverURL);
    }
  }

  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };

  if (!company) {
    return (<div></div>)
  }

  return (
    <div className='profile view-container'>
      <form id='companyForm' name='companyForm' model-name='company' ref={refForm as any}>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            <img src={uploadedCover ? uploadedCover : 'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/00003_AIqFrD3Ij_cv.jpg'} alt='cover' />
            
            <div className='contact-group'>
              <button id='btnPhone' name='btnPhone' className='btn-phone' />
              <button id='btnEmail' name='btnEmail' className='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow'  className='btn-follow'>Follow</button>
          </div>
          <div className='avatar-wrapper'>
            <img className='avatar'
              src={getImageBySize(uploadedAvatar, 400) || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} alt='avatar' />
            <img className='profile-status' src={imageOnline} alt='status' />
          </div>

          <div className='profile-title'>
            <h3>{company?.name}</h3>
            <p>{`${company?.size} Member`}</p>
          </div>

          <nav className='menu'>
            <ul>
              <li><Link to={`/companies/${id}`}> Overview </Link></li>
              <li><Link to={`/companies/${id}/review`}> Review </Link></li>
              <li><Link to={`/companies/${id}/about`}> About </Link></li>
            </ul>
          </nav>
        </header>
        <div className='row'>
          <Overview company={company} />
          <ReviewPage company={company} getCompany={getCompany} />
        </div>
      </form>

    </div>
  );
};
