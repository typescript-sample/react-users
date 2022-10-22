import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';

// import { CinemaClient, CinemaService } from './cinema';
import { CommentClient, CommentService} from './comment';


const httpRequest = new HttpRequest(axios, options);
export interface Config {
  comment_url: string;
}
class ApplicationContext {
  commentService?: CommentService;
  
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCommentService = this.getCommentService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.comment_url);
    }
    return this.commentService;
  }

}

export const context = new ApplicationContext();

export function useComment(): CommentService {
  return context.getCommentService();
}


