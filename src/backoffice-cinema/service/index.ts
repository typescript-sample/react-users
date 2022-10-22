import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { QueryService } from 'onecore';
import { QueryClient } from 'web-clients';

import { CinemaClient} from './cinema';
import { CinemaService} from '../service/cinema/cinema';
import { useState } from 'react';


export * from './cinema';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  backoffice_cinema_url: string;
  director_url: string;
  cast_url: string;
  production_url: string;
  country_url: string;
  film_url: string;
  film_category_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  location_url: string;
  location_rate_url: string;
  //
  cinema_rate_url: string;
}
class ApplicationContext {
  cinemaService?: CinemaService;
  directorService?: QueryService<string>;
  castService?: QueryService<string>;
  productionService?: QueryService<string>;
  countryService?: QueryService<string>;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getCinemaService(): CinemaService {
    if (!this.cinemaService) {
      const c = this.getConfig();
      this.cinemaService = new CinemaClient(httpRequest, c.backoffice_cinema_url);
    }
    return this.cinemaService;
  }
  //add


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


}

export const context = new ApplicationContext();

export function getCinemaService(): CinemaService {
  //return context.getCinemaService();
  return context.getCinemaService();
}
//add
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


