import { Attributes, Filter, Service } from 'onecore';

export interface Article {
  id: string;
  title?: string;
  description?: string;
  name?: string;
  tags?: string[];
  type?: string;
  content: string;
}

export interface ArticleFilter extends Filter {
  id: string;
  title?: string;
  description?: string;
}

export const articleModel: Attributes = {
  id: {
    key: true,
    length: 40,
    required: true,
  },
  title: {
    length: 100,
    required: true,
    q: true
  },
  description: {
    length: 100,
    required: true,
    q: true
  },
  name: {
    required: true,
    q: true,
    length: 100,
  },
  content: {
    required: true,
    q: true,
  },
  tags: {
  },
  type: {
  }
};

export interface ArticleService extends Service<Article, string, ArticleFilter> {
}
