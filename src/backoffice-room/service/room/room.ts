import { Attributes, Filter, Service, Tracking,NumberRange } from 'onecore';
export interface Room extends Tracking {
    id: string;
    title: string;
    description: string;
    offer?: string[];
    price: number;
    location: string;
    host: string;
    guest: number;
    bedrooms: number;
    bed: number;
    bathrooms: number;
    highlight: string[];
    status: string;
    category?:string[];
    region?:string;
    typeof?:string[];
    property?:string;
    language?:string[];
    imageUrl?:UploadImage[];
  }
  export interface RoomFilter extends Filter {
    id?: string;
    title?: string;
    description?: string;
    offer?: string[];
    price?: NumberRange;
    location?: string;
    host?: string;
    guest?: number;
    bedrooms?: number;
    bed?: number;
    bathrooms?: number;
    highlight?: string[];
    status?: string;
    category?:string[];
    region?:string;
    typeof?:string[];
    property?:string;
    language?:string[];
}
export interface UploadImage {
    source?: string;
    type?: string;
    url: string;
  }
export interface RoomService extends Service<Room, string, RoomFilter> {
}
export const fileUploadImageModel: Attributes = {
    type: {},
    url: {
    },
    source: {
    },
  };
  export const roomModel: Attributes = {
      id: {
          key: true,
          length: 40,
      },
      title: {
          length: 120
      },
      description: {
          length: 1000
      },
      price:{
          type:'number'
      },
      offer:{
          type:'strings'
      },
      location:{
          length:255
      },
      host:{
          length:255
      },
      guest:{
          type:'number'
      },
      bedrooms:{
          type:'number'
      },
      bed:{
          type:'number'
      },
      bathrooms:{
          type:'number'
      },
      highlight:{
          type:'strings'
      },
      status:{
          type:'string'
      },
      category:{
          type:'strings'
      },
      region:{
          type:'string'
      },
      typeof:{
          type:'strings'
      },
      property:{
          type:'string'
      },
      language:{
          type:'strings'
      },
      imageUrl: {
          type: 'array',
          typeof: fileUploadImageModel,
        },
  };