import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { usersTable } = dbObject.Tables;

const getAllUsersController: RequestHandler = async (req, res) => {
  try {
    // select all existing users
    const users = await db.select(usersTable).fields({
      login: usersTable.login,
    });

    // res - with OK status
    return res.status(200).json(users);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default getAllUsersController;
