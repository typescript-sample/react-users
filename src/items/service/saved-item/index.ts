import { HttpRequest } from 'axios-core';
import { SearchResult } from 'onecore';
import { ViewClient } from 'web-clients';
import {SaveItem,SavedItemService,savedItemModel  } from './saveditem';

export * from './saveditem';

export class SavedItemClient extends ViewClient<SaveItem, string> implements SavedItemService {
  constructor(http: HttpRequest,protected url: string) {
    super(http, url, savedItemModel);
    this.getSavedItem=this.getSavedItem.bind(this)
  }
  getSavedItem(id:string):Promise<number>{
    const url = this.url + '/'+id
    return this.http.get(url)
  }
  savedItem(id:string,itemId:string):Promise<number>{
    const url = this.url + '/'+id+'/'+itemId
    return this.http.get(url)
  }
  unsavedItem(id: string, musicId: string): Promise<number> {
    const url = this.url + '/' + id + '/' + musicId
    return this.http.delete(url)
  }
}
