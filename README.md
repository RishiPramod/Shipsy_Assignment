# AI Campus Assignment: Shipment Management App

This project is a full-stack web application built for the AI Campus Placement at Shipsy. It provides a comprehensive solution for managing shipments, featuring a modern user interface and a robust backend. The application is built with React and Supabase, and it includes authentication, CRUD operations, pagination, filtering, sorting, and search functionalities.

## Features

- **User Authentication**: Secure sign-up and sign-in functionality using Supabase Auth.
- **CRUD Operations**: Create, read, update, and delete shipments with a user-friendly interface.
- **Pagination**: Efficiently navigate through a large number of shipments with paginated results.
- **Filtering**: Filter shipments by their status (e.g., Pending, In Transit, Delivered).
- **Sorting**: Sort the shipment list by various columns, such as tracking number, status, and shipping cost.
- **Search**: Quickly find specific shipments by their tracking number.
- **Protected Routes**: Secure the main dashboard to ensure only authenticated users can access it.
- **Responsive Design**: The application is fully responsive and works seamlessly on all screen sizes.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth)
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast

## Architecture

The application follows a modular architecture to ensure clean code and separation of concerns:

- **`src/components`**: Reusable UI components, such as `Header`, `ShipmentForm`, and `ShipmentList`.
- **`src/contexts`**: React contexts for managing global state, such as `AuthContext`.
- **`src/hooks`**: Custom hooks for accessing shared logic, such as `useAuth`.
- **`src/pages`**: Top-level page components, like `Home`, `Login`, and `SignUp`.
- **`src/routes`**: Application routing configuration.
- **`src/utils`**: Utility functions, including the Supabase client setup.

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd shipsy
   ```

2. **Set up Supabase**:
   - Create a new project on [Supabase](https://supabase.com/).
   - In the SQL Editor, run the schema script from the `database.sql` file to create the `shipments` table and policies.
   - Go to **Project Settings > API** and get your **Project URL** and **anon key**.

3. **Configure environment variables**:
   - In the `frontend` directory, create a `.env.local` file.
   - Add your Supabase credentials to the file:
     ```
     VITE_SUPABASE_URL=YOUR_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
     ```

4. **Install dependencies and run the app**:
   ```bash
   npm install
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

## Deployment

The application can be easily deployed to any platform that supports modern JavaScript applications, such as Vercel or Netlify. When deploying, make sure to set the environment variables for the Supabase URL and anon key in the deployment settings.
>>>>>>> 33b31b197e49ee5cdaaaad0d215346bd7b4c2b69
