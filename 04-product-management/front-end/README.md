# Product Management Frontend

A modern, responsive web application for managing products with image upload capabilities. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Product Creation**: Add new products with name, description, price, and image upload
- **Product Listing**: View all products in a clean, card-based layout
- **Product Deletion**: Remove products with confirmation dialogs
- **Image Upload**: Drag and drop or click to upload product images
- **Real-time Updates**: Automatic UI updates when products are created or deleted
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Form Validation**: Client-side validation using Zod schemas
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Backend API URL** from your AWS deployment

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd front-end
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Backend API URL

**Important**: You need to provide your AWS backend API URL to connect the frontend to your backend services.

1. Open `lib/api.ts`
2. Replace the existing API_BASE_URL with your AWS API Gateway URL:

```typescript
const API_BASE_URL = 'https://your-api-gateway-url.amazonaws.com';
```

The API URL should be in the format: `https://[api-id].execute-api.[region].amazonaws.com`

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 5. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
front-end/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page component
│   └── providers.tsx      # React Query provider
├── components/            # Reusable UI components
│   ├── product-form.tsx   # Product creation form
│   ├── product-list.tsx   # Product listing component
│   ├── image-upload.tsx   # Image upload component
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and API
│   ├── api.ts            # API client and types
│   ├── hooks.ts          # Custom React Query hooks
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## API Integration

The frontend communicates with your AWS backend through the following endpoints:

- `GET /products` - Fetch all products
- `POST /products` - Create a new product
- `DELETE /products/{id}` - Delete a product

### Required Backend Features

Your AWS backend should provide:

1. **Product CRUD operations** with the endpoints listed above
2. **Image storage** (typically S3) for product images
3. **CORS configuration** to allow frontend requests
4. **Proper error handling** with meaningful error messages

## Environment Configuration

If you need to use environment variables for the API URL, you can:

1. Create a `.env.local` file in the root directory
2. Add your API URL:

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com
```

3. Update `lib/api.ts` to use the environment variable:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-gateway-url.amazonaws.com';
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure your backend API URL is correct and the backend is deployed and accessible
2. **CORS Errors**: Verify your backend has proper CORS configuration
3. **Image Upload Issues**: Check that your backend can handle image uploads and S3 integration is working

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your backend API is running and accessible
3. Ensure all environment variables are properly configured
4. Check that your AWS services (API Gateway, Lambda, S3) are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the AWS CDK Course and is for educational purposes.
