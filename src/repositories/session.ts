import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { PDPSession } from "../data/schema";

const db = dbObject.Connector;
const { sessionsTable } = dbObject.Tables;

export default class SessionRepository {
  static async saveSession(newSession: PDPSession): Promise<void> {
    await db.insert(sessionsTable).values(newSession);
  }

  static async getSessionByRefreshToken(
    refreshToken: string,
  ): Promise<PDPSession[] | null> {
    const session = await db
      .select(sessionsTable)
      .where(eq(sessionsTable.refreshToken, refreshToken));
    if (!session.length) return null;
    return session;
  }

  static async deleteSessionById(id: string): Promise<void> {
    await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, id));
  }

  static async updateSessionById(
    newSession: PDPSession,
    id: string,
  ): Promise<void> {
    await db
      .update(sessionsTable)
      .set(newSession)
      .where(eq(sessionsTable.sessionId, id));
  }
}
