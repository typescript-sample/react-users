import { HttpRequest } from 'axios-core';
import { FileInfo } from 'reactx-upload';
import { Client } from 'web-clients';
import { Room, RoomFilter, roomModel, RoomService } from './room';

export * from './room';

export class RoomClient extends Client<Room, string, RoomFilter> implements RoomService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, roomModel);
    this.searchGet = false;
    this.fetchImageUploadedGallery =this.fetchImageUploadedGallery.bind(this);
  }
  postOnly(s: RoomFilter): boolean {
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

    return this.http.patch<number>(this.url + `/${id}/gallery`, data).catch(e => e);
  }
}