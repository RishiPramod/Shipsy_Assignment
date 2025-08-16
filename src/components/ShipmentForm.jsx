import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ShipmentForm = ({ shipment, onSave, onCancel }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [isFragile, setIsFragile] = useState(false);
  const [weight, setWeight] = useState(0);
  const [distance, setDistance] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    if (shipment) {
      setTitle(shipment.title || '');
      setStatus(shipment.status);
      setIsFragile(shipment.isFragile || false);
      setWeight(shipment.weightkg || 0);
      setDistance(shipment.distancekm || 0);
      setShippingCost(shipment.shipping_cost || 0);
    }
  }, [shipment]);

  // Calculate shipping cost whenever weight or distance changes
  useEffect(() => {
    // Formula: Base rate ($2/kg) + Distance rate ($0.5/km) + Fragile surcharge (20%)
    const baseRate = weight * 2;
    const distanceRate = distance * 0.5;
    const subtotal = baseRate + distanceRate;
    const fragileMultiplier = isFragile ? 1.2 : 1;
    const calculatedCost = subtotal * fragileMultiplier;
    setShippingCost(Math.round(calculatedCost * 100) / 100); // Round to 2 decimals
  }, [weight, distance, isFragile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shipmentData = {
      title,
      status,
      isFragile,
      weightkg: weight,
      distancekm: distance,
      shipping_cost: shippingCost,
    };

    let error;
    if (shipment) {
      // Update
      const { error: updateError } = await supabase.from('shipments').update(shipmentData).eq('id', shipment.id);
      error = updateError;
    } else {
      // Create
      const { error: insertError } = await supabase.from('shipments').insert([shipmentData]);
      error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Shipment ${shipment ? 'updated' : 'created'} successfully!`);
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {shipment ? 'Edit Shipment' : 'Create New Shipment'}
        </h2>
      </div>
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-indigo-400 transition-colors duration-200">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
          placeholder="Enter shipment title..."
        />
      </div>
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-indigo-400 transition-colors duration-200">Status</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="PENDING"> Pending</option>
          <option value="IN_TRANSIT"> In Transit</option>
          <option value="DELIVERED"> Delivered</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Package Type</label>
        <div className="flex items-center p-4 border border-gray-300 rounded-xl hover:border-indigo-300 transition-all duration-300 bg-gray-50 hover:bg-indigo-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
          <input 
            type="checkbox" 
            checked={isFragile} 
            onChange={(e) => setIsFragile(e.target.checked)} 
            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-all duration-200 dark:bg-gray-600 dark:border-gray-500" 
          />
          <label className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            <span className="text-lg"></span>
            Fragile Item (+20% shipping cost)
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-indigo-400 transition-colors duration-200">Weight (kg)</label>
          <div className="relative">
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(parseFloat(e.target.value))} 
              required 
              className="block w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="0.0"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-lg"></span>
            </div>
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-indigo-400 transition-colors duration-200">Distance (km)</label>
          <div className="relative">
            <input 
              type="number" 
              value={distance} 
              onChange={(e) => setDistance(parseFloat(e.target.value))} 
              required 
              className="block w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="0.0"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-lg"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:bg-gray-700/50 dark:border-indigo-800 p-6 rounded-xl border border-indigo-200 dark:border-gray-600">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-900 mb-3"> Shipping Cost (Auto-Calculated)</label>
        <div className="text-3xl font-bold text-indigo-600 dark:text-black mb-2 animate-pulse">
          ${shippingCost.toFixed(2)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
          <div className="font-medium mb-1">Calculation Breakdown:</div>
          <div>• Base: ${(weight * 2).toFixed(2)} (${weight}kg × $2/kg)</div>
          <div>• Distance: ${(distance * 0.5).toFixed(2)} (${distance}km × $0.5/km)</div>
          {isFragile && <div>• Fragile surcharge: +20%</div>}
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button" 
          onClick={onCancel} 
          className="group py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 hover:scale-105 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </span>
        </button>
        <button 
          type="submit" 
          className="group py-3 px-8 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {shipment ? 'Update Shipment' : 'Create Shipment'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ShipmentForm;
