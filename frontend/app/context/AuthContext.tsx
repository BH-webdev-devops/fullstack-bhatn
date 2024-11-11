'use client'


import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  // Check if there is a token in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch the user data here, or simply set a user status if authenticated
    //   setUser({}); // placeholder for user data
    }
  }, []);

  // Register function
  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('http://localhost:3000/api/register', {
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
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("data", data)
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
    }
    return data
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

    // Profile function


  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
