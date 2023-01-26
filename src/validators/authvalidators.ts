import Joi from "joi";
import Boom from "@hapi/boom";
import { RequestHandler } from "express";

// login body validation
export const checkLoginBody: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    login: Joi.string()
      .pattern(/^[a-zA-Z_`]/)
      .required(),
    password: Joi.string().alphanum().required(),
  });

  try {
    const value = schema.validate(req.body);
    if (value.error?.message) throw new Error(value.error?.message);
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(Boom.badRequest(err.message));
    }
  }
};

// sign-up body validation
export const checkSignUpBody: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    login: Joi.string()
      .pattern(/^[a-zA-Z_`]/)
      .required(),
    password: Joi.string().alphanum().required(),
    email: Joi.string(),
    fullName: Joi.string(),
  });
  try {
    const value = schema.validate(req.body);
    if (value.error?.message) throw new Error(value.error?.message);

    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(Boom.badRequest(err.message));
    }
  }
};

// refresh-token body validation
export const checkRefreshTokenBody: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  try {
    const value = schema.validate(req.body);
    if (value.error?.message) throw new Error(value.error?.message);

    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(Boom.badRequest(err.message));
    }
  }
};
