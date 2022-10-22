import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { RateCriteriaFilter, Rates, RatesFilter, ratesModel, RatesService } from './rate';

export * from './rate';

export class RatesClient extends Client<Rates, string, RateCriteriaFilter> {
  constructor(http: HttpRequest, url: string) {
    super(http, url, ratesModel);
    this.getRate = this.getRate.bind(this);
    this.rate = this.rate.bind(this);
    this.searchGet = false;
  }
  postOnly(s: RatesFilter): boolean {
    return true;
  }
  rate(obj: Rates): Promise<any> {
    const url = `${this.serviceUrl}/${obj.id}/${obj.author}`;
    return this.http.post(url, obj);
  }
  getRate(obj: Rates, ctx?: any): Promise<Rates[]> {
    const url = `${this.serviceUrl}/search`;
    return this.http.post(url,obj, ctx);
  }
}
