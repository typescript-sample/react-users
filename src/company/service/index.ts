import axios from 'axios'
import { HttpRequest } from 'axios-core'
import { options, storage } from 'uione'
import { CommentClient, CommentService, ReactionClient, ReactionService } from 'reaction-client'
import { CompanyCategoryClient, CompanyCategoryService } from './category'
import { CompanyClient, CompanyService } from './company'
import { RatesClient, RatesService } from './rate'

export * from './company'

const httpRequest = new HttpRequest(axios, options)

export interface Config {
  company_url: string
  company_category_url: string
  company_rate_url: string
  company_rate_comment_url: string
  company_search_rate_url: string
}

class ApplicationContext {
  companyService?: CompanyService
  companyCategoryService?: CompanyCategoryService
  rateService?: RatesService
  commentService?: CommentService
  reactionService?: ReactionService

  constructor() {
    this.getConfig = this.getConfig.bind(this)
    this.getCompanyService = this.getCompanyService.bind(this)
    this.getCompanyCategoriesService = this.getCompanyCategoriesService.bind(this)
    this.getRateService = this.getRateService.bind(this)
    this.getCommentService = this.getCommentService.bind(this)
    this.getReactionService = this.getReactionService.bind(this)
  } // End of constructor

  getConfig = (): Config => storage.config()
  getCompanyService = () => this.companyService || (this.companyService = new CompanyClient(httpRequest, this.getConfig().company_url))
  getCompanyCategoriesService = () => this.companyCategoryService || (this.companyCategoryService = new CompanyCategoryClient(httpRequest, this.getConfig().company_category_url))
  getRateService = () => this.rateService || (this.rateService = new RatesClient(httpRequest, this.getConfig().company_rate_url))
  getCommentService = () => this.commentService || (this.commentService = new CommentClient(httpRequest, this.getConfig().company_rate_url))
  getReactionService = () => this.reactionService || (this.reactionService = new ReactionClient(httpRequest, this.getConfig().company_rate_url))
} // End of ApplicationContext

export const context = new ApplicationContext();
export const getCompanyService = () => context.getCompanyService()
export const getCompanyCategoriesService = () => context.getCompanyCategoriesService()
export const useRate = () => context.getRateService()
export const useComment = () => context.getCommentService()
export const useReaction = () => context.getReactionService()