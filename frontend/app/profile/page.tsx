'use client'
import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';


const Profile = () => {
    const { user }: any = useAuth();
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
        <img src={`http://localhost:3000${user.profilepicture}`} alt="Profile picture" />
        )}
  </div>

    </div>
  );
};

export default Profile;