import React, { useState } from "react";
import { Table, Modal } from "semantic-ui-react";
import Moment from "react-moment";
import axios, { AxiosResponse } from "axios";

interface TaskItemProps {
  task: Task;
  tasks: Array<Task>;
  setTasks: Function;
  setTaskToEdit: Function;
  setShowModalForm: Function;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  setTasks,
  tasks,
  setTaskToEdit,
  setShowModalForm,
}) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const deleteTask = async (taskToDelete: Task) => {
    const res = await axios.delete<AxiosResponse>(`/task/${taskToDelete._id}`);
    if (res.status === 200) {
      setTasks(tasks.filter((t) => t._id !== taskToDelete._id));
    }
  };

  const handleEdit = () => {
    setTaskToEdit(task);
    setShowModalForm(true);
  };

  return (
    <Table.Row>
      <Table.Cell>{task.username}</Table.Cell>
      <Table.Cell>{task.phone}</Table.Cell>
      <Table.Cell>{task.email}</Table.Cell>
      <Table.Cell>
        <Moment format='DD.MM.YYYY'>{task.createdAt}</Moment>
      </Table.Cell>
      <Table.Cell className='actions-cell'>
        <i
          title='צפייה'
          className='eye icon'
          onClick={() => setShowTaskModal(true)}
        ></i>
        <i
          title='עריכה'
          className='pencil alternate icon'
          onClick={handleEdit}
        ></i>
        <i
          title='מחיקה'
          className='trash alternate icon'
          onClick={() => deleteTask(task)}
        ></i>
        <Modal open={showTaskModal} onClose={() => setShowTaskModal(false)}>
          <Modal.Content>
            <Table.Row>
              <Table.Cell>שם משתמש</Table.Cell>
              <Table.Cell>טלפון</Table.Cell>
              <Table.Cell>מייל</Table.Cell>
              <Table.Cell>תאריך יצירת המשימה</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{task.username}</Table.Cell>
              <Table.Cell>{task.phone}</Table.Cell>
              <Table.Cell>{task.email}</Table.Cell>
              <Table.Cell>
                <Moment format='DD.MM.YYYY'>{task.createdAt}</Moment>
              </Table.Cell>
            </Table.Row>
          </Modal.Content>
        </Modal>
      </Table.Cell>
    </Table.Row>
  );
};
