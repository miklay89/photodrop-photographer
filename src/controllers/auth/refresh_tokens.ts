import { RequestHandler } from "express";
import { eq } from "drizzle-orm/expressions";
import Boom from "@hapi/boom";
import dbObject from "../../data/db";
import createTokens from "../../libs/jwt_generator";

const db = dbObject.Connector;
const { sessionsTable } = dbObject.Tables;

// refresh tokens controller
const refreshTokensController: RequestHandler = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken as string;
    const timeStamp = new Date(Date.now()).toJSON();

    // check existing session
    const sessionIsExist = await db
      .select(sessionsTable)
      .where(eq(sessionsTable.refreshToken, refreshToken));

    if (!sessionIsExist.length)
      return res.status(401).json(Boom.badRequest("Invalid refresh token."));

    // check session expiration
    if (
      Date.parse(timeStamp) >=
      Date.parse(sessionIsExist[0].expiresIn as unknown as string)
    ) {
      // delete old session
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionId, sessionIsExist[0].sessionId));

      return res
        .status(401)
        .json(Boom.badRequest("Session is expired, please log-in."));
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
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default refreshTokensController;
