import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import LocationCarousel from './carousel';
import { Location } from './service/location/location';
import { useSavedItemResponse } from './service'
import { storage } from "uione";


export const MyLocation = () => {
  const savedItemService = useSavedItemResponse();
  const userId: string | undefined = storage.getUserId() || "";
  const [list, setList] = React.useState<Location[]>()
  const navigate = useNavigate();
  React.useEffect(() => {
    loadSavedItem();
  }, []);
  const loadSavedItem = async () => {
    if (!userId) {
      return;
    }
    const result: any = await savedItemService.getSavedItem(userId);
    setList(result)
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

  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`/locations/${id}`);
  };
  const [viewList, setViewList] = React.useState(true);
  const onSetViewList = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setViewList(!viewList);
  };

  return (
    <div className='view-container'>
      <header>
        <div className='btn-group'>
          {!viewList && (
            <button
              type='button'
              id='btnListView'
              name='btnListView'
              className='btn-grid'
              onClick={(e) => onSetViewList(e)}
            />
          )}
          {viewList && (
            <button
              type='button'
              id='btnListView'
              name='btnListView'
              className='btn-map'
              data-view='listview'
              onClick={(e) => onSetViewList(e)}
            >
              <span className='material-icons-outlined'></span>
            </button>
          )}
        </div>
      </header>
      <div>
        <form className='list-result'>
          {viewList ? (
            <ul className='row list-view 2'>
              {list &&
                list.length > 0 &&
                list.map((location, i) => (
                  <LocationCarousel location={location} edit={edit} isChecked={true} />
                ))}
            </ul>
          ) : (
            <div style={{ height: '600px', width: '800px' }}>
              <MapContainer
                center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
                zoom={16}
                maxZoom={100}
                attributionControl={true}
                zoomControl={true}
                scrollWheelZoom={true}
                dragging={true}
                easeLinearity={0.35}
                style={{ height: '100%' }}
              >
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {list &&
                  list.map((location, idx) => (
                    <Marker
                      key={`marker-${idx}`}
                      position={[location.longitude, location.latitude]}
                      eventHandlers={{
                        click: (e) => {
                          navigate(`${location.id}`);
                        }
                      }}
                    >
                      <Popup>
                        <span>{location.name}</span>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
