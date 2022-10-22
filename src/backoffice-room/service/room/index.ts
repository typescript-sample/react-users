import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Room, RoomFilter, roomModel, RoomService } from './room';

export * from './room';

export class RoomClient extends Client<Room, string, RoomFilter> implements RoomService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, roomModel);
    this.searchGet = false;
  }
  postOnly(s: RoomFilter): boolean {
    return true;
  }
}