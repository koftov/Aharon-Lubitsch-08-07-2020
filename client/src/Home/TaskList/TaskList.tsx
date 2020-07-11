import React from "react";
import { Table } from "semantic-ui-react";
import { TaskItem } from "./TaskItem/TaskItem";

interface TaskListProps {
  tasks: Array<Task>;
  setTasks: Function;
  setTaskToEdit: Function;
  setShowModalForm: Function;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  setTaskToEdit,
  setShowModalForm,
}) => {
  return (
    <Table unstackable selectable textAlign='right'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={2}>
            <input type='checkbox' /> שם משתמש
          </Table.HeaderCell>
          <Table.HeaderCell width={2}>טלפון</Table.HeaderCell>
          <Table.HeaderCell width={4}>מייל</Table.HeaderCell>
          <Table.HeaderCell width={4}>תאריך יצירת המשימה</Table.HeaderCell>
          <Table.HeaderCell width={3}>פעולות</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.map((task, i) => (
          <TaskItem
            key={i}
            tasks={tasks}
            setTasks={setTasks}
            setTaskToEdit={setTaskToEdit}
            task={task}
            setShowModalForm={setShowModalForm}
          />
        ))}
      </Table.Body>
    </Table>
  );
};
