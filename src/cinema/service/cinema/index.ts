import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import {
  Cinema,
  CinemaFilter,
  cinemaModel,
  CinemaService,
  CinemaRate, CinemaRateFilter, cinemaRateModel
} from './cinema';

export * from './cinema';

export class CinemaClient extends Client<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, cinemaModel);
    this.searchGet = true;
    this.getCinemasByRole = this.getCinemasByRole.bind(this);
  }

  getCinemasByRole(id: string): Promise<Cinema[]> {
    const url = `${this.serviceUrl}`;
    return this.http.get<Cinema[]>(url);
  }

  rateCinema(obj: CinemaRate): Promise<any> {
    const url = `${this.serviceUrl}/rate`;
    // console.log(url);
    return this.http.post(url, obj);
  }
}

export class CinemaRateClient extends Client<CinemaRate, string, CinemaRateFilter>{
  constructor(http: HttpRequest, url: string) {
    super(http, url, cinemaRateModel);
  }

  protected postOnly(s: CinemaRate): boolean {
    return true;
  }
}
