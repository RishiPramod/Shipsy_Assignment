import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-base text-gray-500">Sorry, the page you are looking for does not exist.</p>
        </div>
        <div>
          <Link
            to="/"
            className="mt-6 inline-block py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
