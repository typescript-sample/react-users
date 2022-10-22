import { HttpRequest } from 'axios-core';
import { FileInfo } from 'reactx-upload';
import { Client } from 'web-clients';
import { Cinema, CinemaFilter, cinemaModel, CinemaService } from './cinema';

export * from './cinema';

export class CinemaClient extends Client<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(protected http: HttpRequest,private url: string) {
    super(http, url, cinemaModel);
    this.searchGet = true;
    this.getCinemasByRole = this.getCinemasByRole.bind(this);
    this.fetchImageUploadedGallery=this.fetchImageUploadedGallery.bind(this)
  }
  getCinemasByRole(id: string): Promise<Cinema[]> {
    const url = `${this.serviceUrl}`;
    return this.http.get<Cinema[]>(url);
  }
  postOnly(s: CinemaFilter): boolean {
    return true;
  }
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
