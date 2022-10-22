import { Attributes, DateRange, Filter, Repository, Service } from 'onecore';
import { FileInfo } from 'reactx-upload';

export interface User {
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

  title?: string;
  image?: string;
  coverURL?: string;
  imageURL?: string;
  nationality?: string;
  alternativeEmail?: string;
  address?: string;
  bio?: string;
  website?: string;
  occupation?: string;
  company?: string;
  lookingFor: string[];
  gallery?: FileInfo[];
  familyName: string;
  givenName: string;
  customLink01: string;
  customLink02: string;
  customLink03: string;
  customLink04: string;
  customLink05: string;
  customLink06: string;
  customLink07: string;
  customLink08: string;
  links?: Social;
  works: Work[];
  companies: Company[];
  educations: Education[];
}
export interface Education {
  school: string;
  degree: string;
  major: string;
  title: string;
  from: Date | string;
  to: Date | string;
}
export interface Work {
  name: string;
  position: string;
  description: string;
  item?: Object[];
  from: Date | string;
  to: Date | string;
}

export interface Company {
  id?: string
  name: string
  position: string;
  description: string;
  from: Date | string;
  to: Date | string;
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
  email?: string;
  phone?: string;
  dateOfBirth?: DateRange;
  interests: string[];
  skills: Skill[];
  achievements: Achievement[];
  settings: UserSettings;
}
export interface UserRepository extends Repository<User, string> {
}
export interface UserService extends Service<User, string, UserFilter> {
}
export interface MyProfileService {
  getMyProfile(id: string): Promise<User | null>;
  getMySettings(id: string): Promise<UserSettings | null>;
  saveMySettings(id: string, settings: UserSettings): Promise<number>;
  saveMyProfile(user: User): Promise<number>;
  fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []>;
  deleteFile(id: string, fileUrl: string): Promise<number>;
  deleteFileYoutube(id: string, fileUrl: string): Promise<number>;
  uploadExternalResource(id: string, videoId: string): Promise<number>;
  updateData(id: string, data: FileInfo[]): Promise<number>;
}
export interface SkillService {
  getSkills(q: string, max?: number): Promise<string[] | null>;
}
export const skillsModel: Attributes = {
  skill: {
    required: true
  },
  hirable: {
    type: 'boolean',
  }
};

export const worksModel: Attributes = {
  name: {
    required: true
  },
  description: {
  },
  from: {
  },
  to: {
  },
  position: {
  },
  item:{

  }
};

export const companiesModel: Attributes = {
  name: {
    required: true
  },
  description: {
  },
  from: {
  },
  to: {
  },
  position: {
  },
  id:{

  }
};
export const educationsModel: Attributes = {
  school: {
    required: true
  },
  degree: {
  },
  from: {
  },
  to: {
  },
  major: {
  },
  title:{

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
  userId: {
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
  },
  works: {
    type: 'primitives',
    typeof: worksModel,
  },
  companies: {
    type: 'primitives',
    typeof: companiesModel,
  },
  educations: {
    type: 'primitives',
    typeof: educationsModel,
  }
};
