import { Router, Request, Response, NextFunction } from 'express';

import Task from '../models/task';

const taskRoutes = Router();

// @route     GET /tasks/:id
// @desc      Get all tasks
// @access    Public

taskRoutes.get(
  '/task/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await Task.find();
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, phone, email } = req.body;
    try {
      const newTask = new Task({ username, phone, email });

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
  async (req: Request, res: Response, next: NextFunction) => {
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if the task exists
      let task: {} = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Task not found' });

      await Task.findByIdAndRemove(req.params.id);

      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  }
);

export default taskRoutes;
