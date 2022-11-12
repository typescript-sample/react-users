import { HttpRequest } from 'axios-core';
import { SearchWebClient } from 'web-clients';
import { Rate, RateFilter, RateService, rateModel, SearchRateService } from './rate';

export * from './rate';

export class SearchRateClient extends SearchWebClient<Rate, RateFilter> implements SearchRateService{
  constructor(protected http: HttpRequest, protected serviceUrl: string) {
    super(http, serviceUrl, rateModel);
    this.searchGet = false;
  }
  postOnly(s: RateFilter): boolean {
    return true;
  }
}
export class RateClient implements RateService {
  constructor(protected http: HttpRequest, protected serviceUrl: string) {
    this.rate = this.rate.bind(this)
  }
  

  rate(id: string, author: string, obj: Rate, ctx?: any): Promise<boolean> {
    const url = `${this.serviceUrl}/${id}/${author}`;
    return this.http.post(url, obj, ctx);
  }
}



