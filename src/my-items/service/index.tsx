import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { ItemClient, ItemService } from './item';
import { CategoryClient, CategoryService } from './category';
export * from './item';
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  my_item_url: string;
  item_category_url: string;
}
class ApplicationContext {
  itemService?: ItemService;
  categoryService?: CategoryService;
  constructor() {
    this.getConfig = this.getConfig.bind(this); 
    this.getItemService = this.getItemService.bind(this); 
    this.getCategoryService = this.getCategoryService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getItemService(): ItemService {
    if (!this.itemService) {
      const c = this.getConfig();
      this.itemService = new ItemClient(httpRequest, c.my_item_url);
    }
    return this.itemService;
  }

  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      const c = this.getConfig();
      this.categoryService = new CategoryClient(httpRequest, c.item_category_url);
    }
    return this.categoryService;
  }
}

export const context = new ApplicationContext();

export function getItemService(): ItemService {
  return context.getItemService();
}
export function getCategory(): CategoryService {
  return context.getCategoryService();
}