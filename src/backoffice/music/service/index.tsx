import axios from "axios";
import { HttpRequest } from "axios-core";
import { options, storage } from "uione";
import { MusicClient, MusicService } from "./music";
export * from "./music";
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  backoffice_music_url: string;
}
class ApplicationContext {
  musicService?: MusicService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getMusicService = this.getMusicService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getMusicService(): MusicService {
    if (!this.musicService) {
      const c = this.getConfig();
      this.musicService = new MusicClient(httpRequest, c.backoffice_music_url);
    }
    return this.musicService;
  }
}

export const context = new ApplicationContext();

export function getMusicService(): MusicService {
  return context.getMusicService();
}
