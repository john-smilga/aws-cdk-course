'use client';

import { ProductForm } from '@/components/product-form';
import { ProductList } from '@/components/product-list';

export default function Home() {
  return (
    <div className='min-h-screen bg-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Product Management</h1>
          <p className='text-gray-600'>Create and manage your products</p>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Create Product Form */}
          <ProductForm />

          {/* Right Side - Products List */}
          <ProductList />
        </div>
      </div>
    </div>
  );
}
