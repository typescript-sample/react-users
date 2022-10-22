import React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';

import { inputEdit, Status } from 'uione';
import { Cinema, useCinema } from './service';

interface InternalState {
  cinema: Cinema;
}

const createCinema = (): Cinema => {
  const cinema = createModel<Cinema>();
  cinema.status = Status.Active;
  return cinema;
};
const initialize = (id: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  load(id);
};

const initialState: InternalState = {
  cinema: {} as Cinema
};

const param: EditComponentParam<Cinema, string, InternalState> = {
  createModel: createCinema,
  initialize
};
export const BCinemaForm = () => {
  const refForm = React.useRef();
  const { resource, updateState, flag, save, back, state } = useEdit<Cinema, string, InternalState>(refForm, initialState, useCinema(), inputEdit(), param);
  const cinema = state.cinema;
  return (
    <div className='view-container'>
      <form id='cinemaForm' name='cinemaForm' model-name='cinema' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} cinema</h2>
        </header>
        <div className='row'>
          <label className='col s12 m6'>
            Cinema Id
            <input
              type='text'
              id='id'
              name='id'
              value={cinema.id}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20} required={true}
              placeholder={resource.user_id} />
          </label>
          <label className='col s12 m6'>
            {resource.display_name}
            <input
              type='text'
              id='name'
              name='name'
              value={cinema.name}
              onChange={updateState}
              maxLength={40} required={true}
              placeholder={resource.display_name} />
          </label>
          <label className='col s12 m6'>
            Address
            <input
              type='text'
              id='address'
              name='address'
              value={cinema.address}
              onChange={updateState}
              maxLength={40} required={true}
              placeholder='Address' />
          </label>
          <label className='col s12 m6'>
            Cinema Group
            <input
              type='text'
              id='parent'
              name='parent'
              value={cinema.parent}
              onChange={updateState}
              maxLength={40} required={true}
              placeholder='Cinema Group' />
          </label>
          <div className='col s12 m6 radio-section'>
            {resource.status}
            <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  id='active'
                  name='status'
                  onChange={updateState}
                  value={Status.Active} checked={cinema.status === Status.Active} />
                {resource.yes}
              </label>
              <label>
                <input
                  type='radio'
                  id='inactive'
                  name='status'
                  onChange={updateState}
                  value={Status.Inactive} checked={cinema.status === Status.Inactive} />
                {resource.no}
              </label>
            </div>
          </div>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={save}>
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>
  );
};
