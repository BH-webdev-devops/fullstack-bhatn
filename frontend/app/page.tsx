'use client'
import { useAuth } from "./context/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Sidebar from "./components/SideBar";
import { DeleteIcon } from '@/app/helpers/icons';


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

  const [categoryFilter, setCategoryFilter] = useState('');
  const [completedFilter, setCompletedFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleCompletedFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompletedFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriorityFilter(e.target.value);
  };

  const filteredTodos = todos.filter(todo =>
    todo.category.toLowerCase().includes(categoryFilter.toLowerCase()) &&
    (completedFilter === '' || todo.completed === (completedFilter === 'true')) &&
    todo.priority.toLowerCase().includes(priorityFilter.toLowerCase())
  );

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
  }, [isAuthenticated, categoryFilter, completedFilter, priorityFilter]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting...</p>;
  }

  const fetchTodos = async (category?: string, completed?: string, priority?: string) => {
    const token = localStorage.getItem('token')
    console.log(token)
    try {
      let res;
      if (!category && !completed && !priority) {
        res = await fetch(`https://fullstack-bhatn.onrender.com/api/todo`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        let url = `https://fullstack-bhatn.onrender.com/api/filter?`
        if (category) {
          url += `category=${category}`
        }
        else if (completed) {
          url += `completed=${completed}`
        }
        else if (priority) {
          url += `priority=${priority}`
        }
        res = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        setTodos(data.todo);
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
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/todo`, {
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

  const handleDeleteTodo = async (todoId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://fullstack-bhatn.onrender.com/api/todo/${todoId}`, {
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

        <div>
          <input
            type="text"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              fetchTodos(e.target.value);
            }}
          />
          <select value={completedFilter} onChange={(e) => {
            setCompletedFilter(e.target.value);
            fetchTodos(e.target.value);
          }}>
            <option value="">All</option>
            <option value="true">Completed</option>
            <option value="false">Not Completed</option>
          </select>
          <input
            type="text"
            placeholder="Filter by priority"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              fetchTodos(e.target.value);
            }}
          />
          {/* <div>
            {filteredTodos.map(todo => (
              <div key={todo.id}>
                <span>{todo.title}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* <h2 className="text-center text-2xl font-bold mb-6">Todo List</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {todos && todos?.map((todo: TodoType) => (
            <div key={todo.id} className="relative">
              <a
                href={`/todo/${todo.id}/task`}
                className="block p-4 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-500">{todo.description}</p>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from bubbling to the <a> tag
                  handleDeleteTodo(todo.id);
                }}
                style={{
                  color: 'red',
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {DeleteIcon()}
              </button>
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
