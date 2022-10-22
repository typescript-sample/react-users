import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { RoomClient, RoomService } from './room';

export * from './room';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  room_url: string;
}
class ApplicationContext {
  roomService?: RoomService;


  constructor() {
    this.getConfig = this.getConfig.bind(this); 
    this.getRoomService = this.getRoomService.bind(this); 
  }

  getConfig(): Config {
    return storage.config();
  }
  getRoomService(): RoomService {
    if (!this.roomService) {
      const c = this.getConfig();
      this.roomService = new RoomClient(httpRequest, c.room_url);
    }
    return this.roomService;
  }
}

export const context = new ApplicationContext();
export function getRoomService(): RoomService {
  return context.getRoomService();
}