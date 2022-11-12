import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';

import { CategoryClient, CategoryService } from './category';
import { FilmClient, FilmService } from './film';
import { LocationClient } from './location';
import { LocationService } from './location/location';
import { MasterDataClient, MasterDataService } from './master-data';

import { CinemaClient, CinemaService } from './cinema';
import { CommentClient, CommentService, RateClient, RateService, ReactionClient, ReactionService, SearchRateClient, SearchRateService } from "../../review";

export * from './cinema';
export * from './category';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  cinema_rate_url: string;
  film_url: string;
  film_category_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  location_url: string;

}
class ApplicationContext {
  cinemaService?: CinemaService;
  categoryService?: CategoryService;
  filmService?: FilmService;
  masterDataService?: MasterDataService;
  locationService?: LocationService;
  rateService?: RateService;
  searchRateService?:SearchRateService;
  reactionService?: ReactionService;
  commentService?: CommentService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
    this.getCategoryService = this.getCategoryService.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getCinemaRateService = this.getCinemaRateService.bind(this);
    this.getCinemaReactionService = this.getCinemaReactionService.bind(this);
    this.getCinemaCommentService = this.getCinemaCommentService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getCinemaService(): CinemaService {
    if (!this.cinemaService) {
      const c = this.getConfig();
      this.cinemaService = new CinemaClient(httpRequest, c.cinema_url);
    }
    return this.cinemaService;
  }

  getCinemaRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.cinema_rate_url);
    }
    return this.rateService;
  }

  getCinemaSearchRateService(): SearchRateService {
    if (!this.searchRateService) {
      const c = this.getConfig();
      this.searchRateService = new SearchRateClient(httpRequest, c.cinema_rate_url);
    }
    return this.searchRateService;
  }

  getCinemaReactionService(): ReactionService {
    if (!this.reactionService) {
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.cinema_rate_url);
    }
    return this.reactionService;
  }

  getCinemaCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.cinema_rate_url);
    }
    return this.commentService;
  }

  getFilmService(): FilmService {
    if (!this.filmService) {
      const c = this.getConfig();
      this.filmService = new FilmClient(httpRequest, c.film_url);
    }
    return this.filmService;
  }

  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      const c = this.getConfig();
      this.categoryService = new CategoryClient(httpRequest, c.film_category_url);
    }
    return this.categoryService;
  }

  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }

  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.location_url);
    }
    return this.locationService;
  }

}

export const context = new ApplicationContext();


export function useCinema(): CinemaService {
  return context.getCinemaService();
}

export function useCinemaRate(): RateService {
  return context.getCinemaRateService();
}
export function useCinemaSearchRate():SearchRateService{
  return context.getCinemaSearchRateService();
}
export function useCinemaReaction(): ReactionService {
  return context.getCinemaReactionService();
}

export function useCinemaComment(): CommentService {
  return context.getCinemaCommentService();
}

export function useCategory(): CategoryService {
  return context.getCategoryService();
}
export function useFilm(): FilmService {
  return context.getFilmService();
}

export function useMasterData(): MasterDataService {
  return context.getMasterDataService();
}

export function getLocations(): LocationService {
  return context.getLocationService();
}

