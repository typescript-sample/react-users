import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import {
  Film,
  FilmFilter,
  filmModel,
  FilmSearch,
  FilmService,
  FilmRateService,
  FilmRate,
  FilmRateFilter,
  filmRateModel
} from './film';

export * from './film';

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
  rateFilm(obj: FilmRate): Promise<any>{
    const url = `${this.serviceUrl}/rate`;
    return this.http.post(url, obj);
  }
}

export class FilmRateClient extends Client<FilmRate, string, FilmRateFilter> implements FilmRateService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, filmRateModel);
  }
  protected postOnly(s: FilmRate): boolean {
    return true;
  }
}
