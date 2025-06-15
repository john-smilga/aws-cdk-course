import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, CreateUserRequest } from '@/lib/types';
import { userApi } from '@/lib/api';

export function useUsers() {
  const queryClient = useQueryClient();

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch: fetchUsers,
  } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: userApi.getAllUsers,
  });

  // Create user
  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserRequest> }) => userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    isError,
    error,
    fetchUsers,
    createUser: createUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    createUserStatus: createUserMutation.status,
    deleteUserStatus: deleteUserMutation.status,
    updateUserStatus: updateUserMutation.status,
  };
}
