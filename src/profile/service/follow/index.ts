import { HttpRequest } from 'axios-core';

export interface FollowService {
    follow(id:string,target:string):Promise<number|undefined>;
    unfollow(id:string,target:string):Promise<number>;
    checkfollow(id:string,target:string):Promise<number>;
    loadfollow(id:string):Promise<number>;
}

export class FollowClient implements FollowService {
  constructor(protected http: HttpRequest,protected url: string) {
    this.follow=this.follow.bind(this)
    this.unfollow=this.unfollow.bind(this)
  }
  follow(id:string,target:string):Promise<number|undefined>{
    const url = this.url + '/follow/'+id+'/'+target
    return this.http.get(url)
  }
  unfollow(id:string,target:string):Promise<number>{
    const url = this.url + '/unfollow/'+id+'/'+target
    return this.http.delete(url)
  }
  checkfollow(id:string,target:string):Promise<number>{
    const url = this.url + '/checkfollow/'+id+'/'+target
    return this.http.get(url)
  }
  loadfollow(id:string):Promise<number>{
    const url = this.url + '/loadfollow/'+id
    return this.http.get(url)
  }

}