import axios from "axios";
import { useState } from "react";
import { options, storage } from "uione";
import { QueryService } from "onecore";
import { HttpRequest } from "axios-core";
import { Client, QueryClient } from "web-clients";
import { Music, MusicFilter, musicModel, MusicService } from "./music";

export * from "./music";

const httpRequest = new HttpRequest(axios, options);
export class MusicClient
  extends Client<Music, string, MusicFilter>
  implements MusicService
{
  constructor(http: HttpRequest, private url: string) {
    super(http, url, musicModel);
    this.searchGet = false;
  }

  postOnly(s: MusicFilter): boolean {
    return true;
  }

}

export interface Config {
  music_url: string;
  music_author_url: string;
}
class ApplicationContext {
  musicService?: MusicService;
  authorService?: QueryService<string>;

  getConfig(): Config {
    return storage.config();
  }

  getMusicService(): MusicService {
    if (!this.musicService) {
      const c = this.getConfig();
      this.musicService = new MusicClient(httpRequest, c.music_url);
    }
    return this.musicService;
  }

  getAuthorService(): QueryService<string> {
    if (!this.authorService) {
      const c = this.getConfig();
      this.authorService = new QueryClient<string>(httpRequest, c.music_author_url);
    }
    return this.authorService;
  }
}

export const context = new ApplicationContext();

export function useAuthorService(): QueryService<string> {
  const [service] = useState(() => context.getAuthorService());
  return service;
}
