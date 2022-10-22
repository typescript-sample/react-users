import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useEffect, useState } from 'react';
import { options, storage } from 'uione';
import { CommentClient, CommentService, RateClient, RateService, ReactionClient, ReactionService } from '../../review';
import { AppreciationClient, AppreciationService } from './appreciation';
import { ReplyClient, ReplyService } from './appreciation-reply';
import { FollowService, FollowClient } from './follow';
import { ReactClient, ReactService } from './reaction';
import { ProfileClient, ProfileService, UserClient, UserService } from './user';
export interface Config {
  myprofile_url: string;
  user_url: string;
  profile_url: string;
  appreciation_url: string;
  appreciation_reply_url: string;
  user_follow_url: string;
  user_rate_url: string;
}

const httpRequest = new HttpRequest(axios, options);
class ApplicationContext {
  profileService?: ProfileService;
  userService?: UserService;
  appreciationService?: AppreciationService;
  appreciationReplyService?: ReplyService;
  followService?: FollowService
  rateService?: RateService;
  reactionService?: ReactionService;
  commentService?: CommentService;
  reactService?: ReactService;


  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getUserService = this.getUserService.bind(this);
    this.getMyProfileService = this.getMyProfileService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }
  getMyProfileService(): ProfileService {
    if (!this.profileService) {
      const c = this.getConfig();
      this.profileService = new ProfileClient(httpRequest, c.myprofile_url);
    }
    return this.profileService;
  }
  getFollowService(): FollowService {
    if (!this.followService) {
      const c = this.getConfig();
      this.followService = new FollowClient(httpRequest, c.user_follow_url);
    }
    return this.followService;
  }
  getUserService(): UserService {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new UserClient(httpRequest, c.profile_url);
    }
    return this.userService;
  }

  getAppreciationService(): AppreciationService {
    if (!this.appreciationService) {
      const c = this.getConfig();
      this.appreciationService = new AppreciationClient(httpRequest, c.appreciation_url);
    }
    return this.appreciationService;
  }
  getReplyService(): ReplyService {
    if (!this.appreciationReplyService) {
      const c = this.getConfig();
      this.appreciationReplyService = new ReplyClient(httpRequest, c.appreciation_reply_url);
    }
    return this.appreciationReplyService;
  }
  getUserRateService(): RateService {
    if (!this.rateService) {
      const c = this.getConfig();
      this.rateService = new RateClient(httpRequest, c.user_rate_url);
    }
    return this.rateService;
  }

  getUserReactionService(): ReactionService {
    if (!this.reactionService) {
      const c = this.getConfig();
      this.reactionService = new ReactionClient(httpRequest, c.user_rate_url);
    }
    return this.reactionService;
  }

  getUserCommentService(): CommentService {
    if (!this.commentService) {
      const c = this.getConfig();
      this.commentService = new CommentClient(httpRequest, c.user_rate_url);
    }
    return this.commentService;
  }
  getUserReactService(): ReactService {
    if (!this.reactService) {
      const c = this.getConfig();
      this.reactService = new ReactClient(httpRequest, c.user_url);
    }
    return this.reactService;
  }
  //
  getAppreciationCommentService(): CommentService {
    const c = this.getConfig();
    const appreciationCommentService = new CommentClient(httpRequest, c.appreciation_url);
    return appreciationCommentService;
  }

  getAppreciationReactionService(): ReactionService {
    const c = this.getConfig();
    const appreciationReactionService = new ReactionClient(httpRequest, c.appreciation_url);
    return appreciationReactionService;
  }
  
}

export const appContext = new ApplicationContext();

export function useUserService(): UserService | undefined {
  const [context, setContext] = useState<UserService>();
  useEffect(() => {
    setContext(appContext.getUserService());
  }, []);
  return context;
}

export function useMyProfileService(): ProfileService | undefined {
  const [context, setContext] = useState<ProfileService>();
  useEffect(() => {
    setContext(appContext.getMyProfileService());
  }, []);
  return context;
}

export function useAppreciation(): AppreciationService {
  return appContext.getAppreciationService();
  // const [context, setContext] = useState<AppreciationService>();
  // useEffect(() => {
  //   setContext(appContext.getAppreciationService());
  // }, []);
  // return context ?? appContext.getAppreciationService();
}


export function useReplyService(): ReplyService | undefined {
  const [context, setContext] = useState<ReplyService>();
  useEffect(() => {
    setContext(appContext.getReplyService());
  }, []);
  return context;
}

export function useAppreciationComment(): CommentService {
  return appContext.getAppreciationCommentService();
}
export function useAppreciationReaction(): ReactionService {
  return appContext.getAppreciationReactionService();
}
export function useFollowUserResponse(): FollowService {
  return appContext.getFollowService();
}
export function useUserRate(): RateService {
  return appContext.getUserRateService();
}

export function useUserReaction(): ReactionService {
  return appContext.getUserReactionService();
}

export function useUserReact(): ReactService {
  return appContext.getUserReactService();
}

export function useUserComment(): CommentService {
  return appContext.getUserCommentService();
}