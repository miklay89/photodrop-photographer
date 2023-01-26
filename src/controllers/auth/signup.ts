import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuid } from "uuid";
import dbObject from "../../data/db";

const db = dbObject.Connector;
const { usersTable } = dbObject.Tables;

// sign up controller
const signUpController: RequestHandler = async (req, res) => {
  try {
    const login = (req.body.login as string).toLowerCase();
    const password = req.body.password as string;

    // optional fields
    const email = req.body.email as string;
    const fullName = req.body.fullName as string;

    // check if user exist
    const userExist = await db
      .select(usersTable)
      .where(eq(usersTable.login, login));

    if (userExist.length) {
      return res
        .status(400)
        .json(Boom.badRequest(`User with login - ${login} is exist.`));
    }

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
    if (err instanceof Error) {
      console.log(err.message);
      return res.json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default signUpController;
