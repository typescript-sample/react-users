import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Item, ItemFilter, itemModel, ItemService } from './item';

export * from './item';

export class ItemClient extends Client<Item, string, ItemFilter> implements ItemService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, itemModel);
  }
  postOnly(s: ItemFilter): boolean {
    return true;
  }
}
