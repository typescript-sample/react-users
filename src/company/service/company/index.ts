import { HttpRequest } from 'axios-core'
import { Client } from 'web-clients'
import { Company, CompanyFilter, companyModel, CompanyService } from './company'

export * from './company'

export class CompanyClient extends Client<Company, string, CompanyFilter> implements CompanyService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, companyModel)
    this.searchGet = true
    this.getCompany = this.getCompany.bind(this)
    this.getAllByUser = this.getAllByUser.bind(this)
  } // End of constructor

  getCompany = (id: string): Promise<Company[]> => this.http.get<Company[]>(`${this.serviceUrl}?roleId=${id}`)
  getAllByUser = (userId: string): Promise<Company[]> => this.http.get<Company[]>(`${this.serviceUrl}/user/${userId}`)
} // End of CompanyClient