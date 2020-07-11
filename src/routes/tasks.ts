import { Router, Request, Response, NextFunction } from 'express';

import Task from '../models/task';
import auth from '../middlewares/auth';

const taskRoutes = Router();

// @route     GET /tasks/
// @desc      Get all tasks
// @access    Public
taskRoutes.get(
  '/task/',
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    let tasks;
    try {
      if (req.user.role == 'admin') {
        tasks = await Task.find();
      } else {
        tasks = await Task.find({ userId: req.user._id });
      }
      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

// @route     POST /tasks/
// @desc      Add new task
// @access    Private

taskRoutes.post(
  '/task',
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    const { username, phone, email } = req.body;
    try {
      const newTask = new Task({
        username,
        phone,
        email,
        userId: req.user._id,
      });

      const task = await newTask.save();

      res.json(task).send();
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

// @route     UPDATE /tasks/:id
// @desc      Update task
// @access    Private
taskRoutes.put(
  '/task/:id',
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    const { username, phone, email } = req.body;

    if (!username || !phone || !email) {
      res.sendStatus(400);
      return;
    }
    // Build task object
    const taskFields: any = {};
    taskFields.username = username;
    taskFields.phone = phone;
    taskFields.email = email;

    try {
      // check if the task exists
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Task not found' });

      // check if the user is admin
      if (req.user.role == 'admin') {
        task = await Task.findByIdAndUpdate(req.params.id, taskFields, {
          new: true,
        });
        res.json(task);
        return;
      }

      // check if the user own the task
      if (task.userId.toString() != req.user._id) {
        res
          .status(401)
          .json({ msg: 'You are not authorized to make this request' });
        return;
      }

      task = await Task.findByIdAndUpdate(req.params.id, taskFields, {
        new: true,
      });
      res.json(task);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

// @route     DELETE /tasks/:id
// @desc      Delete task
// @access    Private

taskRoutes.delete(
  '/task/:id',
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      // check if the task exists
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Task not found' });

      // if user's admin delete the task
      if (req.user.role == 'admin') {
        await Task.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Task removed' });
        return;
      }

      // check if the user is admin or own the task
      if (task.userId.toString() != req.user._id) {
        res
          .status(401)
          .json({ msg: 'You are not authorized to make this request' });
        return;
      }

      await Task.findByIdAndRemove(req.params.id);
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  }
);

export default taskRoutes;
