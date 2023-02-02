export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface IPhoto {
  photoId: string;
  albumId: string;
  lockedThumbnailUrl: string;
  lockedPhotoUrl: string;
  unlockedThumbnailUrl: string;
  unlockedPhotoUrl: string;
}
