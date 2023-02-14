/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { usersTable } = dbObject.Tables;

class User {
  public getAllUsers: RequestHandler = async (req, res, next) => {
    try {
      // select all existing users
      await db
        .select(usersTable)
        .fields({
          login: usersTable.login,
        })
        .then((query) => {
          if (!query.length) throw Boom.notFound();
          res.status(200).json(query);
        });
    } catch (err) {
      next(err);
    }
  };
}

export default new User();
