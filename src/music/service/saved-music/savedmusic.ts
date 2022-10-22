import { Attributes, ViewService, Tracking } from 'onecore';
import { Music } from '../music';

export interface SaveItem extends Tracking {
  id: string;
  songs: string[];
}

export interface SavedItemService extends ViewService<SaveItem, string> {
  getSavedItem(id: string): Promise<number>;
  savedItem(id: string, itemId: string): Promise<number>;
  unsavedItem(id: string, itemId: string): Promise<number>;
  getSavedListsong(id: string): Promise<Music[]>;
  savedListsong(id: string, itemId: string): Promise<number>;
}

export const savedItemModel: Attributes = {
  id: {
    length: 40,
  },
  songs: {
    type: 'strings'
  }
};
