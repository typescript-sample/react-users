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
  duration?: string;
  lyric?: string;
  imageURL?: string;
  mp3URL?: string;
}


export interface MusicService extends Service<Music, string,MusicFilter> {
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
  mp3URL: {
    length: 1500,
  }
};

