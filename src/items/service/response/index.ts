import { HttpRequest } from 'axios-core';
import { SearchWebClient } from 'web-clients';
import { Response, ResponseFilter, ResponseService, responseModel } from './response';

export * from './response';

export class ResponseClient extends SearchWebClient<Response, ResponseFilter> implements ResponseService {
  constructor(protected http: HttpRequest, protected url: string) {
    super(http, url, responseModel);
    this.searchGet = false;
  }

  postOnly(s: ResponseFilter): boolean {
    return true;
  }

  response(id: string, author: string, obj: Response, ctx?: any): Promise<boolean> {
    const url = `${this.url}/${id}/${author}`;
    return this.http.post(url, obj, ctx);
  }
}

