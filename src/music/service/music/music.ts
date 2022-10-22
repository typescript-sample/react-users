import { Attributes, Filter, Service, TimeRange } from 'onecore';


export interface MusicFilter extends Filter {
  id?: string;
  name?: string;
  author?: string[];
  releaseDate?: Date;
  duration?: TimeRange;
  lyric?: string;

}

export interface Music {
  id: string;
  name: string;
  author?: string[];
  releaseDate?: Date;
  duration?: Date;
  lyric?: string;
  imageURL?: string;
  url?: string;
}

export interface MusicService extends Service<Music, string, MusicFilter> {
}


export const musicModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 300,
    q: true
  },
  author: {
    type: 'strings',
  },
  releaseDate: {
    type: 'datetime'
  },
  lyric: {
  },
  imageURL: {
    length: 1500,
  },
  url: {
    length: 1500,
  }
};
