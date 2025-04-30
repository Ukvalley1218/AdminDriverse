"use client"
import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1
  });

  const fetchKYCData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('fromDate', startDate);
      if (endDate) params.append('toDate', endDate);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await fetch(`/api/Agent/verifyed?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch KYC data');
      }
      
      const { data } = await response.json();
      
      if (!data) {
        throw new Error('No data received');
      }

      setKycData(data.data || []);
      setPagination(prev => ({
        ...prev,
        totalRecords: data.totalRecords || 0,
        totalPages: data.totalPages || 1
      }));
      
    } catch (err) {
      setError(err.message || 'Failed to load KYC data');
      console.error('Error fetching KYC data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCData();
  }, [pagination.page, searchQuery, startDate, endDate]);

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ['Username', 'Verified At', 'Verification Status'],
      ...kycData.map(item => [
        item.username || 'N/A',
        item.verifiedAt ? new Date(item.verifiedAt).toLocaleString() : 'N/A',
        item.isVerified ? 'Verified' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc-verification-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  if (loading && kycData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading verification data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Verification Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownload}
                disabled={kycData.length === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${kycData.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Filters Section */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Start Date"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="End Date"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Search by username..."
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-900">Username</th>
                  <th className="p-3 text-left font-semibold text-gray-900">Verified At</th>
                  <th className="p-3 text-left font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && kycData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : kycData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No verification records found
                    </td>
                  </tr>
                ) : (
                  kycData.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-900">{item.username || 'N/A'}</td>
                      <td className="p-3 text-gray-900">
                        {item.verifiedAt ? new Date(item.verifiedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {kycData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalRecords)} of{' '}
                {pagination.totalRecords} records
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded border ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-white text-gray-700 rounded border">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={`px-3 py-1 rounded border ${pagination.page >= pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;