import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";
import { IAuthor } from "../models/Author";
import { IBook } from "../models/Book";

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      Logging.error(error);
      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  author: {
    create: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
    update: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
  },
  book: {
    create: Joi.object<IBook>({
      title: Joi.string().required(),
      author: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/), //Up to 24 Characters Alpha-Numeric
    }),
    update: Joi.object<IBook>({
      title: Joi.string().required(),
      author: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
};
