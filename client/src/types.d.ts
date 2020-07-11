type Task = {
  email?: string;
  phone?: string;
  username?: string;
  createdAt?: string | undefined;
  _id?: string | undefined;
};

type ToggleTask = (selectedTask: Task) => void;
