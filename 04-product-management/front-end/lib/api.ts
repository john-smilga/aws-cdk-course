import axios from 'axios';

const API_BASE_URL = 'https://k83kjpufqf.execute-api.eu-north-1.amazonaws.com';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // S3 URL for the image
  thumbnailUrl?: string; // Optional thumbnail image
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageFile: File | null;
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi = {
  createProduct: async (product: CreateProductRequest): Promise<CreateProductResponse> => {
    // Convert image file to base64 if present
    let imageUrl: string | undefined;
    if (product.imageFile) {
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(product.imageFile!);
      });
    }

    const requestData = {
      name: product.name,
      description: product.description,
      price: product.price,
      imageData: imageUrl || '',
    };

    const response = await api.post<CreateProductResponse>('/products', requestData);
    console.log(response.data);
    return response.data;
  },

  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  removeProduct: async (productId: string): Promise<{ message: string; productId: string }> => {
    const response = await api.delete<{ message: string; productId: string }>(`/products/${productId}`);
    return response.data;
  },
};
