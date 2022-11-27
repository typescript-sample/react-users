import { HttpRequest } from 'axios-core'
import { Client } from 'web-clients'
import { Job, JobFilter, jobModel, JobsService } from './jobs'

export * from './jobs'

export class JobsClient extends Client<Job, string, JobFilter> implements JobsService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, jobModel)
    this.searchGet = false
  } // End of constructor

  postOnly = (s: JobFilter) => true
} // End of JobsClient