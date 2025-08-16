import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully!');
      navigate('/login');
    }
  };

  return (
    <header className="dark:bg-gray-900 text-gray-800 dark:text-white p-6 flex justify-between items-center shadow-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ShipSy</h1>
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
