/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuid } from "uuid";
import dbObject from "../../data/db";
import createTokens from "../../libs/jwt_generator";

const db = dbObject.Connector;
const { usersTable, sessionsTable } = dbObject.Tables;

class AuthController {
  public signUp: RequestHandler = async (req, res, next) => {
    const login = (req.body.login as string).toLowerCase();
    const { password, email, fullName } = req.body;

    try {
      // check if user exist
      await db
        .select(usersTable)
        .where(eq(usersTable.login, login))
        .then((query) => {
          if (query.length)
            throw Boom.conflict(`User with login - ${login} is exist.`);
        });

      // hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // new user object
      const newUser = {
        login,
        password: hashedPassword,
        userId: uuid(),
        email: email || null,
        fullName: fullName || null,
      };

      // store new user in DB
      await db.insert(usersTable).values(newUser);

      // res - with OK status
      return res
        .status(200)
        .json({ message: "User is registered.", login, password });
    } catch (err) {
      next(err);
    }
    return null;
  };

  public logIn: RequestHandler = async (req, res, next) => {
    const login = req.body.login.toLowerCase();
    const password = req.body.password as string;
    let userId: string = "";
    let hashedPassword: string = "";

    try {
      // try to find user in db for check is it exist
      await db
        .select(usersTable)
        .where(eq(usersTable.login, login))
        .then((query) => {
          if (!query.length)
            throw Boom.notFound(`User with login - ${login} isn't exist.`);
          hashedPassword = query[0].password;
          userId = query[0].userId;
        });

      // compare passwords
      await bcryptjs.compare(password, hashedPassword).then((same) => {
        if (!same) throw Boom.badRequest("Password is incorrect.");
      });

      // create tokens for next auth
      const tokens = createTokens(userId);

      // session expire in - 5 days
      const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
      const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();

      const newSession = {
        sessionId: uuid(),
        userId,
        refreshToken: tokens.refreshToken,
        expiresIn: sessionExpireTimestamp as unknown as Date,
      };

      // saving session
      await db.insert(sessionsTable).values(newSession);

      return res
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json({ accessToken: tokens.accessToken });
    } catch (err) {
      next(err);
    }
    return null;
  };

  public refreshTokens: RequestHandler = async (req, res, next) => {
    const { refreshToken } = req.cookies;

    try {
      const timeStamp = new Date(Date.now()).toJSON();

      // check existing session
      const sessionIsExist = await db
        .select(sessionsTable)
        .where(eq(sessionsTable.refreshToken, refreshToken));

      if (!sessionIsExist.length)
        throw Boom.badRequest("Invalid refresh token.");

      // check session expiration
      if (
        Date.parse(timeStamp) >=
        Date.parse(sessionIsExist[0].expiresIn as unknown as string)
      ) {
        // delete old session
        await db
          .delete(sessionsTable)
          .where(eq(sessionsTable.sessionId, sessionIsExist[0].sessionId));

        throw Boom.unauthorized("Session is expired, please log-in.");
      }

      // creating new tokens - access and refresh
      const newTokens = createTokens(sessionIsExist[0].userId);

      // creating new session
      // session expire in - 5 days
      const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
      const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();

      // update session in DB
      const newSession = {
        sessionId: sessionIsExist[0].sessionId,
        userId: sessionIsExist[0].userId,
        refreshToken: newTokens.refreshToken,
        expiresIn: sessionExpireTimestamp as unknown as Date,
      };

      await db
        .update(sessionsTable)
        .set(newSession)
        .where(eq(sessionsTable.sessionId, newSession.sessionId));

      return res
        .cookie("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json({ accessToken: newTokens.accessToken });
    } catch (err) {
      next(err);
    }
    return null;
  };

  public me: RequestHandler = async (req, res) => {
    return res.json({ message: "ok" });
  };
}

export default new AuthController();
