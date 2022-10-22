import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CategoryClient, CategoryService } from './category';
// import { CinemaClient, CinemaService } from './cinema';
import { FilmClient, FilmService } from './film';
import { QueryService } from 'onecore';
import { QueryClient } from 'web-clients';

import { useState } from 'react';


export * from './category';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  director_url: string;
  cast_url: string;
  production_url: string;
  country_url: string;
  backoffice_film_url: string;
  film_category_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
}
class ApplicationContext {
  categoryService?: CategoryService;
  directorService?: QueryService<string>;
  castService?: QueryService<string>;
  productionService?: QueryService<string>;
  countryService?: QueryService<string>;
  filmService?: FilmService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCategoryService = this.getCategoryService.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }


  getFilmService(): FilmService {
    if (!this.filmService) {
      const c = this.getConfig();
      this.filmService = new FilmClient(httpRequest, c.backoffice_film_url);
    }
    return this.filmService;
  }

  getDirectorService(): QueryService<string> {
    if (!this.directorService) {
      const c = this.getConfig();
      this.directorService = new QueryClient<string>(httpRequest, c.director_url);
    }
    return this.directorService;
  }
  getCastService(): QueryService<string> {
    if (!this.castService) {
      const c = this.getConfig();
      this.castService = new QueryClient<string>(httpRequest, c.cast_url);
    }
    return this.castService;
  }
  getProductionService(): QueryService<string> {
    if (!this.productionService) {
      const c = this.getConfig();
      this.productionService = new QueryClient<string>(httpRequest, c.production_url);
    }
    return this.productionService;
  }
  getCountryService(): QueryService<string> {
    if (!this.countryService) {
      const c = this.getConfig();
      this.countryService = new QueryClient<string>(httpRequest, c.country_url);
    }
    return this.countryService;
  }

  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      const c = this.getConfig();
      this.categoryService = new CategoryClient(httpRequest, c.film_category_url);
    }
    return this.categoryService;
  }


}

export const context = new ApplicationContext();


export function useCategory(): CategoryService {
  return context.getCategoryService();
}
export function getFilmService(): FilmService {
  return context.getFilmService();
}
export function useDirector(): QueryService<string> {
  const [service] = useState(() => context.getDirectorService());
  return service;
}
export function useCast(): QueryService<string> {
  const [service] = useState(() => context.getCastService());
  return service;
}
export function useProduction(): QueryService<string> {
  const [service] = useState(() => context.getProductionService());
  return service;
}
export function useCountry(): QueryService<string> {
  const [service] = useState(() => context.getCountryService());
  return service;
}

