'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useUsers } from '@/hooks/useUsers';
import { EditUserModal } from './EditUserModal';

export function UserList() {
  const { users, isLoading, isError, error, fetchUsers, deleteUser, deleteUserStatus } = useUsers();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string; email: string } | null>(null);

  // Sort users by createdAt descending (latest first)
  const sortedUsers = Array.isArray(users)
    ? [...users].sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
    : [];

  const handleEdit = (userId: string) => {
    setEditingUserId(userId);
    // Will open modal or inline form in next step
  };

  const openDeleteModal = (user: { id: string; name: string; email: string }) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      // error handled by React Query
    }
  };

  // Export users to CSV
  const handleExportCSV = () => {
    if (!users || users.length === 0) return;
    const headers = Object.keys(users[0]);
    const csvRows = [headers.join(',')];
    for (const user of users) {
      const row = headers.map((h) => JSON.stringify((user as unknown as Record<string, unknown>)[h] ?? '')).join(',');
      csvRows.push(row);
    }
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export users to JSON
  const handleExportJSON = () => {
    if (!users || users.length === 0) return;
    const jsonContent = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription className='mt-2'>Loading users...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription className='mt-2 text-red-500'>{error?.message || 'Failed to load users.'}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col'>
            <CardTitle>Users</CardTitle>
            <CardDescription className='mt-2'>All registered users in the system</CardDescription>
          </div>
          <div className='flex gap-2 items-center'>
            <Button onClick={handleExportCSV} variant='secondary' size='sm'>
              Export CSV
            </Button>
            <Button onClick={handleExportJSON} variant='secondary' size='sm'>
              Export JSON
            </Button>
            <Button onClick={() => fetchUsers()} variant='outline' size='sm'>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedUsers.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>No users found. Create your first user above!</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left p-2 font-medium'>Name</th>
                  <th className='text-left p-2 font-medium'>Email</th>
                  <th className='text-left p-2 font-medium'>Created</th>
                  <th className='text-left p-2 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className='border-b hover:bg-gray-50'>
                    <td className='p-2'>{user.name}</td>
                    <td className='p-2'>{user.email}</td>
                    <td className='p-2 text-sm text-gray-500'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className='p-2 flex gap-2'>
                      <Button size='icon' variant='outline' className='h-7 w-7' onClick={() => handleEdit(user.id!)}>
                        <Pencil className='w-4 h-4' />
                      </Button>
                      <Button size='icon' variant='destructive' className='h-7 w-7' onClick={() => openDeleteModal({ id: user.id!, name: user.name, email: user.email })} disabled={deleteUserStatus === 'pending' && userToDelete?.id === user.id}>
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Modal */}
        <EditUserModal userId={editingUserId} open={!!editingUserId} onClose={() => setEditingUserId(null)} />

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <span className='font-semibold'>{userToDelete?.name}</span> (<span className='font-mono'>{userToDelete?.email}</span>)? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={closeDeleteModal} disabled={deleteUserStatus === 'pending'}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDelete} disabled={deleteUserStatus === 'pending'}>
                {deleteUserStatus === 'pending' ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
