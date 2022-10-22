import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import axios from 'axios';

export interface FollowService {
    loadfollow(id:string):Promise<number>;
}

export class FollowClient implements FollowService {
  constructor(protected http: HttpRequest,protected url: string) {}
  loadfollow(id:string):Promise<number>{
    const url = this.url + '/loadfollow/'+id
    return this.http.get(url)
  }

}
export interface Config {
  user_follow_url: string;
}

const httpRequest = new HttpRequest(axios, options);
class ApplicationContext {
  followService?: FollowService


  getConfig(): Config {
    return storage.config();
  }
 
  getFollowService(): FollowService {
    if (!this.followService) {
      const c = this.getConfig();
      this.followService = new FollowClient(httpRequest, c.user_follow_url);
    }
    return this.followService;
  }
  
}

export const appContext = new ApplicationContext();

export function useFollowUserResponse(): FollowService {
  return appContext.getFollowService();
}