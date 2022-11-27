import { Attributes, Filter, Service, Tracking, SearchResult } from 'onecore';
export interface CompanyCategoryFilter extends Filter {
  categoryId?: string;
  categoryName?: string;
  status: string[] | string;
}
export interface CompanyCategory extends Tracking {
  categoryId: string;
  categoryName: string;
}

export interface CompanyCategoryService extends Service<CompanyCategory, string, CompanyCategoryFilter> {
  getAllCompanyCategories():  Promise<SearchResult<CompanyCategory>>;
}

export const companyCategoryModel: Attributes = {
  categoryId: {
    length: 40,
    key: true,
  },
  categoryName: {
    type: 'string',
    length: 300
  },
  createdBy: {
    length: 40
  },
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {
    length: 40
  },
  updatedAt: {
    type: 'datetime'
  }
};
