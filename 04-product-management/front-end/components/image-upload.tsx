'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string;
  error?: string;
}

export function ImageUpload({ onImageChange, currentImage, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage changes (for form reset)
  React.useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='space-y-2'>
      <Label>Product Image *</Label>

      <input ref={fileInputRef} type='file' accept='image/*' onChange={handleInputChange} className='hidden' />

      {preview ? (
        <Card className='relative'>
          <CardContent className='p-4'>
            <div className='relative'>
              <Image src={preview} alt='Product preview' width={400} height={192} className='w-full h-48 object-cover rounded-lg' />
              <Button type='button' variant='destructive' size='sm' className='absolute top-2 right-2 h-8 w-8 p-0' onClick={handleRemoveImage}>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={`border-2 border-dashed cursor-pointer transition-colors ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
          <CardContent className='p-8 text-center'>
            <div className='flex flex-col items-center space-y-2'>
              <div className='p-3 bg-gray-100 rounded-full'>
                <ImageIcon className='h-6 w-6 text-gray-500' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-700'>Click to upload or drag and drop</p>
                <p className='text-xs text-gray-500 mt-1'>PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
