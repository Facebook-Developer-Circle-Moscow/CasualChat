import {ObjectId} from 'mongodb';

export interface User {
  _id?: ObjectId,
  id?: string;
  displayName?: string;
  facebook?: {
    id: string;
    access: string;
    refresh: string;
  };
  google?: {
    id: string;
    token: string;
    secret: string;
  };
  twitter?: {
    id: string;
    token: string;
    secret: string;
  };
  yandex?: {
    id: string;
    access: string;
    refresh: string;
  };
  vk?: {
    id: string;
    access: string;
    refresh: string;
  };
  github?: {
    id: string;
    access: string;
    refresh: string;
  };
}

export interface UserSearch {
  'facebook.id'?: User['facebook']['id'];
  'google.id'?: User['google']['id'];
  'twitter.id'?: User['twitter']['id'];
  'yandex.id'?: User['yandex']['id'];
  'vk.id'?: User['vk']['id'];
  'github.id'?: User['github']['id'];
}

export type DoneUser = (error: any, user?: User) => void;
export type DoneId = (error: any, id?: string) => void;