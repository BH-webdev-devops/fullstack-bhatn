'use client'
import { useAuth } from "./context/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Sidebar from "./components/SideBar";
import { DeleteIcon, CancelIcon, CalendarIcon, EditIcon } from '@/app/helpers/icons';



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
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTodo, setEditedTodo] = useState<{ title: string; description: string, priority: string, category: string } | null>(null);

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
    finally {
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

  const handleEditClick = (todo: TodoType) => {
    setIsEditing(todo.id);
    setEditedTodo({ title: todo.title, description: todo.description, priority: todo.priority, category: todo.category});
  };

  const handleCancelEdit = async () => {
    setIsEditing(null);
    setEditedTodo(null);
  }

  const handleSaveEdit = async (todoId: number) => {
    const token = localStorage.getItem('token');
    if (!editedTodo) return;

    try {
      const res = await fetch(`http://localhost:3000/api/todo/${todoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTodo.title, description: editedTodo.description, priority: editedTodo.priority, category: editedTodo.category }),
      });

      if (!res.ok) throw new Error('Failed to update todo');

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, title: editedTodo.title, description: editedTodo.description,  priority: editedTodo.priority, category: editedTodo.category} : todo
        )
      );

      setIsEditing(null);
      setEditedTodo(null);
    } catch (err: any) {
      console.error('Error saving todo:', err.message);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/todo/${todoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete todo');

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (err: any) {
      console.error('Error deleting todo:', err.message);
    }
  };


  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="p-4">
        {!loading && isAuthenticated && user && (
          <h1 className="text-center text-2xl font-bold text-blue-600 mt-4 mb-6">Hey {user.email}, Find your TODOs here!</h1>
        )}

      <div className="flex justify-center my-4">
          <button
            onClick={() => setIsAddingTodo(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            New Todo
          </button>
        </div>

        {/* <h2 className="text-center text-2xl font-bold mb-6">Todo List</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {todos &&
                todos.map((todo: TodoType) => (
                  <div key={todo.id} className="relative">
                   
                    
                    {isEditing === todo.id ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Edit Todo</h3>
                        <input
                          type="text"
                          value={editedTodo?.title || ""}
                          onChange={(e) => setEditedTodo({ ...editedTodo!, title: e.target.value })}
                          placeholder="Title"
                          className="w-full rounded-md border-gray-300 mb-2"
                        />
                        <textarea
                          value={editedTodo?.description || ""}
                          onChange={(e) => setEditedTodo({ ...editedTodo!, description: e.target.value })}
                          placeholder="Description"
                          className="w-full rounded-md border-gray-300 mb-2"
                        />
                        <select
                          value={editedTodo?.priority || ""}
                          onChange={(e) => setEditedTodo({ ...editedTodo!, priority: e.target.value })}
                          className="w-full rounded-md border-gray-300 mb-2"
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <select
                          value={editedTodo?.category || ""}
                          onChange={(e) => setEditedTodo({ ...editedTodo!, category: e.target.value })}
                          className="w-full rounded-md border-gray-300 mb-4"
                        >
                          <option value="">Select Category</option>
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                          <option value="others">Others</option>
                        </select>
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleSaveEdit(todo.id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <a
                          href={`/todo/${todo.id}/task`}
                          className="block p-4 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
                        >
                          <h3 className="text-lg font-semibold">{todo.title}</h3>
                          <p className="text-gray-500">{todo.description}</p>
                          <p className="text-gray-500 mb-2">
                          <strong>Priority:</strong> {todo.priority}
                          </p>
                          <p className="text-gray-500 mb-2">
                            <strong>Category:</strong> {todo.category}
                          </p>
                        </a>
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEditClick(todo)}
                            className="mr-2 p-2 text-green-300"
                          >
                           {EditIcon()}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent click propagation
                              handleDeleteTodo(todo.id);
                            }}
                            className="ml-2 p-2 text-red-600"
                          >
                           {DeleteIcon()}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>



      </div>
        {/* Popup form to add a new todo */}
        {isAddingTodo && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Add a new Todo</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={newTodo.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full rounded-md border-gray-300"
                />
                <textarea
                  name="description"
                  value={newTodo.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full rounded-md border-gray-300"
                />
                <select
                  name="priority"
                  value={newTodo.priority}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  name="category"
                  value={newTodo.category}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Select Category</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="others">Others</option>
                </select>
                <button
                  onClick={handleAddTodo}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAddingTodo(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        
    </div>

  );

}
