import { HttpRequest } from 'axios-core';
import { ViewClient } from 'web-clients';
import { Music } from '../music';
import { SaveItem, SavedItemService, savedItemModel } from './savedmusic';

export * from './savedmusic';

export class SavedItemClient extends ViewClient<SaveItem, string> implements SavedItemService {
  constructor(http: HttpRequest, public url: string) {
    super(http, url, savedItemModel);
    
  }
  getSavedItem(id: string): Promise<number> {
    const url = this.url + '/' + id
    return this.http.get(url)
  }
  savedItem(id: string, musicId: string): Promise<number> {
    const url = this.url + '/' + id + '/' + musicId
    return this.http.get(url)
  }
  unsavedItem(id: string, musicId: string): Promise<number> {
    const url = this.url + '/' + id + '/' + musicId
    return this.http.delete(url)
  }
  getSavedListsong(id: string): Promise<Music[]> {
    const url = this.url + '/' + id
    return this.http.get(url)
  }
  savedListsong(id: string, musicId: string): Promise<number> {
    const url = this.url + '/' + id + '/' + musicId
    return this.http.get(url)
  }
}
