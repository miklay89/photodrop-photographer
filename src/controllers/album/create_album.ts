import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { v4 as uuid } from "uuid";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { albumsTable } = dbObject.Tables;

const createAlbumController: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body.decode;
    const { name, location, datapicker } = req.body;

    const createdAt = new Date(Date.parse(datapicker)).toJSON();

    const newAlbum = {
      albumId: uuid(),
      name,
      location,
      createdAt: createdAt as unknown as Date,
      userId,
    };

    await db.insert(albumsTable).values(newAlbum);

    return res.json({ message: "Album created", album: newAlbum });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(400).json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default createAlbumController;
