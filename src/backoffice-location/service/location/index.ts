import { FileInfo, Thumbnail } from "reactx-upload";
import { storage } from "uione";
import { HttpRequest } from "web-clients";
import { Client } from "web-clients";
import { config } from "../../../config";
import { Location, LocationFilter, locationModel, LocationService } from "./location";
export class LocationClient extends Client<Location, string, LocationFilter> implements LocationService {
  private user: string | undefined = storage.getUserId();
  constructor(protected http: HttpRequest,private url: string) {
    super(http, url, locationModel);
    this.searchGet = true;
    this.getLocationByType = this.getLocationByType.bind(this);
    this.fetchImageUploadedGallery=this.fetchImageUploadedGallery.bind(this)
  }

  getLocationByType(type: string): Promise<Location[]> {
    const url = this.serviceUrl + "/type/" + type;
    return this.http.get(url);
  }
  fetchImageUploaded = (id: string): Promise<FileInfo[]> | FileInfo[] => {
    if (this.user) {
      return this.http.get(config.location_url + `/uploads/${id}`).then((files: any) => {
        return files as FileInfo[];
      });
    }
    return [];
  };
  fetchThumbnailVideo = async (videoId: string): Promise<Thumbnail> => {
    const urlYutuServece = "http://localhost:8081";
    return this.http
      .get(
        urlYutuServece +
          `/tube/video/${videoId}&thumbnail,standardThumbnail,mediumThumbnail,maxresThumbnail,highThumbnail`
      )
      .then((thumbnail: any) => {
        return thumbnail.data as Thumbnail;
      });
  };
  fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []> {
    return this.http.get<FileInfo[]>(this.url + `/${id}/fetchImageGalleryUploaded`).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return [];
      }
      throw err;
    });
  }

  deleteFile = (id: string, fileUrl: string): Promise<number> => {
    if (id) {
      return this.http.delete(this.url + `/${id}/gallery?&url=${fileUrl}`).then(() => {
        return 1;
      }).catch(() => 0);
    }
    return new Promise(resolve => resolve(0));
  }

  deleteFileYoutube = (id: string, fileUrl: string): Promise<number> => {
    if (id) {
      return this.http.delete(this.url + `/${id}/external-resource?url=${fileUrl}`).then(() => {
        return 1;
      }).catch(() => 0);
    }
    return new Promise(resolve => resolve(0));
  }

  uploadExternalResource = (id: string, videoId: string): Promise<number> => {
    return this.http.post(this.url + `/${id}/external-resource?type=${'youtube'}&url=${'https://www.youtube.com/embed/' + videoId}`, {}).then(() => 1).catch(() => 0);
  }

  updateData = (id: string, data: FileInfo[]): Promise<number> => {
    const body = {
      data,
      userId: id
    };
    return this.http.patch<number>(this.url + `/${id}/gallery`, body).catch(e => e);
  }
}
