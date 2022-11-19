import axios from "axios";
import { HttpRequest } from "axios-core";
import { useState } from "react";
import { options, storage } from "uione";
import { FollowClient, FollowService } from "./follow";
import { LocationClient } from "./location";
import { LocationService } from "./location/location";
import { SavedItemClient, SavedItemService } from "./saved-location";
import { RatesClient } from 'web-clients';
import {CommentClient, CommentService, RateClient, RateService, ReactionClient, ReactionService, SearchRateService} from "reaction-client"
export * from "./location";

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  location_url: string;
  saved_location: string;
  location_follow_url: string;
  location_rate_url: string;

}
class ApplicationContext {
  locationService?: LocationService;
  savedItemService?: SavedItemService;
  followService?: FollowService;
  rateService?: RateService;
  searchRateService?:SearchRateService;
  reactionService?: ReactionService;
  commentService?: CommentService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getFollowService(): FollowService {
    if (!this.followService) {
      const c = this.getConfig();
      this.followService = new FollowClient(httpRequest, c.location_follow_url);
    }
    return this.followService;
  }

  getSavedItemService(): SavedItemService {
    if (!this.savedItemService) {
      const c = this.getConfig();
      this.savedItemService = new SavedItemClient(httpRequest, c.saved_location);
    }
    return this.savedItemService;
  }

  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.location_url);
    }
    return this.locationService;
  }

  getLocationRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.location_rate_url);
    }
    return this.rateService;
  }

  getLocationSearchRateService(): SearchRateService {
    if (!this.searchRateService) {
      const c = this.getConfig();
      this.searchRateService = new RatesClient(httpRequest, c.location_rate_url, false, true);
    }
    return this.searchRateService;
  }

  getLocationReactionService(): ReactionService {
    if (!this.reactionService) {
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.location_rate_url);
    }
    return this.reactionService;
  }

  getLocationCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.location_rate_url);
    }
    return this.commentService;
  }
}

export const context = new ApplicationContext();

export function useLocationsService(): LocationService {
  const [service] = useState(() => context.getLocationService());
  return service;
}

export function useLocations(): LocationService {
  return context.getLocationService();
}

export function useSavedItemResponse(): SavedItemService {
  return context.getSavedItemService();
}

export function useFollowLocationResponse(): FollowService {
  return context.getFollowService();
}

export function useLocationRate(): RateService {
  return context.getLocationRateService();
}
export function useLocationSearchRate(): SearchRateService {
  return context.getLocationSearchRateService();
}

export function useLocationReaction(): ReactionService {
  return context.getLocationReactionService();
}

export function useLocationComment(): CommentService {
  return context.getLocationCommentService();
}
