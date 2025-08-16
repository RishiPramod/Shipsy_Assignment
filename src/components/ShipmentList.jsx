import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';
import ShipmentForm from './ShipmentForm';

const ITEMS_PER_PAGE = 5;

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingShipment, setEditingShipment] = useState(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('shipments').select('*', { count: 'exact' });

    if (filterStatus) {
      query = query.eq('status', filterStatus);
    }

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
    } else {
      setShipments(data);
      setTotalCount(count);
    }
    setLoading(false);
  }, [page, filterStatus, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Shipment deleted successfully!');
        fetchShipments();
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (editingShipment) {
    return <ShipmentForm shipment={editingShipment} onSave={() => { setEditingShipment(null); fetchShipments(); }} onCancel={() => setEditingShipment(null)} />
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in hover-lift">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-300 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
          >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED">Failed</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl skeleton"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 animate-stagger">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th onClick={() => handleSort('title')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th onClick={() => handleSort('status')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th onClick={() => handleSort('isFragile')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fragile</th>
                  <th onClick={() => handleSort('weightkg')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weight (kg)</th>
                  <th onClick={() => handleSort('shipping_cost')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shipping Cost</th>
                  <th onClick={() => handleSort('created_at')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {shipments.map((shipment, index) => (
                  <tr key={shipment.id} className="transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{shipment.title || 'Untitled'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        shipment.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {shipment.status?.replace('_', ' ') || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{shipment.isFragile ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{(shipment.weightkg || 0).toFixed(2)} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-semibold">${(shipment.shipping_cost || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(shipment.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingShipment(shipment)} 
                          className="group px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-300 hover:scale-105 border border-indigo-200 hover:border-indigo-600 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 dark:border-indigo-700 dark:hover:border-indigo-500"
                        >
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </span>
                        </button>
                        <button 
                          onClick={() => handleDelete(shipment.id)} 
                          className="group px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-300 hover:scale-105 border border-red-200 hover:border-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 dark:border-red-700 dark:hover:border-red-500"
                        >
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))} 
              disabled={page === 0} 
              className="group flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-indigo-900 dark:hover:border-indigo-700"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Page <span className="font-bold text-indigo-600 dark:text-indigo-400">{page + 1}</span> of <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.ceil(totalCount / ITEMS_PER_PAGE)}</span>
              </span>
              <div className="text-xs text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400 px-3 py-1 rounded-full">
                {totalCount} total shipments
              </div>
            </div>
            <button 
              onClick={() => setPage(p => (p + 1) * ITEMS_PER_PAGE < totalCount ? p + 1 : p)} 
              disabled={(page + 1) * ITEMS_PER_PAGE >= totalCount} 
              className="group flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-indigo-900 dark:hover:border-indigo-700"
            >
              Next
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentList;
