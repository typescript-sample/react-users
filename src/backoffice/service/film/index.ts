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

export * from './film';

const httpRequest = new HttpRequest(axios, options);

export class FilmClient extends Client<Film, string, FilmFilter> implements FilmService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, filmModel);
    this.searchGet = true;
    this.getFilmsByCategoryId = this.getFilmsByCategoryId.bind(this);

  }
  getFilmsByCategoryId(id: string): Promise<FilmSearch> {
    const url = `${this.serviceUrl}/search?categories[]={${id}}`;
    return this.http.get<FilmSearch>(url);
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