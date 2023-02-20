import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import { PDPUser } from "../data/schema";
import { NewUser, PDPUserLogin } from "../types/types";

const db = dbObject.Connector;
const { usersTable } = dbObject.Tables;

export default class UserRepository {
  static async getAllUsers(): Promise<PDPUserLogin[] | null> {
    const users = await db.select(usersTable).fields({
      login: usersTable.login,
    });
    if (!users.length) return null;
    return users;
  }

  static async getUsersByLogin(login: string): Promise<PDPUser[] | null> {
    const user = await db.select(usersTable).where(eq(usersTable.login, login));
    if (!user.length) return null;
    return user;
  }

  static async saveUser(newUser: NewUser): Promise<void> {
    await db.insert(usersTable).values(newUser);
  }

  static async getUserById(id: string): Promise<PDPUser[] | null> {
    const user = await db.select(usersTable).where(eq(usersTable.userId, id));
    if (!user.length) return null;
    return user;
  }
}
