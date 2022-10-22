import { HttpRequest } from "axios-core";
import { Client } from "web-clients";
import { Playlist, PlaylistFilter, playlistModel, PlaylistService } from "./playlist";

export * from "./playlist";

export class PlaylistClient
  extends Client<Playlist, string, PlaylistFilter>
  implements PlaylistService
{
  constructor(http: HttpRequest, private url: string) {
    super(http, url, playlistModel);
    this.searchGet = false;
  }

  postOnly(s: PlaylistFilter): boolean {
    return true;
  }

}