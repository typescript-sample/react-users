import { HttpRequest } from 'axios-core';
import { Client, Result, SearchResult } from 'web-clients';
import { Reply } from '../appreciation-reply';
import { Appreciation, AppreciationFilter, AppreciationId, appreciationModel, AppreciationService, Useful } from './appreciation';

export * from './appreciation';

export class AppreciationClient extends Client<Appreciation, AppreciationId, AppreciationFilter> implements AppreciationService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, appreciationModel);
    this.searchGet = false;
    this.usefulAppreciation = this.usefulAppreciation.bind(this);
  }
  postOnly(s: AppreciationFilter): boolean {
    return true;
  }
  
  reply(reply: Appreciation): Promise<number> {
    console.log(this.url);
    
    const url = this.url + `/${reply.id}/${reply.author}`;
    return this.http.post<number>(url, reply).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  };

  appreciation(obj: Appreciation): Promise<number> {
    const url = this.url + `/${obj.id}/${obj.author}`;
    console.log(this.url);
    
    return this.http.post<number>(url, obj).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
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
  comment(reply: Reply): Promise<boolean> {
    const url = this.url + `/${reply.id}/${reply.author}/comments/${reply.userId}`;
    return this.http.post<boolean>(url, reply).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return false;
      }
      throw err;
    });
  };
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const url = this.url + `/comments/${id}/${author}/${userId}`;
    return this.http.delete<number>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  };
  updateReply(reply: Reply): Promise<number> {
    const url = this.url + `/comments/${reply.id}/${reply.author}/${reply.userId}`;
    return this.http.put<number>(url, reply).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  };
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const url = this.url + `/comment/${id}/${author}/${userId}`;
    return this.http.delete<number>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  };

  delete(id: AppreciationId, ctx?: any): Promise<number> {
    const url = this.url + `/${id.id}/${id.author}`;
    return this.http.delete<number>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
  update(obj: Appreciation, ctx?: any): Promise<Result<Appreciation>> {
    const url = this.url + `/${obj.id}/${obj.author}`;
    return this.http.put<number>(url, obj).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
  getReplys(id: string, author: string, ctx?: any): Promise<Result<Reply>> {
    const url = this.url + `/comments`;
    return this.http.post<Result<Reply>>(url,{id,author}).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }


}
