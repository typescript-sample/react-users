import axios from "axios";
import { options, storage } from "uione";
import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Job, JobFilter, jobModel, JobsService } from './jobs';

export * from './jobs';

export class JobsClient extends Client<Job, string, JobFilter> implements JobsService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, jobModel);
    this.searchGet = false;
    // this.getJobs = this.getJobs.bind(this);
  }
  // getJobs(id: string): Promise<Job[]> {
  //   console.log(id)
  //   const url = this.url + "/" + id
  //   return this.http.get<Job[]>(url);
  // }
  postOnly(s: JobFilter): boolean {
    return true;
  }
}