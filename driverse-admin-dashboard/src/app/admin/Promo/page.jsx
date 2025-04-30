'use client';
import { useState, useEffect } from 'react';
import { NextResponse } from 'next/server';

export default function PromoCodeManager() {
  // State management
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    validate: '',
    status: 'Active'
  });
  const [editId, setEditId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all promo codes
  const fetchPromoCodes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/Promo');
      const data = await response.json();
      if (data.success) {
        setPromoCodes(data.data);
      } else {
        setError(data.message || 'Failed to fetch promo codes');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate a random promo code
  const generateRandomCode = () => {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => 
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let response;
      const payload = {
        validate: formData.validate,
        status: formData.status
      };

      if (editId) {
        // Update existing promo code
        response = await fetch(`/api/Promo/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new promo code
        const promoCode = generateRandomCode();
        response = await fetch('/api/Promo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            PromoCode: promoCode
          })
        });
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchPromoCodes();
        resetForm();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      validate: '',
      status: 'Active'
    });
    setEditId(null);
    setIsCreating(false);
  };

  // Set form for editing
  const handleEdit = (promoCode) => {
    setFormData({
      validate: promoCode.validate,
      status: promoCode.status
    });
    setEditId(promoCode._id);
    setIsCreating(true);
  };

  // Delete a promo code
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      try {
        const response = await fetch(`/api/Promo/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          await fetchPromoCodes();
        } else {
          setError(data.message || 'Delete failed');
        }
      } catch (err) {
        setError('Network error during deletion');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Promo Code Management</h1>

      {/* Create/Edit Form */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editId ? 'Edit Promo Code' : 'Create New Promo Code'}
          </h2>
          {isCreating && (
            <button 
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validation Rule
              </label>
              <input
                type="text"
                name="validate"
                value={formData.validate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="InActive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editId ? 'Update Promo Code' : 'Generate Promo Code'}
            </button>
          </div>
        </form>
      </div>

      {/* Promo Codes List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <h2 className="text-xl font-semibold">Existing Promo Codes</h2>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create New
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading promo codes...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : promoCodes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No promo codes found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((code) => (
                <tr key={code._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{code.PromoCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.validate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${code.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleEdit(code)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(code._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}