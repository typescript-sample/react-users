import { HttpRequest } from 'axios-core';
import { SearchResult } from 'onecore';
import { Client } from 'web-clients';
import { CompanyCategory, CompanyCategoryFilter, companyCategoryModel, CompanyCategoryService } from './category';

export * from './category';

export class CompanyCategoryClient extends Client<CompanyCategory, string, CompanyCategoryFilter> implements CompanyCategoryService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, companyCategoryModel);
    this.searchGet = true;
  }
  getAllCompanyCategories(): Promise<SearchResult<CompanyCategory>> {
    const url = `${this.serviceUrl}/search`;
    return this.http.get<SearchResult<CompanyCategory>>(url);
  }
}
