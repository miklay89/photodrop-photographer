// TODO
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
    // const { userId } = req.body.decode;
    // res.json(userId);
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*").json("ok");
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default uploadPhotosController;
