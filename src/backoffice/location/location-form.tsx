import * as Leaflet from 'leaflet';
import React, { useState } from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, OnClick, useEdit } from 'react-hook-core';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { inputEdit, Status } from 'uione';
import { getLocations } from './service';
import { Location } from './service/location/location';
interface InternalState {
  location: Location;
}

const createLocation = (): Location => {
  const location = createModel<Location>();
  return location;
};
const initialize = (id: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  load(id);
};

const initialState: InternalState = {
  location: {} as Location
};

const param: EditComponentParam<Location, string, InternalState> = {
  createModel: createLocation,
  initialize
};
interface Props {
  state: InternalState;
  setState: DispatchWithCallback<Partial<InternalState>>;
}
function LocationMarker({ state, setState }: Props) {
  const map = useMapEvents({
    click(e: Leaflet.LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setState({ location: { ...state.location, longitude: lat, latitude: lng } });
    },
  });
  return state.location === null ? null : (
    <Marker position={[state.location.longitude ?? 1, state.location.latitude ?? 1]}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export const BLocationForm = () => {
  const refForm = React.useRef();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const { resource, setState, updateState, flag, save, back, state } = useEdit<Location, string, InternalState>(refForm, initialState, getLocations(), inputEdit(), param);
  const location = state.location;

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = (e: OnClick) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  React.useEffect(() => {
    const L = require('leaflet');

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });
  }, []);

  const navigateUpload = (e: OnClick) => {
    e.preventDefault();
    navigate(`upload`);
  };
  const isUpload = React.useMemo(() => window.location.pathname.includes('upload'), [window.location.pathname])
  const header = React.useMemo(() =>
  (
    (flag.newMode ? resource.create : isUpload ? resource.upload : resource.edit) + " " 
    // eslint-disable-next-lin
  ), [flag.newMode, isUpload])
  return (
    <div className='view-container'>
      <form id='cinemaForm' name='cinemaForm' model-name='location' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} location</h2>
          {(!isUpload && !flag.newMode) && <button className='btn-group btn-left'><i onClick={() => navigate('upload')} className='material-icons'>photo</i></button>}

        </header>
        <div className='row'>
          <div className='col s12 m6'>
            <button onClick={openModal}>Map</button>
          </div>
        </div>
        <div className='row'>
        <label className="col s12 m6">
              {resource.location_id ?? "Location ID"}
              <input
                type="text"
                id="id"
                name="id"
                value={location.id}
                onChange={updateState}
                maxLength={20}
                required={true}
                readOnly={!flag.newMode}
                placeholder={resource.location_id ?? "Location ID"}
              />
            </label>
          <label className='col s12 m6'>
            Name
            <input
              type='text'
              id='name'
              name='name'
              value={location.name}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20} required={true}
              placeholder='Name' />
          </label>
          <label className='col s12 m6'>
            Longitude
            <input
              type='text'
              id='longitude'
              name='longitude'
              value={location.longitude}
              readOnly
              onChange={updateState}
              maxLength={20} required={true}
              placeholder='Longitude' />
          </label>
          <label className='col s12 m6'>
            Latitude
            <input
              type='text'
              id='latitude'
              name='latitude'
              value={location.latitude}
              readOnly
              onChange={updateState}
              maxLength={40} required={true}
              placeholder='Latitude' />
          </label>
          <label className='col s12 m6'>
            Type
            <input
              type='text'
              id='type'
              name='type'
              value={location.type}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20} required={true}
              placeholder='Type' />
          </label>
          <label className='col s12 m6'>
            Description
            <input
              type='text'
              id='description'
              name='description'
              value={location.description}
              onChange={updateState}
              maxLength={40} required={true}
              placeholder='Description' />
          </label>
          {/* <label className='col s12 m6'>
            Thumbnail
            <input
              type='text'
              id='thumbnail'
              name='thumbnail'
              value={location.thumbnail}
              onChange={updateState}
              maxLength={40}
              placeholder='Thumbnail' />
          </label> */}
          {/* <label className='col s12 m6'>
            ImageURL
            <input
              type='text'
              id='imageURL'
              name='imageURL'
              value={location.imageURL}
              onChange={updateState}
              required={true}
              placeholder='ImageURL' />
          </label> */}
          <div className='col s12 m6 radio-section'>
            {resource.status}
            <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  id='active'
                  name='status'
                  onChange={updateState}
                  value={Status.Active} checked={location.status === Status.Active} />
                {resource.yes}
              </label>
              <label>
                <input
                  type='radio'
                  id='inactive'
                  name='status'
                  onChange={updateState}
                  value={Status.Inactive} checked={location.status === Status.Inactive ? true : !location.status ?? true} />
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
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content small-width-height'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>Map</h2>
              <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={closeModal} />
            </header>
            <div >
              <MapContainer
                center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
                zoom={13}
                // maxZoom={100}
                attributionControl={true}
                zoomControl={true}
                scrollWheelZoom={true}
                dragging={true}
                easeLinearity={0.35}
                style={{ height: '550px', width: '100%' }}
              >
                <TileLayer
                  attribution='&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <LocationMarker state={state} setState={setState} />
              </MapContainer>
            </div>
            <footer>
              <button type='button' id='btnSave' name='btnSave' onClick={closeModal}>
                OK
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};
