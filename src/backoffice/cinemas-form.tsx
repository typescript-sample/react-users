import { ValueText } from 'onecore';
import React from 'react';
import { checked, OnClick, PageSizeSelect, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import { useCinema } from './service';
import { Cinema, CinemaFilter } from './service/cinema/cinema';
import 'leaflet/dist/leaflet.css';

interface CinemaSearch extends SearchComponentState<Cinema, CinemaFilter> {
  statusList: ValueText[];
}


const cimemasFilter: CinemaFilter = {
  id: '',
  name: '',
  status: '',
  longitude: 0,
  latitude: 0,
};

const initialState: CinemaSearch = {
  statusList: [],
  list: [],
  filter: cimemasFilter
};

export const BCinemasForm = () => {
  const refForm = React.useRef();
  const navigate = useNavigate();
  const { state,
    resource,
    component,
    updateState,
    search,
    sort,
    toggleFilter,
    changeView,
    pageChanged,
    pageSizeChanged } = useSearch<Cinema, CinemaFilter, CinemaSearch>(
      refForm,
      initialState,
      useCinema(),
      inputSearch());

  component.viewable = true;
  component.editable = true;

  const add = (e: OnClick) => {
    e.preventDefault();
    navigate(`add`);
  };

  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`edit/${id}`);
  };

  React.useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  //const { list } = state;
  const [list, setList] = React.useState<Cinema[]>([]);
  //const filter = value(state.filter);

  const [filter, setFilter] = React.useState<CinemaFilter>(
    value(state.filter)
  );

  React.useEffect(() => {
    if (state.list) { setList(state.list); }
    if (state.filter) { setFilter(state.filter); }
  }, [state]);

  // console.log(list);

  return (
    <div className='view-container'>
      <header>
        <h2>{resource.id}</h2>
        <div className='btn-group'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
          {component.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={add} />}
        </div>
      </header>
      <div>
        <form id='cinemasForm' name='cinemasForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group'>
            <label className='col s12 m4 search-input'>
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              <input type='text' id='q' name='q' value={filter.q} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
              <button type='button' className='btn-filter' onClick={toggleFilter} />
              <button type='submit' className='btn-search' onClick={search} />
            </label>
            <Pagination className='col s12 m8' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>
            <label className='col s12 m4 l4'>
              {resource.name}
              <input type='text'
                id='name' name='name'
                value={filter.name}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.name} />
            </label>
            <label className='col s12 m4 l4 checkbox-section'>
              {resource.status}
              <section className='checkbox-group'>
                <label>
                  <input
                    type='checkbox'
                    id='A'
                    name='status'
                    value='A'
                    checked={checked(filter.status, 'A')}
                    onChange={updateState} />
                  {resource.active}
                </label>
                <label>
                  <input
                    type='checkbox'
                    id='I'
                    name='status'
                    value='I'
                    checked={checked(filter.status, 'I')}
                    onChange={updateState} />
                  {resource.inactive}
                </label>
              </section>
            </label>
          </section>
        </form>
        <form className='list-result'>

          {component.view === 'table' && <div className='table-responsive'>
            <table>
              <thead>
                <tr>
                  <th data-field='Id'><button type='button' id='sortCinemaId' onClick={sort}>{resource.id}</button></th>
                  <th data-field='Name'><button type='button' id='sortName' onClick={sort}>{resource.name}</button></th>
                  <th data-field='Address'><button type='button' id='sortAddress' onClick={sort}>{resource.address}</button></th>
                </tr>
              </thead>
              {list && list.length > 0 && list.map((cinema, i) => {
                return (
                  <tr key={i} onClick={e => edit(e, cinema.id)}>
                    <td className='text-right'>{(cinema as any).id}</td>
                    <td>{cinema.name}</td>
                    <td>{cinema.address}</td>
                  </tr>
                );
              })}
            </table>
          </div>}
          {/* {component.view === 'table' && <div className='table-responsive'>
            <div style={{ height: '600px', width: '800px' }}>
              <MapContainer
                center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
                zoom={16}
                maxZoom={100}
                attributionControl={true}
                zoomControl={true}
                scrollWheelZoom={true}
                dragging={true}
                // animate={true}
                easeLinearity={0.35}
                style={{ height: '100%' }}
              // onclick={addMarker}
              >
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {list && list.length > 0 &&
                  list.map((cinema, idx) => (
                    <Marker
                      key={`marker-${idx}`}
                      position={[cinema.longitude, cinema.latitude]}
                      eventHandlers={{
                        click: (e) => {
                          navigate(`${cinema.id}`);
                          console.log(`${cinema.id}`);
                        }
                      }}
                    >
                      <Popup>
                        <span>{cinema.name}</span>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          </div>} */}

          {component.view !== 'table' && <ul className='row list-view'>
            {list && list.length > 0 && list.map((cinema, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, cinema.id)}>
                  <section>
                    <img src={cinema.imageURL && cinema.imageURL.length > 0 ? cinema.imageURL : ''} className='round-border' alt='film' />
                    <div>
                      <h3 className={cinema.status === 'I' ? 'inactive' : ''}>{cinema.name}</h3>
                    </div>
                    <button className='btn-detail' />
                  </section>
                </li>
              );
            })}
          </ul>}
          {/* {component.view !== 'table' && <ul className='row list-view'>
            {list && list.length > 0 && list.map((cinema, i) => {
              return (
                <CinemaCarousel cinema={cinema} edit={edit} />
              );
            })}
          </ul>} */}
        </form>
      </div>
    </div>
  );
};
