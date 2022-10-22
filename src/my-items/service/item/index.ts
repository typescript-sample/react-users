import axios from "axios";
import { useState } from "react";
import { options, storage } from "uione";
import { QueryService } from "onecore";
import { HttpRequest } from "axios-core";
import { Client, QueryClient } from "web-clients";
import { Item, ItemFilter, itemModel, ItemService } from "./item";
import { FileInfo } from "reactx-upload";

export * from "./item";

const httpRequest = new HttpRequest(axios, options);
export class ItemClient
  extends Client<Item, string, ItemFilter>
  implements ItemService
{
  constructor(http: HttpRequest, private url: string) {
    super(http, url, itemModel);
    this.searchGet = false;
    // this.getItem = this.getItem.bind(this);
    // this.updateItem = this.updateItem.bind(this);
    // this.saveItem = this.saveItem.bind(this);
    this.fetchImageUploadedGallery =this.fetchImageUploadedGallery.bind(this);
    this.deleteFile =this.deleteFile.bind(this);
    this.deleteFileYoutube =this.deleteFileYoutube.bind(this);
    this.uploadExternalResource =this.uploadExternalResource.bind(this);
    this.updateData =this.updateData.bind(this);
  }

  postOnly(s: ItemFilter): boolean {
    return true;
  }

  // getItem(id: string | undefined): Promise<Item | null> {
  //   const url = this.url + "/" + id;
  //   return this.http.get<Item>(url).catch((err) => {
  //     const data = err && err.response ? err.response : err;
  //     if (data && (data.status === 404 || data.status === 410)) {
  //       return null;
  //     }
  //     throw err;
  //   });
  // }

  // updateItem(item: Item, id: string): Promise<Item | null> {
  //   const url = this.url + "/" + id;
  //   return this.http.put<Item>(url, item).catch((err) => {
  //     const data = err && err.response ? err.response : err;
  //     if (data && (data.status === 404 || data.status === 410)) {
  //       return null;
  //     }
  //     throw err;
  //   });
  // }

  // saveItem(item: Item): Promise<number> {
  //   const url = this.url + "/" + item.id;
  //   return this.http.patch<number>(url, item).catch((err) => {
  //     const data = err && err.response ? err.response : err;
  //     if (data && (data.status === 404 || data.status === 410)) {
  //       return 0;
  //     }
  //     throw err;
  //   });
  // }
  
  fetchImageUploadedGallery(id: string): Promise<FileInfo[] | []> {
    return this.http.get<FileInfo[]>(this.url + `/${id}/fetchImageGalleryUploaded`).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return [];
      }
      throw err;
    });
  }

  deleteFile = (id: string, fileUrl: string): Promise<number> => {
    if (id) {
      return this.http.delete(this.url + `/${id}/gallery?&url=${fileUrl}`).then(() => {
        return 1;
      }).catch(() => 0);
    }
    return new Promise(resolve => resolve(0));
  }

  deleteFileYoutube = (id: string, fileUrl: string): Promise<number> => {
    if (id) {
      return this.http.delete(this.url + `/${id}/external-resource?url=${fileUrl}`).then(() => {
        return 1;
      }).catch(() => 0);
    }
    return new Promise(resolve => resolve(0));
  }

  uploadExternalResource = (id: string, videoId: string): Promise<number> => {
    return this.http.post(this.url + `/${id}/external-resource?type=${'youtube'}&url=${'https://www.youtube.com/embed/' + videoId}`, {}).then(() => 1).catch(() => 0);
  }

  updateData = (id: string, data: FileInfo[]): Promise<number> => {
    const body = {
      data,
      userId: id
    };
    return this.http.patch<number>(this.url + `/${id}/gallery`, body).catch(e => e);
  }
  
}

export interface Config {
  item_url: string;
  brand_url: string;
}
class ApplicationContext {
  itemService?: ItemService;
  brandService?: QueryService<string>;

  getConfig(): Config {
    return storage.config();
  }

  getItemService(): ItemService {
    if (!this.itemService) {
      const c = this.getConfig();
      this.itemService = new ItemClient(httpRequest, c.item_url);
    }
    return this.itemService;
  }

  getBrandService(): QueryService<string> {
    if (!this.brandService) {
      const c = this.getConfig();
      this.brandService = new QueryClient<string>(httpRequest, c.brand_url);
    }
    return this.brandService;
  }
}

export const context = new ApplicationContext();

export function useBrandService(): QueryService<string> {
  const [service] = useState(() => context.getBrandService());
  return service;
}
