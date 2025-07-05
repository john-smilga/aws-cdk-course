'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateProduct } from '@/lib/hooks';
import { ImageUpload } from '@/components/image-upload';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  imageFile: z.any().refine((file) => file !== null, 'Product image is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const createProduct = useCreateProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await createProduct.mutateAsync({
        name: data.name,
        description: data.description,
        price: data.price,
        imageFile: imageFile,
      });
      reset({
        name: '',
        description: '',
        price: 0,
      });
      setImageFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Product Name *</Label>
            <Input id='name' {...register('name')} placeholder='Enter product name' className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description *</Label>
            <Textarea id='description' {...register('description')} placeholder='Enter product description' rows={3} className={errors.description ? 'border-red-500' : ''} />
            {errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='price'>Price *</Label>
            <Input id='price' type='number' step='0.01' min='0' {...register('price', { valueAsNumber: true })} placeholder='0.00' className={errors.price ? 'border-red-500' : ''} />
            {errors.price && <p className='text-sm text-red-500'>{errors.price.message}</p>}
          </div>

          <ImageUpload onImageChange={setImageFile} currentImage={imageFile ? URL.createObjectURL(imageFile) : undefined} error={errors.imageFile?.message as string} />

          <Button type='submit' className='w-full' disabled={isSubmitting || createProduct.isPending}>
            {isSubmitting || createProduct.isPending ? 'Creating...' : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
