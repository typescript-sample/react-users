import { HttpRequest } from 'axios-core'
import { Client } from 'web-clients'
import { User, UserFilter, userModel, UserService } from './user'

export * from './user'

export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel)
    this.searchGet = true
    this.getUsersByRole = this.getUsersByRole.bind(this)
  }
  
  getUsersByRole = (id: string): Promise<User[]> => this.http.get<User[]>(`${this.serviceUrl}?roleId=${id}`)
  getUsersByCompany = (id: string): Promise<User[]> => this.http.get<User[]>(`${this.serviceUrl}/company/${id}`)
} // End of UserClient
