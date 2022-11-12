import { useEffect, useRef, useState } from 'react';
import { buildId } from 'react-hook-core';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import { getFileExtension, removeFileExtension } from 'reactx-upload';
import { useResource } from 'uione';
import imageOnline from '../assets/images/online.svg';
import { getUserService, User } from './service/user';
import { useFollowUserResponse, useUserComment, useUserRate, useUserReaction, useUserReact, useUserSearchRate } from './service'
import { storage } from 'uione';
import { Review } from "../review";
import { ApprecitaionPage } from './apppreciationPage';
export function UserPage() {
  const userId: string | undefined = storage.getUserId() || ''
  const { id = "" } = useParams()
  // console.log({id});

  const params = useParams();
  const [user, setUser] = useState<User>({} as User);
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [follow, setFollow] = useState<boolean>(false);
  const followService = useFollowUserResponse()
  const refId = useRef<string>();
  const refForm = useRef();
  const rateService = useUserRate();
  const searchRateService = useUserSearchRate();
  const reactionService = useUserReaction();
  const reactService = useUserReact();
  const commentService = useUserComment();
  const [react, setReact] = useState<string>('0');
  const locationPath = useLocation();

  useEffect(() => {
    refId.current = buildId<string>(params) || '';
    // console.log('refId', refId)
    getUserService().load(refId.current).then(usr => {
      if (usr) {
        setUser(usr);
        setUploadedAvatar(usr.imageURL);
        setUploadedCover(usr.coverURL);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loadReact = async () => {
    const rep: any = await reactService.checkReaction(id, userId)
    console.log(rep)
    if (rep > 0) {
      setReact(rep)
    }
  }
  useEffect(() => {
    loadReact()
  }, [])
  // useEffect(() => {
  //   if (parseInt(react)) {
  //     handleReact()
  //   }
  // }, [react])
  const handleReact = async (value:any) => {
    const rep = await reactService.react(id, userId, value)
    console.log("handle react: ",rep)
  }
  const handleUnreaction = async () => {
    const rep = await reactService.unreact(id, userId, react)
    console.log(rep)
  }
  const getUser = async (locId: string) => {
    const user = await getUserService().load(locId);
    if (user) {
      setUser(user);
      setUploadedAvatar(user.imageURL);
      setUploadedCover(user.coverURL);
    }
  };
  const resource = useResource();
  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };


  useEffect(() => {
    checkFollow()
  }, [])
  useEffect(() => {
    loadFollow()
  }, [follow])
  const loadFollow = async () => {
    if (id) {
      const rep: any = await followService.loadfollow(id)
      if (rep) {
        setFollower(rep.followercount)
        setFollowing(rep.followingcount)
      }
    }
  }
  const checkFollow = async () => {
    if (userId) {
      const rep = await followService.checkfollow(userId, id)
      if (rep) {
        setFollow(true)
      }
    }
  }
  const handleFollow = async (e: any) => {
    e.preventDefault()
    if (userId) {
      if (!follow) {
        const rep = await followService.follow(userId, id)
        if (rep) {
          setFollow(!follow)
          console.log("follow")
        }
      } else {
        const rep = await followService.unfollow(userId, id)
        if (rep) {
          setFollow(!follow)
          console.log("unfollow")
        }
      }
    }
  }

  return (
    <div className='profile view-container'>
      <form id='userForm' name='userForm' ref={refForm as any}>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            <img src={uploadedCover ? uploadedCover : 'https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg'} alt='cover' />
            {/* <div className='profile-reaction'>
              <select
                name="reaction"
                id="reaction"
                value={react}
                //defaultValue={react}
                onChange={async (e) => {
                  if (e.target.value === '0') {
                    handleUnreaction()
                  }
                  setReact(e.target.value)
                }
                }>
                <option value="0">None</option>
                <option value="1">Appreciate</option>
                <option value="2">Respect</option>
                <option value="3">Admire</option>
              </select>
            </div> */}
            <div className='contact-group'>
            <select
                name="reaction"
                id="reaction"
                value={react}
                //defaultValue={react}
                onChange={async (e) => {
                  if (e.target.value === '0') {
                    handleUnreaction()
                    setReact(e.target.value)
                  }else{
                    handleReact(e.target.value)
                    setReact(e.target.value)
                  }
                }
                }>
                <option value="0">None</option>
                <option value="1">Appreciate</option>
                <option value="2">Respect</option>
                <option value="3">Admire</option>
              </select>
              {/* <button id='btnPhone' name='btnPhone' className='btn-phone' />
              <button id='btnEmail' name='btnEmail' className='btn-email' /> */}
            </div>
            <button id='btnFollow' name='btnFollow' onClick={(e) => handleFollow(e)} className='btn-follow'>{follow ? 'UnFollow' : 'Follow'}</button>
          </div>
          <button id='btnCamera' name='btnCamera' className='btn-camera' />
          <div className='avatar-wrapper'>
            <img className='avatar'
              src={getImageBySize(uploadedAvatar, 400) || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} alt='avatar' />
            <img className='profile-status' src={imageOnline} alt='status' />
          </div>
          <div className='profile-title'>
            <h3>{user.displayName}</h3>
            <p>{user.website}</p>
          </div>
          <div className='profile-followers' style={{left: "150px",
  position: "absolute",
  width: "fit-content",
  bottom: 0}}>
            <p><i className='material-icons highlight'>group</i> {follower}</p>
            <p><i className='material-icons highlight'>group_add</i> {following}</p>
          </div>
          <nav className='menu'>
            <ul>
              <li><Link to={`/profile/${refId.current}`}  > Overview </Link></li>
              <li><Link to={`/profile/${refId.current}/appreciation`}  > Appreciation </Link></li>
              <li><Link to={`/profile/${refId.current}/review`}  > Review </Link></li>
            </ul>
          </nav>
        </header>
        <div className='row'>

          <Review i={user} get={getUser} id={id} userId={userId} rateRange={10} rateService={rateService} searchRateService={searchRateService} reactionService={reactionService} commentService={commentService} />
        </div>
        {/* <Appreciations /> */}
       {!window.location.pathname.includes('review') &&  window.location.pathname.includes('appreciation')&& <ApprecitaionPage id={id} userId={userId} />}
        {!window.location.pathname.includes('appreciation') && !window.location.pathname.includes('review') &&
          <div className='row'>
            <div className='col m12 l4'>
              {(user.occupation || user.company) && <div className='card'>
                <header>
                  <i className='material-icons highlight'>account_box</i>
                  {resource.user_profile_basic_info}
                </header>
                {user.occupation && <p>{user.occupation}</p>}
                {user.company && <p>{user.company}</p>}
              </div>
              }
              {user.skills && user.skills.length > 0 && <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                </header>
                <section>
                  {
                    user.skills.map((item, index) => {
                      return <p key={index}>{item.skill}<i hidden={!item.hirable} className='star highlight' /></p>;
                    })
                  }
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />
                    {resource.user_profile_hireable_skill}
                  </p>
                </section>
              </div>}
              {user.lookingFor && user.lookingFor.length > 0 && <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                </header>
                <section>
                  {
                    user.lookingFor.map((item, index) => {
                      return (<p key={index}>{item}</p>);
                    })
                  }
                </section>
              </div>
              }
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>chat</i>
                  {resource.user_profile_social}
                </header>
                <div>
                  {user.links && Object.keys(user.links).map((key: string, index) => {
                    return (
                      <a key={index} href={`https://${key}/` + (user.links as any)[key]} title={key} target='_blank' rel='noreferrer'>
                        <i className={`fab fa-${key}`} />
                        <span>{key}</span>
                      </a>
                    )
                  })}
                  {
                    user.customLink01 &&
                    <a href={user.customLink01} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink02 &&
                    <a href={user.customLink02} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink03 && <a href={user.customLink03} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink04 && <a href={user.customLink04} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink05 && <a href={user.customLink05} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink06 && <a href={user.customLink06} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink07 && <a href={user.customLink07} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink08 && <a href={user.customLink08} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                </div>
              </div>
            </div>
            <div className='col m12 l8'>
              {user.bio && user.bio.length > 0 && <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight'>person</i>
                  {resource.user_profile_bio}
                </header>
                <p>{user.bio}</p>
              </div>
              }
              {user.interests && user.interests.length > 0 && <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight'>flash_on</i>
                  {resource.interests}
                </header>
                <section className='row'>
                  {
                    user.interests.map((item, index) => {
                      return (<span key={index} className='col s4'>{item}</span>);
                    })
                  }
                </section>
              </div>}

              {user.achievements && user.achievements.length > 0 && <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight'>beenhere</i>
                  {resource.achievements}
                </header>
                {
                  user.achievements && user.achievements.map((achievement, index) => {
                    return <section key={index}>
                      <h3>{achievement.subject}
                        {achievement.highlight && <i className='star highlight float-right' />}
                      </h3>
                      <p className='description'>{achievement.description}</p>
                      <hr />
                    </section>;
                  })
                }
              </div>
              }
              <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight btn-camera'></i>
                  {resource.title_modal_gallery}

                </header>
                <section className='row'>
                  <div className='user-carousel-container'>
                    <Carousel infiniteLoop={true}>
                      {user.gallery
                        ? user.gallery.map((itemData, index) => {
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
          </div>}
      </form>
    </div>
  );
}

