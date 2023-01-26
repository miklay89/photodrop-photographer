import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import bcryptjs from "bcryptjs";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";
import createTokens from "../../helpers/createtokens";

const db = dbObject.Connector;
const { usersTable, sessionsTable, albumsTable } = dbObject.Tables;

// login controller
const loginController: RequestHandler = async (req, res) => {
  try {
    const login = req.body.login.toLowerCase();
    const password = req.body.password as string;

    // try to find user in db for check is it exist
    const user = await db.select(usersTable).where(eq(usersTable.login, login));

    if (!user.length) {
      return res
        .status(400)
        .json(Boom.badRequest(`User with login - ${login} isn't exist.`));
    }

    // compare passwords
    const passwordIsCorrect = await bcryptjs.compare(
      password,
      user[0].password,
    );

    if (!passwordIsCorrect) {
      return res.status(400).json(Boom.badRequest("Password is incorrect."));
    }

    // create tokens for next auth
    const tokens = createTokens(user[0].userId);

    // session expire in - 5 days
    const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
    const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();

    const newSession = {
      sessionId: uuid(),
      userId: user[0].userId,
      refreshToken: tokens.refreshToken,
      expiresIn: sessionExpireTimestamp as unknown as Date,
    };

    // saving session
    await db.insert(sessionsTable).values(newSession);

    // getting albums info
    const albums = await db
      .select(albumsTable)
      .where(eq(albumsTable.userId, user[0].userId));

    return res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ accessToken: tokens.accessToken, albums });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default loginController;
