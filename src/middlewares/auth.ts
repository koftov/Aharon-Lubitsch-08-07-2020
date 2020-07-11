import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";

interface IGetUserAuthInfoRequest extends Request {
  cookies: string;
  user: IUser;
}

const auth = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const userId: string = req.cookies["userid"];
  if (!userId) {
    res.sendStatus(403);
    return;
  }

  try {
    const user = await User.findById(userId);

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
