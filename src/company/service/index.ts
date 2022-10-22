import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CommentClient, CommentService, ReactionClient, ReactionService } from '../../review';
import { CompanyCategoryClient, CompanyCategoryService } from './category';
import { CompanyClient, CompanyService } from './company';
import { RatesClient, RatesService } from './rate';

export * from './company';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  company_url: string;
  company_category_url: string;
  company_rate_url: string;
  company_rate_comment_url: string;
  company_search_rate_url: string;
}
class ApplicationContext {
  companyService?: CompanyService;
  companyCategoryService?: CompanyCategoryService;
  rateService?: RatesService;
  commentService?: CommentService;
  reactionService?: ReactionService;

  constructor() {
    this.getConfig = this.getConfig.bind(this); 
    this.getCompanyService = this.getCompanyService.bind(this); 
    this.getCompanyCategoriesService = this.getCompanyCategoriesService.bind(this); 
    this.getRateService = this.getRateService.bind(this);
    this.getCommentService = this.getCommentService.bind(this);
    this.getReactionService = this.getReactionService.bind(this);
    //this.getSearchRateService = this.getSearchRateService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getCompanyService(): CompanyService {
    if (!this.companyService) {
      const c = this.getConfig();
      this.companyService = new CompanyClient(httpRequest, c.company_url);
    }
    return this.companyService;
  }
  
  getCompanyCategoriesService(): CompanyCategoryService {
    if (!this.companyCategoryService) {
      const c = this.getConfig();
      this.companyCategoryService = new CompanyCategoryClient(httpRequest, c.company_category_url);
    }
    return this.companyCategoryService;
  }

  // getSearchRateService(): RatesService {
  //   if (!this.rateService) {
  //     const c = this.getConfig();
  //     this.rateService = new RatesClient(httpRequest, c.company_search_rate_url);
  //   }
  //   return this.rateService;
  // }

  getRateService(): RatesService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RatesClient(httpRequest, c.company_rate_url);
    }
    return this.rateService;
  }
  
  getCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.company_rate_url);
    }
    return this.commentService;
  }

  getReactionService(): ReactionService {
    if(!this.reactionService){
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.company_rate_url);
    }
    return this.reactionService;
  }
}

export const context = new ApplicationContext();
export function useCompanyService(): CompanyService {
  return context.getCompanyService();
}
export function getCompanyCategoriesService(): CompanyCategoryService {
  return context.getCompanyCategoriesService();
}

export function useRate(): RatesService {
  return context.getRateService();
}

// export function useSearchRate(): RatesService {
//   return context.getSearchRateService();
// }

export function useComment(): CommentService {
  return context.getCommentService();
}

export function useReaction(): ReactionService {
  return context.getReactionService();
}