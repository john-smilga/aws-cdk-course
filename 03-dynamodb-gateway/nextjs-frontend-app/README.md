# User Management CRUD Application

A modern, full-stack user management app built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Query, and AWS (API Gateway + Lambda + DynamoDB). This app demonstrates best practices for scalable, maintainable, and beautiful CRUD applications.

---

## Features

- **Create Users:** Add new users with name and email.
- **Read Users:** Display all users in a responsive, sortable table.
- **Update Users:** Edit user information via a modal dialog.
- **Delete Users:** Remove users with confirmation via a modal dialog.
- **Random User Generation:** Instantly fill the form with realistic data using Faker.js.
- **Modern UI:** Built with shadcn/ui and Tailwind CSS for a beautiful, accessible interface.
- **Responsive Design:** Works perfectly on desktop and mobile.
- **Real-time Updates:** User list auto-refreshes after any change.
- **Type Safety:** End-to-end TypeScript for robust development.
- **API Integration:** Connects to a real AWS backend (API Gateway + Lambda + DynamoDB).
- **State Management:** Powered by React Query for caching, loading, and error handling.

---

## Technologies Used

### **Frontend**

- **Next.js 15 (App Router):**  
  The React framework for server-side rendering, routing, and full-stack capabilities.
- **TypeScript:**  
  Provides static typing for safer, more maintainable code.
- **Tailwind CSS:**  
  Utility-first CSS for rapid, consistent, and responsive UI development.
- **shadcn/ui:**  
  Headless, accessible, and customizable React UI components (modals, buttons, cards, etc.).
- **@tanstack/react-query (React Query):**  
  Handles all data fetching, caching, background updates, and error/loading states for API calls.
- **Axios:**  
  Promise-based HTTP client for making API requests.
- **Faker.js:**  
  Generates realistic random user data for testing and demo purposes.
- **Lucide React:**  
  Icon library for modern, consistent icons in buttons and actions.

### **Backend (AWS)**

- **API Gateway:**  
  Exposes RESTful endpoints (`/users`, `/users/:id`) to the frontend.
- **AWS Lambda:**  
  Serverless functions for each CRUD operation (GET, POST, PUT, DELETE).
- **DynamoDB:**  
  NoSQL database for storing user records.

---

## Project Structure

```
front-end/
├── app/
│   ├── layout.tsx                # App-wide layout and providers
│   └── page.tsx                  # Main application page
├── components/
│   ├── ui/                       # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── UserCRUD.tsx              # Main CRUD wrapper with context
│   ├── UserForm.tsx              # Form for creating users
│   ├── UserList.tsx              # Table for displaying users, edit/delete actions
│   ├── EditUserModal.tsx         # Modal dialog for editing users
│   └── ReactQueryProvider.tsx    # Client-side provider for React Query
├── hooks/
│   └── useUsers.ts               # Custom hook using React Query for all user operations
├── lib/
│   ├── api.ts                    # API service (axios) for all backend calls
│   └── types.ts                  # TypeScript interfaces for User, API responses, etc.
├── public/                       # Static assets (icons, images)
├── package.json                  # Project dependencies and scripts
└── README.md                     # This file
```

---

## How the Logic Works

### **Data Flow**

1. **Fetching Users:**

   - `useUsers` hook uses React Query's `useQuery` to fetch all users from `/users`.
   - Data is cached and automatically refreshed after mutations.

2. **Creating Users:**

   - `UserForm` uses `useUsers().createUser` (React Query mutation).
   - On success, the user list is invalidated and refetched.

3. **Editing Users:**

   - Clicking "Edit" opens `EditUserModal`, which fetches the latest user data from `/users/:id`.
   - On submit, `useUsers().updateUser` is called, and the list is refreshed.

4. **Deleting Users:**

   - Clicking "Delete" opens a confirmation modal.
   - On confirm, `useUsers().deleteUser` is called, and the list is refreshed.

5. **Random User Generation:**
   - The form uses Faker.js to generate a random name and email for quick testing.

### **State Management**

- **React Query** handles all loading, error, and data states for API calls.
- No manual state management for loading/errors in components—just use the status from React Query.

### **UI/UX**

- **shadcn/ui** provides accessible, customizable UI primitives (Dialog, Button, Card, etc.).
- **Tailwind CSS** ensures a modern, responsive layout.
- **Modals** are used for both editing and confirming deletion, providing a smooth user experience.

### **Backend Integration**

- All API calls are made to AWS API Gateway endpoints.
- Lambda functions handle CRUD logic and interact with DynamoDB.
- The backend returns plain user objects for single-user fetches, and arrays for lists.

---

## API Endpoints

- `GET /users` — Fetch all users
- `POST /users` — Create a new user
- `GET /users/{id}` — Get a user by ID
- `PUT /users/{id}` — Update a user by ID
- `DELETE /users/{id}` — Delete a user by ID

**Base URL:**  
`https://your-url-here.eu-north-1.amazonaws.com`

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Provide your API_URL in `lib/app.ts`
   - optional : remove faker from `createUser`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Usage

### Creating a User

- Fill out the form or click "Generate Random User"
- Click "Create User"
- The user list updates automatically

### Editing a User

- Click the pencil icon next to a user
- Edit the name/email in the modal
- Click "Save Changes"

### Deleting a User

- Click the trash icon next to a user
- Confirm deletion in the modal

### Viewing Users

- All users are shown in a table, sorted by newest first
- Click "Refresh" to manually reload the list

### Exporting Users

- Click "Export CSV" to download the user list as a CSV file
- Click "Export JSON" to download the user list as a JSON file

---

## Development & Extensibility

- **Add new features** by extending the API, hooks, and UI components.
- **TypeScript** ensures all changes are type-safe.
- **React Query** makes it easy to add optimistic updates, pagination, or infinite loading.
- **shadcn/ui** allows you to easily add more dialogs, toasts, or custom UI.

---
