import React, { useState, useEffect, useContext } from 'react';
import { TaskList } from './TaskList/TaskList';
import { Container, Input, Button } from 'semantic-ui-react';
import axios from 'axios';
import TaskForm from './TaskForm/TaskForm';
import { UserContext } from '../user-context';
import { RouteComponentProps } from 'react-router-dom';

interface HomeProps extends RouteComponentProps {}

const Home: React.FC<HomeProps> = (props) => {
  const userContext = useContext(UserContext);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (!userContext.user) return;
    axios('/task').then((res) => setTasks(res.data));
  }, [userContext.user]);

  return (
    <Container>
      <h1 className="ui green header">ניהול משימות</h1>
      <Input
        className="left icon"
        icon={{ name: 'search' }}
        fluid
        placeholder="חיפוש משימה"
        // onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span style={{ padding: 12, fontWeight: 'bold' }}>
        רשימת הלקוחות שלך ({tasks.length})
      </span>
      <Button
        className="ui green button"
        style={{ float: 'left', marginBottom: 10 }}
        onClick={() => setShowModalForm(true)}
      >
        משימה חדשה
      </Button>
      <TaskForm
        setTasks={setTasks}
        tasks={tasks}
        showModalForm={showModalForm}
        setShowModalForm={setShowModalForm}
        taskToEdit={taskToEdit}
        setTaskToEdit={setTaskToEdit}
      />
      <TaskList
        setTasks={setTasks}
        setTaskToEdit={setTaskToEdit}
        tasks={tasks}
        setShowModalForm={setShowModalForm}
      />
    </Container>
  );
};

export default Home;
