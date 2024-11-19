'use client'
import React from 'react';
import { useAuth } from '../context/AuthContext'
// import { useRouter } from 'next/router';


const Profile = () => {
  const authContext = useAuth();
  const user = authContext?.user;
    // const router = useRouter();
  if (!user) {
    // router.push('/');
    return null;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <div>
        {user.profilepicture && (
        <img src={`https://todolist-app-5rgn.onrender.com${user.profilepicture}`} alt="Profile picture" />
        )}
  </div>

    </div>
  );
};

export default Profile;