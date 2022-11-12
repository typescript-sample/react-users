import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { LocationClient } from './location';
import { LocationService } from './location/location';
import { QueryService } from 'onecore';
import { QueryClient } from 'web-clients';

import { useState } from 'react';


const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  director_url: string;
  cast_url: string;
  production_url: string;
  country_url: string;
  film_url: string;
  film_category_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  backoffice_location_url: string;
  location_rate_url: string;
  //
  cinema_rate_url: string;
}
class ApplicationContext {
  directorService?: QueryService<string>;
  castService?: QueryService<string>;
  productionService?: QueryService<string>;
  countryService?: QueryService<string>;
  locationService?: LocationService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
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

  
  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.backoffice_location_url);
    }
    return this.locationService;
  }

}

export const context = new ApplicationContext();

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


export function getLocations(): LocationService {
  return context.getLocationService();
}

