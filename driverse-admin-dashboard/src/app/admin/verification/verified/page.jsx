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

  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        const response = await fetch(`/api/verifyed`);
        if (!response.ok) {
          throw new Error('Failed to fetch KYC data');
        }
        const data = await response.json();
        setKycData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load KYC data. Please try again later.');
        console.error('Error fetching KYC data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKYCData();
  }, []);

  // Filter data based on date range and search query
  const filteredData = kycData.filter(item => {
    const matchesSearch = 
      (item.username?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    
    const itemDate = new Date(item.verifiedAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);
    
    return matchesSearch && matchesDateRange;
  });

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ['Username', 'Verified At', 'Verification Status'],
      ...filteredData.map(item => [
        item.username,
        new Date(item.verifiedAt).toLocaleString(),
        item.isVerified ? 'Verified' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kyc-verification-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading verification data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Verification Dashboard</h1>
            <div className="flex gap-2">
              <span className="bg-black w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filters Section */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
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
              </div>
              <div className="flex-1 min-w-[200px]">
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
              </div>
              <div className="flex-1 min-w-[200px]">
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
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Data
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-semibold text-gray-900 border-b">Username</th>
                  <th className="p-3 text-left font-semibold text-gray-900 border-b">Verified At</th>
                  <th className="p-3 text-left font-semibold text-gray-900 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-900">{item.username}</td>
                    <td className="p-3 text-gray-900">
                      {new Date(item.verifiedAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        item.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;