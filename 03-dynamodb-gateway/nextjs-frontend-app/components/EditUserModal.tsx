'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsers } from '@/hooks/useUsers';
import { userApi } from '@/lib/api';
import { CreateUserRequest } from '@/lib/types';

interface EditUserModalProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

export function EditUserModal({ userId, open, onClose }: EditUserModalProps) {
  const { updateUser, updateUserStatus } = useUsers();
  const [formData, setFormData] = useState<CreateUserRequest>({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && open) {
      setLoading(true);
      setError(null);
      userApi
        .getUserById(userId)
        .then((u) => {
          setFormData({ name: u.name, email: u.email });
        })
        .catch(() => setError('Failed to fetch user.'))
        .finally(() => setLoading(false));
    }
  }, [userId, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setError(null);
    try {
      await updateUser({ id: userId, data: formData });
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update user.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the user information below.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className='py-8 text-center'>Loading...</div>
        ) : error ? (
          <div className='text-red-500 text-sm mb-4'>{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-name'>Name</Label>
              <Input id='edit-name' name='name' type='text' value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-email'>Email</Label>
              <Input id='edit-email' name='email' type='email' value={formData.email} onChange={handleInputChange} required />
            </div>
            <DialogFooter>
              <Button variant='outline' type='button' onClick={onClose} disabled={updateUserStatus === 'pending'}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateUserStatus === 'pending'}>
                {updateUserStatus === 'pending' ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
