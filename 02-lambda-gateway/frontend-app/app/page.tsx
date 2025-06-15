'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
const API_URL = 'https://o7skyi8sba.execute-api.eu-north-1.amazonaws.com/';
export default function Home() {
  const [data, setData] = useState<string>('');

  const handleGetRequest = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      console.log(response.data);
      setData(response.data.message);
    } catch (error) {
      setData('Error fetching data');
      console.error('Error:', error);
    }
  };

  const handlePostRequest = async () => {
    try {
      const response = await axios.post(`${API_URL}profile`, {
        // Add your post data here
        username: 'bobo is the best',
      });
      console.log(response.data);
      setData(response.data.message);
    } catch (error) {
      setData('Error posting data');
      console.error('Error:', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 p-4'>
      <div className='w-full max-w-2xl p-4 border rounded-lg min-h-[200px] bg-gray-50'>
        <pre className='whitespace-pre-wrap'>{data || 'Data will appear here...'}</pre>
      </div>
      <div className='flex gap-4'>
        <Button onClick={handleGetRequest} variant='default' className='cursor-pointer'>
          GET Request
        </Button>
        <Button onClick={handlePostRequest} variant='default' className='cursor-pointer'>
          POST Request
        </Button>
      </div>
    </div>
  );
}
