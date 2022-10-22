import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CompanyClient, CompanyService } from './company';
import { CompanyCategoryClient, CompanyCategoryService } from './category';

export * from './company';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  backoffice_company_url: string;
  company_categories_url: string;
}
class ApplicationContext {
  companyService?: CompanyService;
  companyCategoryService?: CompanyCategoryService;


  constructor() {
    this.getConfig = this.getConfig.bind(this); 
    this.getCompanyService = this.getCompanyService.bind(this); 
    this.getCompanyCategoriesService = this.getCompanyCategoriesService.bind(this); 
  }

  getConfig(): Config {
    return storage.config();
  }

  getCompanyService(): CompanyService {
    if (!this.companyService) {
      const c = this.getConfig();
      this.companyService = new CompanyClient(httpRequest, c.backoffice_company_url);
    }
    return this.companyService;
  }
  
  getCompanyCategoriesService(): CompanyCategoryService {
    if (!this.companyCategoryService) {
      const c = this.getConfig();
      this.companyCategoryService = new CompanyCategoryClient(httpRequest, c.company_categories_url);
    }
    return this.companyCategoryService;
  }
}

export const context = new ApplicationContext();
export function getCompanyService(): CompanyService {
  return context.getCompanyService();
}
export function getCompanyCategoriesService(): CompanyCategoryService {
  return context.getCompanyCategoriesService();
}
