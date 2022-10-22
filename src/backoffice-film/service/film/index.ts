import axios from "axios";
import { HttpRequest } from 'axios-core';
import { useState } from "react";
import { Client, QueryClient } from 'web-clients';
import { QueryService } from "onecore";
import { options, storage } from "uione";
import {
  Film,
  FilmFilter,
  filmModel,
  FilmSearch,
  FilmService
} from './film';
import { FileInfo } from "reactx-upload";

export * from './film';

const httpRequest = new HttpRequest(axios, options);

export class FilmClient extends Client<Film, string, FilmFilter> implements FilmService {
  constructor(http: HttpRequest,private url: string) {
    super(http, url, filmModel);
    this.searchGet = true;
    this.getFilmsByCategoryId = this.getFilmsByCategoryId.bind(this);
    this.fetchImageUploadedGallery =this.fetchImageUploadedGallery.bind(this);
  }
  getFilmsByCategoryId(id: string): Promise<FilmSearch> {
    const url = `${this.serviceUrl}/search?categories[]={${id}}`;
    return this.http.get<FilmSearch>(url);
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

export interface Config {
  film_url: string;
  directors_url: string;
}
class ApplicationContext {
  filmService?: FilmService;
  directorsService?: QueryService<string>;

  getConfig(): Config {
    return storage.config();
  }

  getFilmService(): FilmService {
    if (!this.filmService) {
      const c = this.getConfig();
      this.filmService = new FilmClient(httpRequest, c.film_url);
    }
    return this.filmService;
  }

  getDirectorsService(): QueryService<string> {
    if (!this.directorsService) {
      const c = this.getConfig();
      this.directorsService = new QueryClient<string>(httpRequest, c.directors_url);
    }
    return this.directorsService;
  }
}

export const context = new ApplicationContext();

export function useDirectorsService(): QueryService<string> {
  const [service] = useState(() => context.getDirectorsService());
  return service;
}