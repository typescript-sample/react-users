import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Appreciation, Useful } from '../appreciation/appreciation';
import { appreciationModel, Reply, ReplyFilter, ReplyService, Result } from './appreciation-reply';

export * from './appreciation-reply';

export class ReplyClient extends Client<Reply, string, ReplyFilter> implements ReplyService {
  constructor(http: HttpRequest, public url: string) {
    super(http, url, appreciationModel);
    this.searchGet = true;
  }
  insertReply(obj: Appreciation): Promise<Result<Appreciation>> {
    const url = this.serviceUrl;
    return this.http.post<Result<Appreciation>>(url, obj);
  }
  usefulAppreciation(obj: Useful): Promise<number> {
    const url = this.url + '/useful';
    return this.http.post<number>(url, obj).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
}
