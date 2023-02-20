import { Request, Response } from "express";
// eslint-disable-next-line import/no-unresolved
import { Send } from "express-serve-static-core";
import { PDPAlbum, PDPPhoto } from "../data/schema";

export interface SignUpRequest extends Request {
  body: {
    login: string;
    password: string;
    email?: string;
    fullName?: string;
  };
}

export interface LogInRequest extends Request {
  body: {
    login: string;
    password: string;
  };
}

export interface RefreshTokensRequest extends Request {
  cookies: {
    refreshToken: string;
  };
}
export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface UploadPhotosRequest extends Request {
  body: {
    album: string;
    clients: string;
  };
}

export interface CreateAlbumRequest extends Request {
  body: {
    name: string;
    location: string;
    datapicker: string;
  };
}

export interface PDPUserLogin {
  login: string;
}

export interface NewUser {
  login: string;
  password: string;
  userId: string;
  email?: string | null;
  fullName?: string | null;
}

export interface NewPhoto {
  photoId: string;
  unlockedPhotoUrl: string;
  unlockedThumbnailUrl: string;
  lockedPhotoUrl: string;
  lockedThumbnailUrl: string;
  albumId: string;
  clients: string | null;
}

export interface AlbumWithPhotos extends PDPAlbum {
  photos?: PDPPhoto[] | [];
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
