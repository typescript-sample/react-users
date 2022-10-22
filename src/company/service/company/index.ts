import axios from "axios";
import { options, storage } from "uione";
import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Company, CompanyFilter, companyModel, CompanyService } from './company';

export * from './company';
const httpRequest = new HttpRequest(axios, options)
export class CompanyClient extends Client<Company, string, CompanyFilter> implements CompanyService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, companyModel);
    this.searchGet = false;
    this.getCompany = this.getCompany.bind(this);
  }
  getCompany(id: string): Promise<Company[]> {
    const url = `${this.serviceUrl}?roleId=${id}`;
    return this.http.get<Company[]>(url);
  }
  postOnly(s: CompanyFilter): boolean {
    return true;
  }
}