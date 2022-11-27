import { HttpRequest } from 'axios-core'
import { Client } from 'web-clients'
import { Company, CompanyFilter, companyModel, CompanyService } from './company'
import { FileInfo } from "reactx-upload"

export * from './company'

export class CompanyClient extends Client<Company, string, CompanyFilter> implements CompanyService {
  constructor(protected http: HttpRequest, private url: string) {
    super(http, url, companyModel)
    this.searchGet = false
    this.getCompany = this.getCompany.bind(this)
    this.fetchImageUploadedGallery =this.fetchImageUploadedGallery.bind(this)
  }

  getCompany = (id: string): Promise<Company[]> => this.http.get<Company[]>(`${this.serviceUrl}?roleId=${id}`)
  assignUsers = (id: string, users: string[]): Promise<number> => this.http.patch(`${this.serviceUrl}/${id}/assign-users`, users)
  deassignUsers = (id: string, users: string[]): Promise<number> => this.http.patch(`${this.serviceUrl}/${id}/deassign-users`, users)
  postOnly = (s: CompanyFilter): boolean => true

  async fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []> {
    try {
      return await this.http.get<FileInfo[]>(`${this.url}/${id}/fetchImageGalleryUploaded`)
    }
    catch (e) {
      const err = e as any
      const data = (err && err.response) ? err.response : err
      
      if (data && (data.status === 404 || data.status === 410)) {
        return []
      }

      throw e
    }
  } // End of fetchImageUploadedGallery

  async deleteFile(id: string, fileUrl: string): Promise<number> {
    if (!id) {
      return 0
    }

    try {
      await this.http.delete(`${this.url}/${id}/gallery?&url=${fileUrl}`)
      return 1
    }
    catch {
      return 0
    }
  } // End of deleteFile

  async deleteFileYoutube(id: string, fileUrl: string): Promise<number> {
    if (!id) {
      return 0
    }

    try {
      await this.http.delete(`${this.url}/${id}/external-resource?url=${fileUrl}`)
      return 1
    }
    catch {
      return 0
    }
  } // deleteFileYoutube

  async uploadExternalResource(id: string, videoId: string): Promise<number> {
    try {
      await this.http.post(`${this.url}/${id}/external-resource?type=${'youtube'}&url=${'https://www.youtube.com/embed/' + videoId}`, {})
      return 1
    }
    catch {
      return 0
    }
  } // End of uploadExternalResource

  async updateData(id: string, data: FileInfo[]): Promise<number> {
    try {
      return await this.http.patch<number>(`${this.url}/${id}/gallery`, data)
    }
    catch (e) {
      throw e
    }
  }
} // End of CompanyClient