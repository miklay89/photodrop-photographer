import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { albumsTable } = dbObject.Tables;

// get album by id
const getAlbumController: RequestHandler = async (req, res) => {
  try {
    const albumId = req.params.album_id;
    const album = await db
      .select(albumsTable)
      .where(eq(albumsTable.albumId, albumId));

    return res.json({ data: album });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default getAlbumController;
