import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";
import { keys } from "../config/keys";
import * as jwt from "jsonwebtoken";

export interface IPayload {
  userId: string;
}

interface IGetUserAuthInfoRequest extends Request {
  cookies: string;
  user: IUser;
}

const auth = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies[keys.cookieName];
  if (!token) {
    res.sendStatus(403);
    return;
  }
  const payload = jwt.verify(token, keys.secret) as IPayload;
  console.log(payload);

  try {
    const user = await User.findById(payload.userId);

    if (!user) {
      res.sendStatus(403);
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

export default auth;
