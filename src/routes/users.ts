import { Router, Request, Response, NextFunction } from 'express';
import * as md5 from 'md5';
import User from '../models/user';

const userRoutes = Router();

// @route     POST /users/login
// @desc      Login a user
// @access    Public

userRoutes.post(
  '/task/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        email,
        password: md5(password),
      });
      if (!user) {
        res.sendStatus(401);
        return;
      }
      // success
    } catch (error) {}
    if (!email || !password) {
      res.sendStatus(400);
      return;
    }
  }
);

// @route     POST /users/
// @desc      Regiser a user
// @access    Public

userRoutes.post(
  '/task',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      res.json().send();
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

export default userRoutes;
