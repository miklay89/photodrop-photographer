/* TODO store 4 files (create 3) on s3, add phones of clients 
(может быть несколько телефонов - если нет в базе - надо создавать новых)
*/
import { RequestHandler } from "express";
import Boom from "@hapi/boom";

// import { v4 as uuid } from "uuid";
// import { eq } from "drizzle-orm/expressions";
// import dbObject from "../../data/db";

// const db = dbObject.Connector;
// const { albumsTable } = dbObject.Tables;

// login controller
const uploadPhotosController: RequestHandler = async (req, res) => {
  try {
    const bodyR = req.body;
    console.log(bodyR);
    const filesR = req.files;
    console.log(filesR);
    return res.json({ bodyR, filesR });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default uploadPhotosController;
