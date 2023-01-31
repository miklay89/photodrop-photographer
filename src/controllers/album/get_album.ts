import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { albumsTable, photosTable } = dbObject.Tables;

// TODO add clients + photos
// get album by id
const getAlbumController: RequestHandler = async (req, res) => {
  try {
    const albumId = req.params.album_id;
    const query = await db
      .select(albumsTable)
      .leftJoin(photosTable, eq(photosTable.albumId, albumsTable.albumId))
      .where(eq(albumsTable.albumId, albumId));

    const album = query.map((q) => q.pd_albums)[0];
    const photos = query.map((q) => q.pd_photos);
    const data = [{ album, photos }];
    return res.json({ data });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(400).json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default getAlbumController;
