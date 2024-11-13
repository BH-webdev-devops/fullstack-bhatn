'use client'
import { useAuth } from "./context/AuthContext";
import {useRouter} from 'next/navigation'
import { useEffect, useState } from "react";
import Sidebar from "./components/SideBar";


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
  


export default function Home() {
  const { user, loading, isAuthenticated }: any = useAuth()
  const router = useRouter()
  const [todos, setTodos] = useState<TodoType[]>([])
  const [isAddingTodo, setIsAddingTodo] = useState(false); // Controls the popup form visibility
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    completed: false,
  });

  // const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    // Only check for redirection once loading is complete
    console.log("loading ", loading)
    console.log("isAuthenticated ", isAuthenticated)
    if (!loading && !isAuthenticated) {
      router.push('/register')
    }
    else if (!loading && isAuthenticated) {
      fetchTodos();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting...</p>; 
  }

  const fetchTodos = async () => {
    const token = localStorage.getItem('token')
    console.log(token)
    // if (!token) {
    //     setFetchLoading(false)
    //   return
    // }
    try {
      const res = await fetch(`http://localhost:3000/api/todo`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        console.log("data", data)
        setTodos(data.todo)

      }
    }
    catch (err) {
      console.log(`Error fetching profile ${err}`)
    }
    finally{
      // setFetchLoading(false)
    }

  }
  
   // Handle input change for new todo fields
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  // Submit the new todo to the backend
  const handleAddTodo = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/todo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) throw new Error('Failed to add todo');

      const createdTodo = await res.json();
      console.log("created todo ", createdTodo)
      setTodos((prevTodos) => [...prevTodos, createdTodo.todo]); // Add the new todo to the list
      setIsAddingTodo(false); // Close the popup
      setNewTodo({ title: '', description: '', priority: '', category: '', completed: false }); // Reset the form
    } catch (err: any) {
      console.error('Error adding todo:', err.message);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      {/* Sidebar on the left */}
      <Sidebar />
  
      {/* Main content on the right */}
      <div className="p-4">
        {/* {!loading && isAuthenticated && user && (
          <h1 className="text-center text-xl">Hello world {user.email}</h1>
        )} */}
        <h2 className="text-center text-2xl font-bold mb-6">Todo List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {todos?.map((todo: TodoType) => (
            <a
              key={todo.id}
              href={`/todo/${todo.id}/task`}
              className="block p-4 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <p className="text-gray-500">{todo.description}</p>
            </a>
          ))}
        </div>
      </div>
       {/* Add Todo Button */}
       <button
        onClick={() => setIsAddingTodo(true)}
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

      {/* Popup Form for Adding a New Todo */}
      {isAddingTodo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsAddingTodo(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-80"
            onClick={(e) => e.stopPropagation()} // Prevents popup from closing when clicking inside it
          >
            <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
            <input
              type="text"
              name="title"
              value={newTodo.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              value={newTodo.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="priority"
              value={newTodo.priority}
              onChange={handleChange}
              placeholder="Priority"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="category"
              value={newTodo.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddTodo}
              className="w-full bg-blue-500 text-white p-2 rounded mt-2"
            >
              Add Todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
}
