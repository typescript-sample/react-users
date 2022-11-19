import Axios from "axios";
import { HttpRequest } from "axios-core";
import { useEffect, useState } from "react";
import { OnClick } from "react-hook-core";
import ReactModal from "react-modal";
import { Link, useParams } from "react-router-dom";
import { getFileExtension, removeFileExtension, TypeFile } from "reactx-upload";
import { alert, message, options, useResource } from "uione";
import imageOnline from "../../assets/images/online.svg";
import { config } from "../../config";
import { UploadContainer } from "../../core/upload";
import { ModalSelectCover } from "../../my-profile/modal-select-cover";
import {
  Location,
  useFollowLocationResponse,
  useLocationComment,
  useLocationRate,
  useLocationReaction,
  useLocations,
  useLocationSearchRate
} from "../service";
import { Overview } from "./overview";
import { LocationPhoto } from "./photo";
// import { Review } from './review';
import { storage } from "uione";
import { Review } from "../../review";
import "../../rate.css";

// import { getFileExtension, removeFileExtension } from '../../uploads/components/UploadHook';
const httpRequest = new HttpRequest(Axios, options);
export const LocationPage = () => {
  const userId: string | undefined = storage.getUserId() || "";
  const resource = useResource();
  const { id = "" } = useParams();
  const [location, setLocation] = useState<Location>();
  const locationService = useLocations();
  const [modalUpload, setModalUpload] = useState(false);
  const [typeUpload, setTypeUpload] = useState<TypeFile>("cover");
  const [aspect, setAspect] = useState<number>(1);
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const [sizes, setSizes] = useState<number[]>([]);
  const [dropdownCover, setDropdownCover] = useState<boolean>(false);
  const [modalSelectGalleryOpen, setModalSelectGalleryOpen] = useState(false);

  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [follow, setFollow] = useState<boolean>(false);
  const followService = useFollowLocationResponse();
  const rateService = useLocationRate();
  const searchRateService = useLocationSearchRate();
  const reactionService = useLocationReaction();
  const commentService = useLocationComment();
  useEffect(() => {
    getLocation(id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    checkFollow();
  }, []);
  useEffect(() => {
    loadFollow();
  }, [follow]);
  const loadFollow = async () => {
   
    if (userId) {
      try{
        const rep: any = await followService.loadfollow(id);
        if (rep!=null) {
          setFollower(rep.followercount);
          setFollowing(rep.followingcount);
        }
      }catch(e: any){
        setFollower(0)
        setFollowing(0)
      }
      
    }
  };
  const checkFollow = async () => {
    if (userId) {
      const rep = await followService.checkfollow(userId, id);
      if (rep) {
        setFollow(true);
      }
    }
  };
  const handleFollow = async (e: any) => {
    e.preventDefault();
    if (userId) {
      if (!follow) {
        const rep = await followService.follow(userId, id);
        if (rep) {
          setFollow(!follow);
        }
      } else {
        const rep = await followService.unfollow(userId, id);
        if (rep) {
          setFollow(!follow);
        }
      }
    }
  };
  const getLocation = async (locId: string) => {
    const currentLocation = await locationService.load(locId);
    if (currentLocation) {
      setLocation(currentLocation);
      setUploadedCover(currentLocation?.customURL);
      setUploadedAvatar(currentLocation?.imageURL);
    }
  };
  if (!location) {
    return <div></div>;
  }

  const openModalUpload = (e: OnClick, type: TypeFile) => {
    e.preventDefault();
    setModalUpload(true);
    setTypeUpload(type);
    if (type === "cover") {
      setAspect(2.7);
      setSizes([576, 768]);
    } else {
      setAspect(1);
    }
    setSizes([40, 400]);
  };

  const handleChangeFile = (fi: string | undefined) => {
    if (typeUpload === "cover") {
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
    setLocation({ ...location, customURL: url });
    setUploadedCover(url);
    locationService.update({ ...location, customURL: url }).then((successs) => {
      if (successs) {
        message(resource.success_save_my_profile);
      } else {
        alert(resource.fail_save_my_profile, resource.error);
      }
    });
  };
  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) {
      return "";
    }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };

  return (
    <div className="profile view-container">
      <form id="locationForm" name="locationForm">
        <header className="border-bottom-highlight">
          <div className="cover-image">
            {(uploadedCover && <img alt="" src={uploadedCover} />) || (
              <img
                alt=""
                src="https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg"
              />
            )}
            <div className="contact-group">
              <button id="btnPhone" name="btnPhone" className="btn-phone" />
              <button id="btnEmail" name="btnEmail" className="btn-email" />
            </div>
            <button id="btnFollow" name="btnFollow" onClick={(e) => handleFollow(e)} className="btn-follow">
              {follow ? "UnFollow" : "Follow"}
            </button>
          </div>
          <button id="btnCamera" name="btnCamera" className="btn-camera" onClick={toggleDropdownCover} />
          <ul
            id="dropdown-basic"
            className={`dropdown-content-profile dropdown-upload-cover ${dropdownCover ? "show-upload-cover" : ""}`}
          >
            <li className="menu" onClick={(e) => openModalUpload(e, "cover")}>
              Upload
            </li>
            <hr style={{ margin: 0 }} />
            <li className="menu" onClick={toggleSelectGallery}>
              Choose from gallery
            </li>
          </ul>
          <div className="avatar-wrapper">
            <img
              alt=""
              className="avatar"
              src={
                getImageBySize(uploadedAvatar, 400) ||
                "https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png"
              }
            />
            <button
              id="btnCamera"
              name="btnCamera"
              className="btn-camera"
              onClick={(e) => openModalUpload(e, "upload")}
            />
            <img className="profile-status" alt="status" src={imageOnline} />
          </div>
          <div className="profile-title">
            <h3>{location.name}</h3>
            <p>{location.description}</p>
            <p>{follower} followers</p>
          </div>
          {/*
              <div className='card'>
                <h3>{location.locationName}</h3>
                <p>{location.description}</p>
              </div>*/}
          <nav className="menu">
            <ul>
              <li>
                <Link to={`/locations/${id}`}> Overview </Link>
              </li>
              <li>
                <Link to={`/locations/${id}/bookable`}> Bookable </Link>
              </li>
              <li>
                <Link to={`/locations/${id}/review`}> Review </Link>
              </li>
              <li>
                <Link to={`/locations/${id}/photo`}> Photo </Link>
              </li>
              <li>
                <Link to={`/locations/${id}/about`}> About </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="row">
          <Overview />
          <Review
            i={location}
            get={getLocation}
            id={id}
            userId={userId}
            rateRange={5}
            rateService={rateService}
            searchRateService={searchRateService}
            reactionService={reactionService}
            commentService={commentService}
          />
          <LocationPhoto />
        </div>
      </form>
      <ReactModal
        isOpen={modalUpload}
        onRequestClose={closeModalUpload}
        contentLabel="Modal"
        // portalClassName='modal-portal'
        className="modal-portal-content"
        bodyOpenClassName="modal-portal-open"
        overlayClassName="modal-portal-backdrop"
      >
        <div className="view-container profile-info">
          <form model-name="data">
            <header>
              <h2>{resource.title_modal_uploads}</h2>
              <button type="button" id="btnClose" name="btnClose" className="btn-close" onClick={closeModalUpload} />
            </header>
            <UploadContainer
              post={httpRequest.post}
              setURL={(dt: any) => handleChangeFile(dt)}
              type={typeUpload}
              id={location.id}
              url={config.location_url}
              aspect={aspect}
              sizes={sizes}
            />
            <footer>
              <button type="button" id="btnSave" name="btnSave" onClick={closeModalUpload}>
                {resource.button_modal_ok}
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
      <ModalSelectCover
        list={location.gallery ?? []}
        modalSelectGalleryOpen={modalSelectGalleryOpen}
        closeModalUploadGallery={toggleSelectGallery}
        setImageCover={saveImageCover}
      />
    </div>
  );
};
