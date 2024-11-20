'use client'
import React from 'react';
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'

const Profile = () => {
  const useContext = useAuth()
  const { user } = useContext ?? {};
  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <div>
        {user.profilepicture && (
          <Image src={`http://localhost:3000${user.profilepicture}`} alt="Profile picture" height={32} width={32} />
        )}
      </div>

    </div>
  );
};

export default Profile;