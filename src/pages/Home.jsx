import { useState } from 'react';
import Header from '../components/Header';
import ShipmentList from '../components/ShipmentList';
import ShipmentForm from '../components/ShipmentForm';

const Home = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      <Header />
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Shipment Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your shipments with real-time cost calculations</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in-right"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Shipment
              </span>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          )}
        </div>
        <div className="transition-all duration-500 ease-in-out">
          {isCreating ? (
            <div className="animate-slide-in-up">
              <ShipmentForm onSave={() => setIsCreating(false)} onCancel={() => setIsCreating(false)} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <ShipmentList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
