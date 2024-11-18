'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/app/components/SideBar';
import { DeleteIcon, CancelIcon, CalendarIcon, EditIcon } from '@/app/helpers/icons';
import { useAuth } from '@/app/context/AuthContext';
import {useRouter} from 'next/navigation';

interface TaskType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  completed: boolean;
  deadline: string | null;
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
  const { loading, isAuthenticated }: any = useAuth()
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<{ name: string; completed: boolean } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const params = useParams<{ id: string }>();
  const [todo, setTodo] = useState<TodoType | null>(null);
  const router = useRouter()

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/todo/${params.id}/task`, {
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

  const fetchTodo = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/todo/${params.id}`, {
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

  useEffect(() => {
    
    if (!loading && !isAuthenticated) {
      router.push('/register')
    }
    else if (!loading && isAuthenticated) {
      fetchTasks();
      fetchTodo();
    }

  }, [loading, isAuthenticated]);

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log(loading, isAuthenticated)

  // if (!user) {
  //   return <p>Redirecting...</p>;
  // }

 

  

  const toggleTaskCompletion = async (taskId: number) => {
    const token = localStorage.getItem('token');
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;

    const updatedCompletedStatus = !task.completed;
    console.log(typeof task.completed, task.completed)
    try {
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/task/${taskId}`, {
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

  const handleCancelEdit = async () => {
    setIsEditing(null);
    setEditedTask(null);
  }

  const handleSaveEdit = async (taskId: number) => {
    const token = localStorage.getItem('token');
    if (!editedTask) return;

    try {
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/task/${taskId}`, {
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
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/task/${taskId}`, {
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
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/task`, {
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
      <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tasks for {todo?.title}</h1>
          <p className="text-gray-700 mb-2"><strong>Description:</strong> {todo?.description}</p>
          <p className="text-gray-700"><strong>Priority:</strong> {todo?.priority}</p>
        </div>

        <div className="flex justify-start my-4 w-full max-w-3xl">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            New Task
          </button>
        </div>

        {isAdding && (
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name"
              style={{ marginRight: '8px' }}
            />
            <button onClick={handleAddTask}>Add</button>
            <button onClick={() => setIsAdding(false)} style={{ marginLeft: '8px' }}>
              {CancelIcon()}
            </button>
          </div>
        )}

        <ul className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
          {tasks && tasks.map((task) => (
            <li key={task.id} style={{ display: 'flex',  marginBottom: '8px' }} className="flex py-4 border-b border-gray-200 last:border-b-0">
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

                  <button onClick={() => handleCancelEdit()} style={{ marginLeft: '8px' }}>
                    {CancelIcon()}
                  </button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'gray' : 'black',
                    }} className="text-lg text-gray-700"
                  > 

                    <div className="flex  space-x-4 p-2 rounded-lg shadow-md">
                        <div className="flex space-x-2">
                          {CalendarIcon(new Date(task.created_at))}
                          {task.deadline ? CalendarIcon(new Date(task.deadline)) : <div style={{ width: '50px' }}></div>}
                        </div>
                        <span className="text-lg text-gray-700 font-semibold">{task.name}</span>
                      </div>
                    
                  </span>

                  <div className="flex justify-end my-4 w-full">
                    <button onClick={() => handleEditClick(task)} className="mr-2 p-2 text-green-300">
                      {EditIcon()}
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="ml-2 p-2 text-red-600">
                      {DeleteIcon()}
                    </button>
                  </div>
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
