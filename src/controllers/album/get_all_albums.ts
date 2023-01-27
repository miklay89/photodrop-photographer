import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { albumsTable } = dbObject.Tables;

// get all albums by user id
const getAllAlbumsController: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body.decode;
    const albums = await db
      .select(albumsTable)
      .where(eq(albumsTable.userId, userId));

    return res.json({ data: albums });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default getAllAlbumsController;
