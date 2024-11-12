'use client'
import { useAuth } from "./context/AuthContext";
import {useRouter} from 'next/navigation'
import { useEffect, useState } from "react";


export default function Home() {
  const { user, loading, isAuthenticated }: any = useAuth()
  const router = useRouter()
  const [todos, setTodos] = useState<{ todo_id: string, todo_title: string }[]>([])
  // const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    // Only check for redirection once loading is complete
    if (!loading && !isAuthenticated) {
      console.log('loading true')
      router.push('/');
      
    }
    else if (!loading && isAuthenticated){
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




  return (
    <>
      {!loading && isAuthenticated && user && (
        <h1 className="text-center text-xl">Hello world {user && user.email}</h1>
      )}
      <h2 className="text-center text-2xl font-bold mb-6">Todo List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {todos?.map((todo: { todo_id: string, todo_title: string }) => (
          <a
          key={todo.todo_id}
          href={`/todo/${todo.todo_id}/task`}
          className="block p-4 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
        >
          <h3 className="text-lg font-semibold">{todo.todo_title}</h3>
          <p className="text-gray-500">ID: {todo.todo_id}</p>
        </a>
        ))}
    </div>

    </>
  );
}
