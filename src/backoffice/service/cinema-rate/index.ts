import { HttpRequest } from 'web-clients';
import { Client } from 'web-clients';
import { CinemaRate, CinemaRateFilter, cinemaRateModel, CinemaRateService } from './cinema-rate';

export * from './cinema-rate';

export class CinemaRateClient extends Client<CinemaRate, string, CinemaRateFilter> implements CinemaRateService {
  constructor(http: HttpRequest, url: string, protected locationUrl: string){
    super(http, url, cinemaRateModel);
    this.searchGet = true;
    this.getCinemaByCinemaId = this.getCinemaByCinemaId.bind(this);
  }

  getCinemaByCinemaId(cinemaId: string): Promise<CinemaRate[]>{
    const url = this.locationUrl + '/' + cinemaId;
    return this.http.get(url);
  }
}