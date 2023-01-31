export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
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
