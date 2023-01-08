import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CommentsClient, RatesClient } from 'web-clients';
import { MasterDataClient, MasterDataService } from '../master-data';
import { ArticleClient, ArticleService } from './article';
import { CommentService as CommentThreadReplyService } from '../../review/client/comment/comment';
// CommentService as CommentThreadReplyService
import { CommentThreadClient, CommentThreadService,CommentClient as CommentThreadReplyClient, SearchCommentThreadService, CommentThreadFilter, CommentThread, commentThreadModel } from "../../review";
import{CommentClient, CommentService,  RateClient, RateService, ReactionClient, ReactionService,CommentReactionService, CommentReactionClient, SearchRateService} from 'reaction-client'

export * from './article';

// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  article_url: string;
  item_url: string;
  article_rate_url: string;
  article_comment_thread_url: string;
  article_comment_thread_reaction_url: string;
  article_comment_reaction_url: string;
}
class ApplicationContext {
  articleService?: ArticleService;
  masterDataService?: MasterDataService;
  rateService?: RateService;
  searchRateService?: SearchRateService;
  reactionService?: ReactionService;
  commentService?: CommentService;
  commentThreadService?: CommentThreadService;
  commentThreadReplyService?: CommentThreadReplyService;
  commentThreadReactionService?: CommentReactionService;
  commentReactionService?: CommentReactionService;
  searchCommentThreadService?: SearchCommentThreadService;
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

  getArticleSearchRateService(): SearchRateService {
    if (!this.searchRateService) {
      const c = this.getConfig();
      this.searchRateService = new RatesClient(httpRequest, c.article_rate_url, false, true);
    }
    return this.searchRateService;
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

  getArticleCommentThreadService(): CommentThreadService {
    if (!this.commentThreadService) {
      const c = this.getConfig();
      this.commentThreadService = new CommentThreadClient(httpRequest, c.article_comment_thread_url);
    }
    return this.commentThreadService;
  }
  getSearchArticleCommentThreadService():SearchCommentThreadService{
    if (!this.searchCommentThreadService) {
      const c = this.getConfig();
      this.searchCommentThreadService = new CommentsClient(httpRequest, c.article_comment_thread_url,false,true);
    }
    return this.searchCommentThreadService;
    
  }
  getArticleCommentThreadReplyService(): CommentThreadReplyService {
    if (!this.commentThreadReplyService) {
      const c = this.getConfig();
      this.commentThreadReplyService = new CommentThreadReplyClient(httpRequest, c.article_comment_thread_url)
    }
    return this.commentThreadReplyService
  }

  getArticleCommentThreadReactionService(): CommentReactionService {
    if (!this.commentThreadReactionService) {
      const c = this.getConfig();
      this.commentThreadReactionService = new CommentReactionClient(httpRequest, c.article_comment_thread_reaction_url)
    }
    return this.commentThreadReactionService;
  }

  getArticleCommentReactionService(): CommentReactionService {
    if (!this.commentReactionService) {
      const c = this.getConfig();
      this.commentReactionService = new CommentReactionClient(httpRequest, c.article_comment_reaction_url)
    }
    return this.commentReactionService;
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

export function useArticleSearchRate():SearchRateService{
  return context.getArticleSearchRateService();
}
export function useArticleReaction(): ReactionService {
  return context.getArticleReactionService();
}

export function useArticleComment(): CommentService {
  return context.getArticleCommentService();
}

export function useArticleCommentThread(): CommentThreadService {
  return context.getArticleCommentThreadService();
}
export function useSearchArticleCommentThread():SearchCommentThreadService{
  return context.getSearchArticleCommentThreadService();
}
export function useArticleCommentThreadReply(): CommentThreadReplyService {
  return context.getArticleCommentThreadReplyService();
}

export function useArticleCommentThreadReaction(): CommentReactionService {
  return context.getArticleCommentThreadReactionService();
}
export function useArticleCommentReaction(): CommentReactionService {
  return context.getArticleCommentReactionService();
}
