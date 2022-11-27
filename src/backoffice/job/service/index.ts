import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { JobsClient, JobsService } from './jobs';

export * from './jobs';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  backoffice_company_url: string;
  company_category_url: string;
  backoffice_job_url: string;
}
class ApplicationContext {
  jobsService?: JobsService;


  constructor() {
    this.getConfig = this.getConfig.bind(this); 
    this.getJobsService = this.getJobsService.bind(this); 
  }

  getConfig(): Config {
    return storage.config();
  }
  getJobsService(): JobsService {
    if (!this.jobsService) {
      const c = this.getConfig();
      this.jobsService = new JobsClient(httpRequest, c.backoffice_job_url);
    }
    return this.jobsService;
  }
 
  
  
}

export const context = new ApplicationContext();
export function getJobsService(): JobsService {
  return context.getJobsService();
}