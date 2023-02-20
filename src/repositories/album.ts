import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { PDPAlbum } from "../data/schema";
import { AlbumWithPhotos } from "../types/types";

const db = dbObject.Connector;
const { albumsTable, photosTable } = dbObject.Tables;

export default class AlbumRepository {
  static async saveAlbum(newAlbum: PDPAlbum): Promise<void> {
    await db.insert(albumsTable).values(newAlbum);
  }

  static async getAlbumWithPhotosById(
    id: string,
  ): Promise<AlbumWithPhotos | null> {
    const albumWithPhotos = await db
      .select(albumsTable)
      .leftJoin(photosTable, eq(photosTable.albumId, albumsTable.albumId))
      .where(eq(albumsTable.albumId, id));
    if (!albumWithPhotos.length) return null;

    const album: AlbumWithPhotos = albumWithPhotos.map(
      (data) => data.pd_albums,
    )[0];
    if (!albumWithPhotos[0].pd_photos?.photoId) {
      album.photos = [];
      return album;
    }
    album.photos = albumWithPhotos.map((data) => data.pd_photos!);
    return album;
  }

  static async getAllAlbumsByUserId(id: string): Promise<PDPAlbum[] | null> {
    const albums = await db
      .select(albumsTable)
      .where(eq(albumsTable.userId, id));
    if (!albums.length) return null;
    return albums;
  }
}
