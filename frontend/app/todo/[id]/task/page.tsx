'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/app/components/SideBar';

interface TaskType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  completed: boolean;
}

interface TodoType {
  id: number,
  title: string,
  description: string,
  user_id: number,
  created_at: string,
  updated_at: string,
  priority: string,
  completed: boolean,
  category: string
}
  

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<{ name: string; completed: boolean } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const params = useParams<{ id: string }>();
  const [todo, setTodo] = useState<TodoType | null >(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3000/api/todo/${params.id}/task`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch task details');
        }

        const data = await res.json();
        setTasks(data.task); // This should only happen once, inside useEffect
        
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchTasks();


    const fetchTodo = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3000/api/todo/${params.id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch todo details');
        }

        const data = await res.json();
        console.log('todo details', data.todo)
        setTodo(data.todo); // This should only happen once, inside useEffect
        
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchTodo();

  }, []);
  const toggleTaskCompletion = async (taskId: number) => {
    const token = localStorage.getItem('token');
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;

    const updatedCompletedStatus = !task.completed;
    console.log(typeof task.completed , task.completed)
    try {
      const res = await fetch(`http://localhost:3000/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: Boolean(updatedCompletedStatus) }),
      });

      if (!res.ok) throw new Error('Failed to update task');

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, completed: updatedCompletedStatus } : t))
      );
    } catch (err: any) {
      console.error('Error updating task:', err.message);
    }
  };

  const handleEditClick = (task: TaskType) => {
    setIsEditing(task.id);
    setEditedTask({ name: task.name, completed: task.completed });
  };

  const handleSaveEdit = async (taskId: number) => {
    const token = localStorage.getItem('token');
    if (!editedTask) return;

    try {
      const res = await fetch(`http://localhost:3000/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedTask.name, completed: editedTask.completed }),
      });

      if (!res.ok) throw new Error('Failed to update task');

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, name: editedTask.name, completed: editedTask.completed } : task
        )
      );

      setIsEditing(null);
      setEditedTask(null);
    } catch (err: any) {
      console.error('Error saving task:', err.message);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/task/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete task');

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      console.error('Error deleting task:', err.message);
    }
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem('token');
    if (!newTaskName) return;

    try {
      console.log("todo id ", params.id)
      const res = await fetch(`http://localhost:3000/api/task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todoId: params.id, name: newTaskName, completed: false, }),
      });

      if (!res.ok) throw new Error('Failed to add task');

      const newTask = await res.json();
      console.log(newTask)
      
      setTasks((prevTasks) => [...prevTasks, newTask.task]);
      console.log(tasks)
      
      setIsAdding(false);
      setNewTaskName("");
    } catch (err: any) {
      console.error('Error adding task:', err.message);
    }
  };

  return (

    <div className="grid grid-cols-[250px_1fr] h-screen">

      <Sidebar />
    {/* Main content on the right */}
    <div className="p-4">
      <h1>Tasks for todo {params.id}</h1>
      <p>description: {todo?.description}</p>
      <p>priority: {todo?.priority}</p>
      <button type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        onClick={() => setIsAdding(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '24px',
          padding: '10px 15px',
          borderRadius: '50%',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      {isAdding && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Enter task name"
            style={{ marginRight: '8px' }}
          />
          <button onClick={handleAddTask}>Save</button>
          <button onClick={() => setIsAdding(false)} style={{ marginLeft: '8px' }}>
            Cancel
          </button>
        </div>
      )}

      {/* <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span
              onClick={() => toggleTaskCompletion(task.id)}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid #000',
                marginRight: '10px',
                cursor: 'pointer',
                display: 'inline-block',
                backgroundColor: task.completed ? '#4caf50' : 'transparent',
              }}
            ></span>

            {isEditing === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTask?.name || ''}
                  onChange={(e) => setEditedTask({ ...editedTask!, name: e.target.value })}
                  style={{ marginRight: '8px' }}
                />
                <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                <button onClick={() => handleDeleteTask(task.id)} style={{ color: 'red', marginLeft: '8px' }}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'gray' : 'black',
                  }}
                >
                  {task.name}
                </span>
                <button onClick={() => handleEditClick(task)} style={{ marginLeft: '8px' }}>
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul> */}
      <ul>
  {tasks && tasks.map((task) => (
    <li key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <span
        onClick={() => toggleTaskCompletion(task.id)}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid #000',
          marginRight: '10px',
          cursor: 'pointer',
          display: 'inline-block',
          backgroundColor: task.completed ? '#4caf50' : 'transparent',
        }}
      ></span>

      {isEditing === task.id ? (
        <>
          <input
            type="text"
            value={editedTask?.name || ''}
            onChange={(e) => setEditedTask({ ...editedTask!, name: e.target.value })}
            style={{ marginRight: '8px' }}
          />
          <button onClick={() => handleSaveEdit(task.id)}>Save</button>
          <button onClick={() => handleDeleteTask(task.id)} style={{ color: 'red', marginLeft: '8px' }}>
            Delete
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'gray' : 'black',
            }}
          >
          {task.name}
          </span>
          <button onClick={() => handleEditClick(task)} style={{ marginLeft: '8px' }}>
            Edit
          </button>
        </>
      )}
    </li>
  ))}
</ul>
    </div>
    </div>
  );
};

export default Task;
