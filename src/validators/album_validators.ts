import Joi from "joi";
import Boom from "@hapi/boom";
import { RequestHandler } from "express";

// create album body validation
export const createAlbumBody: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    datapicker: Joi.string().required(),
    decode: Joi.object({
      userId: Joi.string().required(),
      iat: Joi.number().required(),
      exp: Joi.number().required(),
    }).required(),
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

// get album by album id validation
export const getAlbumById: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    album_id: Joi.string().required(),
  });

  try {
    const value = schema.validate(req.params);
    if (value.error?.message) throw new Error(value.error?.message);
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(Boom.badRequest(err.message));
    }
  }
};

// get all albums by user id
export const getAllAlbumsByUserId: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
  });

  try {
    const value = schema.validate(req.params);
    if (value.error?.message) throw new Error(value.error?.message);
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(Boom.badRequest(err.message));
    }
  }
};
