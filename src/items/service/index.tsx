import axios from "axios";
import { HttpRequest } from "axios-core";
import { options, storage } from "uione";
import {
  ItemClient,
  ItemService,
} from "./item";
import { CategoryClient, CategoryService } from "./category";
import { SavedItemClient, SavedItemService } from "./saved-item";
import { CommentClient, CommentService, ReactionClient, ReactionService } from "../../review";
import { ResponseService, ResponseClient } from "./response";

export * from "./item";

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  item_url: string;
  item_category_url: string;
  item_response_url: string;
  saved_item:string;
}
class ApplicationContext {
  itemService?: ItemService;
  categoryService?: CategoryService;
  responseService?: ResponseService;
  reactionService?: ReactionService;
  commentService?: CommentService;
  savedItemService?:SavedItemService

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getItemService = this.getItemService.bind(this);
    this.getCategoryService = this.getCategoryService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getSavedItemService(): SavedItemService {
    if (!this.savedItemService) {
      const c = this.getConfig();
      this.savedItemService = new SavedItemClient(httpRequest, c.saved_item);
    }
    return this.savedItemService;
  }

  getItemService(): ItemService {
    if (!this.itemService) {
      const c = this.getConfig();
      this.itemService = new ItemClient(httpRequest, c.item_url);
    }
    return this.itemService;
  }

  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      const c = this.getConfig();
      this.categoryService = new CategoryClient(
        httpRequest,
        c.item_category_url
      );
    }
    return this.categoryService;
  }

  getItemResponseService(): ResponseService {
    if (!this.responseService) {
      const c = this.getConfig();
      this.responseService = new ResponseClient(httpRequest, c.item_response_url);
    }
    return this.responseService;
  }

  getItemReactionService(): ReactionService {
    if (!this.reactionService) {
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.item_response_url);
    }
    return this.reactionService;
  }

  getItemCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.item_response_url);
    }
    return this.commentService;
  }
}

export const context = new ApplicationContext();

export function getCategory(): CategoryService {
  return context.getCategoryService();
}

export function getItemService(): ItemService {
  return context.getItemService();
}

export function useItemResponse(): ResponseService {
  return context.getItemResponseService();
}

export function useItemReaction(): ReactionService {
  return context.getItemReactionService();
}

export function useItemComment(): CommentService {
  return context.getItemCommentService();
}

export function useSavedItemResponse(): SavedItemService {
  return context.getSavedItemService();
}





