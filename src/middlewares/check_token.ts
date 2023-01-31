import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";

dotenv.config();

const db = dbObject.Connector;
const { usersTable } = dbObject.Tables;

const tokenSecret = process.env.TOKEN_SECRET as string;

const checkTokens: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Invalid token.");
    }

    const decode = jwt.verify(token, tokenSecret);

    if (typeof decode === "string") throw new Error("Invalid token.");

    const { userId } = decode;

    const user = await db
      .select(usersTable)
      .where(eq(usersTable.userId, userId));

    if (!user.length) throw new Error("Invalid token");

    req.body.decode = decode;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json(Boom.unauthorized(err.message));
    }
  }
};

export default checkTokens;