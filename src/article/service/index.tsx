import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { MasterDataClient, MasterDataService } from '../master-data';
import { ArticleClient, ArticleService } from './article';
import { CommentClient, CommentService, RateClient, RateService, ReactionClient, ReactionService } from "../../review";
export * from './article';

// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  article_url: string;
  item_url: string;
  article_rate_url: string;
}
class ApplicationContext {
  articleService?: ArticleService;
  masterDataService?: MasterDataService;
  rateService?: RateService;
  reactionService?: ReactionService;
  commentService?: CommentService;
  constructor() {
    this.getConfig = this.getConfig.bind(this); 
  }
  getConfig(): Config {
    return storage.config();
  }

  getArticleService(): ArticleService {
    if (!this.articleService) {
      const c = this.getConfig();
      this.articleService = new ArticleClient(httpRequest, c.article_url);
    }
    return this.articleService;
  }

  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }

  getArticleRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.article_rate_url);
    }
    return this.rateService;
  }

  getArticleReactionService(): ReactionService {
    if (!this.reactionService) {
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.article_rate_url);
    }
    return this.reactionService;
  }

  getArticleCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.article_rate_url);
    }
    return this.commentService;
  }
}

export const context = new ApplicationContext();

export function useArticle(): ArticleService {
  return context.getArticleService();
}

export function getMasterData(): MasterDataService {
  return context.getMasterDataService();
}

export function useArticleRate(): RateService {
  return context.getArticleRateService();
}

export function useArticleReaction(): ReactionService {
  return context.getArticleReactionService();
}

export function useArticleComment(): CommentService {
  return context.getArticleCommentService();
}