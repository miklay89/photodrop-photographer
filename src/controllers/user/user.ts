import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import UserRepository from "../../repositories/user";
import { PDPUserLogin, TypedResponse } from "../../types/types";

export default class UserController {
  static getAllUsers: RequestHandler = async (
    req,
    res: TypedResponse<PDPUserLogin[]>,
    next,
  ) => {
    try {
      const users = await UserRepository.getAllUsers();
      if (!users) throw Boom.notFound();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
}
