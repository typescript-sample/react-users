import { Attributes, Tracking, Filter, Service } from 'onecore';

export interface PlaylistFilter extends Filter {
    id?: string;
    title?: string;
    userId?: string;
}

export interface Playlist extends Tracking {
    id?: string;
    title?: string;
    userId?: string;
    imageurl?:string
}
export interface PlaylistService extends Service<Playlist, string, PlaylistFilter> {
}
export const playlistModel: Attributes = {
    id: {
        key: true,
        length: 40
    },
    title: {
        length: 250,
    },
    userId: {
        length: 250,
    },
    imageurl: {
        length: 250,
      }
};