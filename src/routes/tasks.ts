import { Router, Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/task";
import auth from "../middlewares/auth";
import { IUser } from "../models/user";
import { UserRole } from "../models/user";

const taskRoutes = Router();

interface TaskFields {
  username?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
}

interface GetTasksRequest extends Request {
  user: IUser;
}

interface CreateTaskRequest extends Request {
  user: IUser;
  body: TaskFields;
  params: { id: string };
}

interface UpdateTaskRequest extends Request {
  user: IUser;
  body: TaskFields;
  params: { id: string };
}

interface DeleteTaskRequest extends Request {
  user: IUser;
  params: { id: string };
}

interface IQuery {
  userId?: string;
}

const regEmail: RegExp = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// @route     GET /tasks/
// @desc      Get all tasks
// @access    Public
taskRoutes.get(
  "/task/",
  auth,
  async (req: GetTasksRequest, res: Response, next: NextFunction) => {
    let tasks;
    try {
      let query: IQuery = {};
      if (req.user.role === UserRole.User) {
        query.userId = req.user._id;
      }
      tasks = await Task.find(query);
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
  "/task",
  auth,
  async (req: CreateTaskRequest, res: Response, next: NextFunction) => {
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
  "/task/:id",
  auth,
  async (req: UpdateTaskRequest, res: Response, next: NextFunction) => {
    const { username, phone, email } = req.body;

    if (!username || !phone || !regEmail.test(email)) {
      res.sendStatus(400);
      return;
    }
    // Build task object
    const taskFields: TaskFields = {};
    taskFields.username = username;
    taskFields.phone = phone;
    taskFields.email = email;

    try {
      // check if the task exists
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: "Task not found" });

      // check if the user is admin
      if (req.user.role == "admin") {
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
          .json({ msg: "You are not authorized to make this request" });
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
  "/task/:id",
  auth,
  async (req: DeleteTaskRequest, res: Response, next: NextFunction) => {
    try {
      // check if the task exists
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: "Task not found" });

      // if user's admin delete the task
      if (req.user.role == "admin") {
        await Task.findByIdAndRemove(req.params.id);
        res.json({ msg: "Task removed" });
        return;
      }

      // check if the user is admin or own the task
      if (task.userId.toString() != req.user._id) {
        res
          .status(401)
          .json({ msg: "You are not authorized to make this request" });
        return;
      }

      await Task.findByIdAndRemove(req.params.id);
      res.json({ msg: "Task removed" });
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  }
);

export default taskRoutes;
