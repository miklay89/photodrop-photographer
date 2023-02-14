/* eslint-disable class-methods-use-this */
import Joi from "joi";
import Boom from "@hapi/boom";
import { RequestHandler } from "express";

class AuthValidator {
  // login body validation
  public checkLoginBody: RequestHandler = (req, res, next) => {
    const schema = Joi.object({
      login: Joi.string()
        .pattern(/^[a-zA-Z_`]/)
        .required(),
      password: Joi.string().alphanum().required(),
    });

    try {
      const value = schema.validate(req.body);
      if (value.error?.message) throw Boom.badData(value.error.message);
      next();
    } catch (err) {
      next(err);
    }
  };

  // sign-up body validation
  public checkSignUpBody: RequestHandler = (req, res, next) => {
    const schema = Joi.object({
      login: Joi.string()
        .pattern(/^[a-zA-Z_]+$/, { name: "letters and underscore" })
        .required(),
      password: Joi.string().alphanum().required(),
      email: Joi.string(),
      fullName: Joi.string(),
    });
    try {
      const value = schema.validate(req.body);
      if (value.error?.message) throw Boom.badData(value.error.message);
      next();
    } catch (err) {
      next(err);
    }
  };

  // auth/refresh
  public checkCookies: RequestHandler = (req, res, next) => {
    try {
      const schema = Joi.object({
        refreshToken: Joi.string().required(),
      });

      const value = schema.validate(req.cookies);
      if (value.error?.message) throw Boom.badData(value.error?.message);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthValidator();
