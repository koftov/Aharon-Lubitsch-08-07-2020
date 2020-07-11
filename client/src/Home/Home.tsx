import React, { useState, useEffect, useContext } from "react";
import { TaskList } from "./TaskList/TaskList";
import { Input, Button, Container } from "semantic-ui-react";
import axios from "axios";
import TaskForm from "./TaskForm/TaskForm";
import { UserContext } from "../user-context";
import { RouteComponentProps } from "react-router-dom";

interface HomeProps extends RouteComponentProps {}

const Home: React.FC<HomeProps> = (props) => {
  const userContext = useContext(UserContext);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (!userContext.user) return;
    async function getTasks() {
      const res = await axios("/task");
      setTasks(res.data);
    }
    getTasks();
  }, [userContext.user]);

  return (
    <Container>
      <h1 className='ui green header'>ניהול משימות</h1>
      <Input fluid placeholder='חיפוש משימה' />
      <TaskForm
        setTasks={setTasks}
        tasks={tasks}
        showModalForm={showModalForm}
        setShowModalForm={setShowModalForm}
        taskToEdit={taskToEdit}
        setTaskToEdit={setTaskToEdit}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>רשימת הלקוחות שלך ({tasks.length})</span>
        <Button
          className='ui green button'
          onClick={() => setShowModalForm(true)}
        >
          משימה חדשה
        </Button>
      </div>
      <div className='table-div'>
        <TaskList
          setTasks={setTasks}
          setTaskToEdit={setTaskToEdit}
          tasks={tasks}
          setShowModalForm={setShowModalForm}
        />
      </div>
    </Container>
  );
};

export default Home;
