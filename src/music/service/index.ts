import axios from "axios";
import { HttpRequest } from "axios-core";
import { options, storage } from "uione";

import { MusicClient, MusicService } from "./music";
import { PlaylistClient, PlaylistService } from "./playlist";
import { SavedItemClient, SavedItemService } from "./saved-music";


const httpRequest = new HttpRequest(axios, options);
export interface Config {
  music_url: string;
  playlist_url: string;
  saved_music_url: string;
  saved_listsong_url: string;

}
class ApplicationContext {
  musicService?: MusicService;
  playlistService?: PlaylistService;
  savedItemService?: SavedItemService;


  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getMusicService = this.getMusicService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getSavedItemService(): SavedItemService {
    if (!this.savedItemService) {
      const c = this.getConfig();
      this.savedItemService = new SavedItemClient(httpRequest, c.saved_music_url);
    }
    return this.savedItemService;
  }
  getSavedListsongService(): SavedItemService {
    if (!this.savedItemService) {
      const c = this.getConfig();
      this.savedItemService = new SavedItemClient(httpRequest, c.saved_listsong_url);
    }
    return this.savedItemService;
  }

  getMusicService(): MusicService {
    if (!this.musicService) {
      const c = this.getConfig();
      this.musicService = new MusicClient(httpRequest, c.music_url);
    }
    return this.musicService;
  }
  getPlaylistService(): PlaylistService {
    if (!this.playlistService) {
      const c = this.getConfig();
      this.playlistService = new PlaylistClient(httpRequest, c.playlist_url);
    }
    return this.playlistService;
  }

}

export const context = new ApplicationContext();

export function useMusic(): MusicService {
  return context.getMusicService();
}
export function usePlaylist(): PlaylistService {
  return context.getPlaylistService();
}

export function useSavedItemResponse(): SavedItemService {
  return context.getSavedItemService();
}
export function useSavedListsongResponse(): SavedItemService {
  return context.getSavedListsongService();
}
