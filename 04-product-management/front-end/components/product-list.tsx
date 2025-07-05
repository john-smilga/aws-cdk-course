'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts, useRemoveProduct } from '@/lib/hooks';
import { Product } from '@/lib/api';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function ProductCard({ product }: { product: Product }) {
  const removeProduct = useRemoveProduct();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSrc = product.imageUrl;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (product.id) {
      await removeProduct.mutateAsync(product.id);
    }
  };

  return (
    <>
      <Card className='hover:shadow-md transition-shadow relative'>
        {/* Delete Button - Positioned absolutely in top right edge */}
        <Button variant='destructive' size='sm' onClick={handleDeleteClick} disabled={removeProduct.isPending} className='absolute top-0 right-0 h-6 w-6 p-0 z-10 rounded-none rounded-tr-md rounded-bl-md cursor-pointer'>
          {removeProduct.isPending ? <span className='text-xs'>...</span> : <Trash2 className='h-3 w-3' />}
        </Button>
        <CardContent className='p-4'>
          <div className='flex items-start space-x-4'>
            {/* Product Image */}
            {imageSrc && (
              <div className='flex-shrink-0 w-20 h-20 relative'>
                {!imageLoaded && <Skeleton className='w-20 h-20 rounded-lg absolute top-0 left-0' />}
                <Image
                  src={imageSrc}
                  alt={product.name}
                  width={80}
                  height={80}
                  className={`w-20 h-20 object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Product Info */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-col h-full'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-1'>{product.name}</h3>
                  {product.description && <p className='text-gray-600 text-sm line-clamp-2'>{product.description}</p>}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className='flex-shrink-0'>
              <span className='text-lg font-bold text-gray-500'>${product.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} title='Delete Product' description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`} confirmText='Delete' cancelText='Cancel' onConfirm={handleConfirmDelete} isLoading={removeProduct.isPending} />
    </>
  );
}

function EmptyState() {
  return (
    <div className='text-center py-12'>
      <div className='text-gray-400 mb-4'>
        <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
        </svg>
      </div>
      <p className='text-gray-500 text-lg'>No products yet</p>
      <p className='text-gray-400 text-sm'>Create your first product using the form on the left</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3].map((i) => (
        <Card key={i} className='animate-pulse'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start mb-2'>
              <div className='h-6 bg-gray-200 rounded w-1/3'></div>
              <div className='h-6 bg-gray-200 rounded w-16'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-2/3 mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-20'></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className='text-center py-12'>
      <div className='text-red-400 mb-4'>
        <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
        </svg>
      </div>
      <p className='text-red-500 text-lg'>Failed to load products</p>
      <p className='text-red-400 text-sm'>{error.message}</p>
    </div>
  );
}

export function ProductList() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : products && products.length > 0 ? (
          <div className='space-y-4'>
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}
