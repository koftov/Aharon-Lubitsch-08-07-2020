import { Router, Request, Response, NextFunction } from "express";
import * as md5 from "md5";
import User, { IUser } from "../models/user";
import auth from "../middlewares/auth";
import * as jwt from "jsonwebtoken";
import { keys } from "../config/keys";

const ERROR_DUPLICATE_VALUE: number = 11000;

interface AuthRequest extends Request {
  user: IUser;
}

const userRoutes = Router();

// @route     POST /signup
// @desc      Signup a user
// @access    Public

userRoutes.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const newUser: IUser = new User({ username, password });
    newUser.password = md5(newUser.password);
    try {
      const createdUser: IUser = await newUser.save();
      const token: string = jwt.sign({ userId: createdUser._id }, keys.secret, {
        expiresIn: 60 * 60 * 24,
      });
      res.cookie(keys.cookieName, token);
      res.status(201).json(createdUser);
    } catch (err) {
      if (err.code === ERROR_DUPLICATE_VALUE) {
        res.sendStatus(409);
        return;
      }
      console.log(err);
      res.sendStatus(400);
    }
  }
);

// @route     POST /users/login
// @desc      Login a user
// @access    Public

userRoutes.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      const user: IUser = await User.findOne({
        username,
        password: md5(password),
      });
      if (!user) {
        res.sendStatus(401);
        return;
      }
      const token: string = jwt.sign({ userId: user._id }, keys.secret, {
        expiresIn: 60 * 60 * 24,
      });
      // success
      res.cookie(keys.cookieName, token);
      res.json(user);
    } catch (err) {
      res.sendStatus(400);
      console.log(err);
      return;
    }
  }
);

userRoutes.get(
  "/me",
  auth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    res.json(req.user);
  }
);

userRoutes.post(
  "/logout",
  (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie(keys.cookieName);
    res.sendStatus(200);
  }
);

export default userRoutes;
