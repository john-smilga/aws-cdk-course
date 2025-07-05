'use client';

import { createContext, useContext, useState } from 'react';
import { UserForm } from './UserForm';
import { UserList } from './UserList';

// Create a context for sharing user state
const UserContext = createContext<{
  refreshUsers: () => void;
} | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export function UserCRUD() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshUsers = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <UserContext.Provider value={{ refreshUsers }}>
      <div className='container mx-auto p-6 space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-2'>User Management System</h1>
          <p className='text-gray-600'>Create and manage users with our CRUD application</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='lg:col-span-1'>
            <UserForm />
          </div>

          <div className='lg:col-span-1'>
            <UserList key={refreshKey} />
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}
