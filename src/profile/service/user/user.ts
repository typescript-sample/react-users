import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';
import { FileInfo } from 'reactx-upload';

export interface User {
  userId: string;
  imageURL: string;
  status: string;
  gender?: string;

  id: string;
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  interests: string[];
  skills: Skill[];
  achievements: Achievement[];
  settings: UserSettings;
  gallery?: FileInfo[];
  title?: string;
  image?: string;
  coverURL?: string;
  nationality?: string;
  alternativeEmail?: string;
  address?: string;
  bio?: string;
  website?: string;
  occupation?: string;
  company?: string;
  lookingFor: string[];
  info?: FilmInfo;

  links?: Social;
  customLink01: string;
  customLink02: string;
  customLink03: string;
  customLink04: string;
  customLink05: string;
  customLink06: string;
  customLink07: string;
  customLink08: string;
  works:Work[];
  companies:Company[];
  educations:Education[];
}
export interface FilmInfo{
  score: number;
  count: number;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
}
export interface Work {
  name: string;
  position: string;
  description: string;
  item: Object[];
  from: Date;
  to: Date;
}

export interface Company {
  id?: string
  name: string
  position: string;
  descrition: string;
  from: Date;
  to: Date;
}
export interface Education {
  school: string;
  degree: string;
  major: string;
  title: string;
  from: Date;
  to: Date;
}

export interface Social {
  google: string;
  facebook: string;
  github: string;
  instagram: string;
  twitter: string;
  skype: string;
  dribble: string;
  linkedin: string;
}
export interface Skill {
  skill: string;
  hirable: boolean;
}
export interface UserSettings {
  userId: string;
  language: string;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;
  notification: boolean;

  searchEnginesLinksToMyProfile: boolean;
  emailFeedUpdates: boolean;
  notifyFeedUpdates: boolean;
  emailPostMentions: boolean;
  notifyPostMentions: boolean;
  emailCommentsOfYourPosts: boolean;
  notifyCommentsOfYourPosts: boolean;
  emailEventInvitations: boolean;
  notifyEventInvitations: boolean;
  emailWhenNewEventsAround: boolean;
  notifyWhenNewEventsAround: boolean;
  followingListPublicOnMyProfile: boolean;
  showMyProfileInSpacesAroundMe: boolean;
  showAroundMeResultsInMemberFeed: boolean;
}
export interface Achievement {
  subject: string;
  description: string;
  highlight?: boolean;
}

export interface UserFilter extends Filter {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: DateRange;
  // interest:string;
  // skill:string;
  interests: string[];
  // skills: Skill[];
  /*achievements: Achievement[];
  settings: UserSettings;
  */
  status: string[];
}
export interface UserRepository extends Repository<User, string> {
}
export interface UserService extends Service<User, string, UserFilter> {
}
export interface ProfileService {
  getMyProfile(id: string): Promise<User | null>;
  getMySettings(id: string): Promise<UserSettings | null>;
  // saveMySettings(id: string, settings: UserSettings): Promise<boolean>;
  // saveMyProfile(id: string, user: User): Promise<boolean>;
}

export const skillsModel: Attributes = {
  skill: {
    required: true
  },
  hirable: {
    type: 'boolean',
  }
};
export const userSettingsModel: Attributes = {
  userId: {},
  language: {},
  dateFormat: {},
  dateTimeFormat: {},
  timeFormat: {},
  notification: {
    type: 'boolean',
  }
};
export const achievements: Attributes = {
  subject: {},
  description: {}
};
export const userModel: Attributes = {
  id: {
    key: true,
    match: 'equal'
  },
  username: {},
  email: {
    format: 'email',
    required: true,
    match: 'prefix'
  },
  phone: {
    format: 'phone',
    required: true
  },
  dateOfBirth: {
    type: 'datetime',
    field: 'date_of_birth'
  },
  interests: {
    type: 'primitives',
  },
  skills: {
    type: 'primitives',
    typeof: skillsModel,
  },
  achievements: {
    type: 'primitives',
    typeof: achievements,
  },
  settings: {
    type: 'object',
    typeof: userSettingsModel,
  }
};
