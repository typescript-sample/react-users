
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Cinema, useCinema } from '../service';


export interface Props {
  cinema: Cinema;
}

export const CinemaOverview = ({cinema}:Props ) => {
  const locationPath = useLocation();

  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  if (cinema && locationPath.pathname.split('/').length === 3) {
    return (
      <div>
        <form className='list-result'>
          <div className='div-overview'>
            <MapContainer
              center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
              zoom={16}
              maxZoom={100}
              attributionControl={true}
              zoomControl={true}
              scrollWheelZoom={true}
              dragging={true}
              easeLinearity={0.35}
              style={{ height: '100%', width: '1024px'}}  
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {cinema && cinema.id &&
                <Marker
                  position={[cinema.longitude, cinema.latitude]}
                >
                  <Popup>
                    <span>{cinema.name}</span>
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
