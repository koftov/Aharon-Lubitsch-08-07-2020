import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Modal } from "semantic-ui-react";

const regEmail: RegExp = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface TaskFormProps {
  tasks: Array<Task>;
  setTasks(tasks: Task[]): void;
  showModalForm: boolean;
  setShowModalForm: (show: boolean) => void;
  taskToEdit: Task | null;
  setTaskToEdit: (task: Task | null) => void;
}

const initialNewTaskValue: Task = {
  username: "",
  phone: "",
  email: "",
};

const TaskForm: React.FC<TaskFormProps> = ({
  setTasks,
  tasks,
  showModalForm,
  setShowModalForm,
  taskToEdit,
  setTaskToEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<Task>(initialNewTaskValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError(null);
    e.preventDefault();
    if (!task.email || !task.phone || !task.username) {
      setError("אנא הכנס את כל השדות");
      return;
    }

    if (!regEmail.test(task.email)) {
      setError('אנא הכנס כתובת דוא"ל חוקית');
      return;
    }
    setLoading(true);
    if (taskToEdit) {
      const res = await axios.put<Task>(`/task/${taskToEdit._id}`, task);
      task.username = "";
      task.phone = "";
      task.email = "";
      setShowModalForm(false);
      setTasks(
        tasks.map((task) => (task._id === res.data._id ? res.data : task))
      );

      setTaskToEdit(null);
    } else {
      const res = await axios.post<Task>("/task", task);
      setTask(initialNewTaskValue);
      setShowModalForm(false);
      setTasks([...tasks, res.data]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (taskToEdit) {
      setTask({
        email: taskToEdit.email,
        username: taskToEdit.username,
        phone: taskToEdit.phone,
      });
    }
  }, [taskToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setShowModalForm(false);
    setTaskToEdit(null);
    setTask(initialNewTaskValue);
    setError(null);
  };

  return (
    <Modal
      open={showModalForm}
      onClose={closeModal}
      style={{ textAlign: "right" }}
    >
      <Modal.Header>{!taskToEdit ? "הוספת" : "עריכת"} משימה</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={handleSubmit}
          className=' ui aligned right'
          loading={loading}
        >
          <Form.Group widths='equal' dir='rtl'>
            <Form.Field
              control={Input}
              value={task.username}
              type='text'
              placeholder='שם משתמש'
              onChange={handleChange}
              name='username'
            />
            <Form.Field
              control={Input}
              value={task.phone}
              type='number'
              placeholder='טלפון'
              onChange={handleChange}
              name='phone'
            />
            <Form.Field
              style={{ textAlign: "right" }}
              control={Input}
              value={task.email}
              type='email'
              placeholder='מייל'
              onChange={handleChange}
              name='email'
            />
          </Form.Group>
          <p style={{ color: "red" }}>{error}</p>
          <Form.Field
            control={Button}
            type='submit'
            disabled={!task.email || !task.username || !task.phone}
          >
            {!taskToEdit ? "הוספת" : "עריכת"} משימה
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default TaskForm;
