import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { MasterDataClient, MasterDataService } from '../master-data';
import { ArticleClient, ArticleService } from './article';
export * from './article';
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  my_article_url: string;
  item_url: string;
}
class ApplicationContext {
  articleService?: ArticleService;
  masterDataService?: MasterDataService;
  constructor() {
    this.getConfig = this.getConfig.bind(this); 
  }
  getConfig(): Config {
    return storage.config();
  }

  getArticleService(): ArticleService {
    if (!this.articleService) {
      const c = this.getConfig();
      this.articleService = new ArticleClient(httpRequest, c.my_article_url);
    }
    return this.articleService;
  }

  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }
}

export const context = new ApplicationContext();

export function getArticleService(): ArticleService {
  return context.getArticleService();
}

export function getMasterData(): MasterDataService {
  return context.getMasterDataService();
}