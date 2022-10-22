import axios from "axios";
import { HttpRequest } from "axios-core";
import { options, storage } from "uione";

import { FilmClient, FilmService } from "./film";
import { SavedItemClient, SavedItemService } from "./saved-film";
import { CommentClient, CommentService, RateClient, RateService, ReactionClient, ReactionService } from "../../review";

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  film_url: string;
  saved_film: string;
  film_rate_url: string;
}
class ApplicationContext {
  filmService?: FilmService;
  savedItemService?: SavedItemService;
  rateService?: RateService;
  reactionService?: ReactionService;
  commentService?: CommentService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
    this.getFilmRateService = this.getFilmRateService.bind(this);
    this.getFilmReactionService = this.getFilmReactionService.bind(this);
    this.getFilmCommentService = this.getFilmCommentService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getSavedItemService(): SavedItemService {
    if (!this.savedItemService) {
      const c = this.getConfig();
      this.savedItemService = new SavedItemClient(httpRequest, c.saved_film);
    }
    return this.savedItemService;
  }

  getFilmService(): FilmService {
    if (!this.filmService) {
      const c = this.getConfig();
      this.filmService = new FilmClient(httpRequest, c.film_url);
    }
    return this.filmService;
  }

  getFilmRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.film_rate_url);
    }
    return this.rateService;
  }

  getFilmReactionService(): ReactionService {
    if (!this.reactionService) {
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.film_rate_url);
    }
    return this.reactionService;
  }

  getFilmCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.film_rate_url);
    }
    return this.commentService;
  }
}

export const context = new ApplicationContext();

export function useFilm(): FilmService {
  return context.getFilmService();
}

export function useSavedItemResponse(): SavedItemService {
  return context.getSavedItemService();
}

export function useFilmRate(): RateService {
  return context.getFilmRateService();
}

export function useFilmReaction(): ReactionService {
  return context.getFilmReactionService();
}

export function useFilmComment(): CommentService {
  return context.getFilmCommentService();
}