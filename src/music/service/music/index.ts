import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import {
  Music,
  MusicFilter,
  musicModel,
  MusicService,
} from './music';

export * from './music';

export class MusicClient extends Client<Music, string, MusicFilter> implements MusicService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, musicModel);
    this.searchGet = true;
  }
  postOnly(s: MusicFilter): boolean {
    return true;
  }
}

