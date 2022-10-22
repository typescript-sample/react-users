import axios from 'axios';
import { storage } from 'uione';
import { FileUploads, Thumbnail } from './model';

const url = 'http://localhost:8080';
const urlYutuServece = 'http://localhost:8081';
const user: string|undefined = storage.getUserId();
export const fetchImageUploaded = (id: string): Promise<FileUploads[]> | FileUploads[] => {
  if (user) {
    return axios.get(url + `/uploads/${id}`).then(files => {
      return files.data as FileUploads[];
    });
  }
  return []
};

export const fetchThumbnailVideo = (videoId: string): Promise<Thumbnail> => {
  return axios.get(urlYutuServece + `/tube/video/${videoId}&thumbnail,standardThumbnail,mediumThumbnail,maxresThumbnail,highThumbnail`).then(thumbnail => {
    return thumbnail.data as Thumbnail;
  });
};
