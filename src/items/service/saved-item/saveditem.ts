import { Attributes, ViewService, Tracking, SearchResult } from 'onecore';

export interface SaveItem extends Tracking {
  id: string;
  items: string[];
}

export interface SavedItemService extends ViewService<SaveItem, string> {
    getSavedItem(id:string):Promise<number>;
    savedItem(id:string,itemId:string):Promise<number>;
    unsavedItem(id: string, itemId: string): Promise<number>;
}

export const savedItemModel: Attributes = {
  id: {
    length: 40,
  },
  items:{
    type:'strings'
  }
};
