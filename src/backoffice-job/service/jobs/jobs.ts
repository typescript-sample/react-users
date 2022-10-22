import { Attributes, Filter, Service, Tracking,NumberRange } from 'onecore';
export interface Job extends Tracking {
    id: string;
    title: string;
    description: string;
    skill?:string[];
    publishedAt:Date|null;
    expiredAt:Date|null;
    quantity:number;
    applicantCount: number;
    requirements:string;
    benefit:string;
  }
  export interface JobFilter extends Filter {
    id?: string;
    title?: string;
    description?: string;
    skill?:string[];
    publishedAt?:Date;
    expiredAt?:Date;
    quantity?:number;
    applicantCount?: number;
    requirements?:string;
    benefit?:string;
}
export interface JobsService extends Service<Job, string, JobFilter> {
}
export const jobModel: Attributes = {
    id: {
      length: 40,
      required: true,
      key: true
    },
    title: {
      length:120,
      q: true
    },
    description: {
      length:1000,
      q: true
    },
    benefit: {
      length:1000,
    },
    requirements: {
      length:1000,
    },
    publishedAt: {
      type: 'datetime'
    },
    expiredAt: {
      type: 'datetime'
    },
    skill:{
      type:'primitives'
    },
    quantity: {
      type:'number'
    },
    applicantCount: {
      type:'number'
    },
  };
  