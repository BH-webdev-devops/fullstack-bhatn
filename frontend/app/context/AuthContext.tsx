'use client'


import React, { createContext, useContext, useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'



interface AuthContextType {
  user: any;
  isAuthenticated: boolean,
  loading: boolean, 
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

  // Check if there is a token in localStorage on app load
  useEffect(() => {
    fetchProfile()
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token')
    console.log(token)
    if (!token) {
        setLoading(false)
      return
    }
    try {
      const res = await fetch(`https://todolist-app-5rgn.onrender.com/api/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        console.log("data", data)
        setUser(data.user)
        setIsAuthenticated(true)
      }
    }
    catch (err) {
      setIsAuthenticated(false)
      console.log(`Error fetching profile ${err}`)
    }
    finally{
      setLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('https://todolist-app-5rgn.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    return data
    // if (data.token) {
    //   localStorage.setItem('token', data.token);
    //   setUser(data.user);
    // }
  };

  // Login function
  const login = async (email: string, password: string) => {
    const res = await fetch('https://todolist-app-5rgn.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("data", data)
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true)
      setLoading(false)
      return data
    }
    
  };

 // Logout function
const logout = () => {
  localStorage.removeItem('token');  // Remove the token from local storage
  setUser(null);                     // Clear the user data
  setIsAuthenticated(false);         // Set authentication status to false
  setLoading(false);
  router.push('/login');             // Redirect to the login page
};

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}> 
    {children}
  </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

