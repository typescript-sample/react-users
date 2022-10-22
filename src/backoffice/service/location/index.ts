import { FileInfo, Thumbnail } from 'reactx-upload';
import { storage } from 'uione';
import { HttpRequest } from 'web-clients';
import { Client } from 'web-clients';
import { config } from '../../../config';
import { LocationRate } from '../location-rate/location-rate';
import {
  Location,
  LocationFilter,
  locationModel,
  LocationService,
} from './location';
export class LocationClient
  extends Client<Location, string, LocationFilter>
  implements LocationService {
  private user: string | undefined = storage.getUserId();
  constructor(http: HttpRequest, url: string) {
    super(http, url, locationModel);
    this.searchGet = true;
    this.getLocationByType = this.getLocationByType.bind(this);
    this.rateLocation = this.rateLocation.bind(this);
  }

  getLocationByType(type: string): Promise<Location[]> {
    const url = this.serviceUrl + '/type/' + type;
    return this.http.get(url);
  }
  rateLocation(obj: LocationRate): Promise<any> {
    const url = this.serviceUrl + '/rateLocation';
    return this.http.post(url, obj);
  }
  fetchImageUploaded = (id: string): Promise<FileInfo[]> | FileInfo[] => {
    if (this.user) {
      return this.http
        .get(config.location_url + `/uploads/${id}`)
        .then((files: any) => {
          return files as FileInfo[];
        });
    }
    return [];
  }
  fetchThumbnailVideo = async (videoId: string): Promise<Thumbnail> => {
    const urlYutuServece = 'http://localhost:8081';
    return this.http
      .get(
        urlYutuServece +
        `/tube/video/${videoId}&thumbnail,standardThumbnail,mediumThumbnail,maxresThumbnail,highThumbnail`
      )
      .then((thumbnail: any) => {
        return thumbnail.data as Thumbnail;
      });
  }
}
