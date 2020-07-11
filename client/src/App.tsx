import React, { useState, useEffect } from 'react';
import { TaskList } from './TaskList/TaskList';
import { Container, Input, Button } from 'semantic-ui-react';
import axios from 'axios';
import TaskForm from './TaskForm/TaskForm';
import './App.scss';

const App: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [showModalForm, setShowModalForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    axios('/task').then((res) => setTasks(res.data));
  }, []);

  return (
    <Container>
      <h1 className="ui green header">ניהול משימות</h1>
      <Input
        className="left icon"
        icon={{ name: 'search' }}
        fluid
        placeholder="חיפוש משימה"
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

export default App;
