import { OnClick, useUpdate } from 'react-hook-core';
import './general-info.css';
import { useMyProfileService, User } from './my-profile';

interface Props {
  user: User;
  resource: any;
  close: any;
  saveEmit: any;
}
interface State {
  user: User;
}
export const GeneralInfo = ({ resource, user, close, saveEmit }: Props) => {
  const service = useMyProfileService();
  const { state, setState, updateState } = useUpdate<State>({ user }, 'user');

  const closeModal = () => {
    close();
  };

  const save = (e: OnClick) => {
    e.preventDefault();
    const usr = state.user;
    service.saveMyProfile({ ...usr, id: usr.id }).then(success => {
      let status = '';
      if (success) {
        status = 'success';
        setState({ user: usr });
      } else {
        status = 'fail';
      }
      saveEmit({ status, user: usr });
      close();
    });
  };

  return (
    <div className='view-container profile-info'>
      <form model-name='data'>
        <header>
          <h2>{resource.user_profile_general_info}</h2>
          <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={closeModal} />
        </header>
        <div>
          <section className='row'>
            <h4>{resource.user_profile_basic_info}</h4>
            <label className='col s12 m6'>
              {resource.first_name}
              <input id='givenName' name='givenName'
                value={state.user.givenName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.placeholder_user_profile_first_name} />
            </label>
            <label className='col s12 m6'>
              {resource.last_name}
              <input id='familyName' name='familyName'
                value={state.user.familyName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.placeholder_user_profile_last_name} />
            </label>
            <label className='col s12 m6'>
              {resource.user_profile_occupation}
              <input id='occupation' name='occupation'
                value={state.user.occupation}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_occupation} />
            </label>
            <label className='col s12 m6'>
              {resource.user_profile_company}
              <input id='company' name='company'
                value={state.user.company}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_company} />
            </label>
            <label className='col s12'>
              {resource.user_profile_website}
              <input id='website' name='website'
                data-type='url'
                value={state.user.website}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_website} />
            </label>
          </section>
          <section>
            <h4>{resource.user_profile_social}</h4>
            <label className='inline-input'>
              <i className='fab fa-facebook' />
              <input id='facebook' maxLength={100} name='facebookLink' data-field='links.facebook'
                onChange={updateState} placeholder={resource.user_profile_facebook}
                value={state.user.links?.facebook || ''} />
            </label>
            <label className='inline-input'>
              <i className='fab fa-linkedin' />
              <input id='linkedin' maxLength={100} onChange={updateState} data-field='links.linkedin'
                placeholder={resource.user_profile_linkedIn} name='linkedinLink' value={state.user.links?.linkedin || ''} />
            </label>
            <label className='inline-input'>
              <i className='fab fa-instagram' />
              <input id='instagram' maxLength={100} onChange={updateState} data-field='links.instagram'
                placeholder={resource.user_profile_instagram} name='instagramLink'
                value={state.user.links?.instagram || ''} />
            </label>
            <label className='inline-input'>
              <i className='fab fa-twitter' />
              <input id='twitter' maxLength={100} onChange={updateState} data-field='links.twitter'
                placeholder={resource.user_profile_twitter} name='twitterLink' value={state.user.links?.twitter || ''} />
            </label>
            <label className='inline-input'>
              <i className='fab fa-skype' />
              <input id='skype' name='skypeLink' maxLength={100} data-field='links.skype'
                onChange={updateState}
                placeholder={resource.user_profile_skype} value={state.user.links?.skype || ''} />
            </label>
            <label className='inline-input'>
              <i className='fab fa-dribbble' />
              <input id='dribble' name='dribbbleLink' maxLength={100} data-field='links.dribble'
                onChange={updateState}
                placeholder={resource.user_profile_dribbble} value={state.user.links?.dribble || ''} />
            </label>
            <label className='inline-input'>
              <i className='fab fa-google' />
              <input id='google' name='google' maxLength={100} data-field='links.google'
                onChange={updateState}
                placeholder={resource.user_profile_google} value={state.user.links?.google || ''} />
            </label>
          </section>
        </div>
        <footer>
          <button type='button' id='btnSave' name='btnSave' onClick={save}>
            {resource.save}
          </button>
        </footer>
      </form>
    </div>);
};
export default GeneralInfo;
