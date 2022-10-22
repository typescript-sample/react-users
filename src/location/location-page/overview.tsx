import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLocationsService, Location } from '../service';

export const Overview = () => {
  const locationPath = useLocation();
  const params = useParams();
  const [location, setLocation] = useState<Location>();
  const locationService = useLocationsService();
  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const load = async () => {

    const { id } = params;
    const locationObj = await locationService.load(id || '');
    if (locationObj) {
      setLocation(locationObj);
    }
  };

  if (locationPath.pathname.split('/').length === 3) {
    return (
      <div>
        <form className='list-result'>
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
              {location && location.id &&

                <Marker
                  // key={`marker-1`}
                  position={[location.longitude, location.latitude]}

                >
                  <Popup>
                    <span>{location.name}</span>
                  </Popup>
                </Marker>
              }
            </MapContainer>
          </div>
        </form>
      </div>
    );
  }
  return null;
};
