import { HttpRequest } from 'axios-core';
import { SearchResult } from 'onecore';
import { Client } from 'web-clients';
import { Category, CategoryFilter, categoryModel, CategoryService } from './category';

export * from './category';

export class CategoryClient extends Client<Category, string, CategoryFilter> implements CategoryService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, categoryModel);
    this.searchGet = true;
  }
  getAllCategories(): Promise<SearchResult<Category>> {
    const url = `${this.serviceUrl}/search`;
    return this.http.get<SearchResult<Category>>(url);
  }
}
