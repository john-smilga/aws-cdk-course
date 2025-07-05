import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productsApi, CreateProductRequest, Product } from './api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await productsApi.getProducts();
        return Array.isArray(data) ? data : [];
      } catch (e) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductRequest) => productsApi.createProduct(product),
    onSuccess: (data) => {
      toast.success('Product created successfully!');
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Optionally, add the new product to the cache immediately
      queryClient.setQueryData(['products'], (old: Product[] | undefined) => {
        if (Array.isArray(old)) {
          return [...old, data.product];
        }
        return [data.product];
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

export const useRemoveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productsApi.removeProduct(productId),
    onSuccess: (data) => {
      toast.success('Product removed successfully!');
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Optionally, remove the product from cache immediately
      queryClient.setQueryData(['products'], (old: Product[] | undefined) => {
        if (old) {
          return old.filter((product: Product) => product.id !== data.productId);
        }
        return old;
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to remove product');
    },
  });
};
