"use client"
import React, { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with your actual data
  const [data] = useState([
    { id: 1, name: 'John Doe', status: 'Active', date: '2024-12-20',  },
    { id: 2, name: 'Jane Smith', status: 'Active', date: '2024-12-21', },
    { id: 3, name: 'Mike Johnson', status: 'Active', date: '2024-12-22',  },
    { id: 4, name: 'Sarah Williams', status: 'Active', date: '2024-12-23',  },
  ]);

  // Filter data based on date range and search query
  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);
    
    return matchesSearch && matchesDateRange;
  });

  const handleDownload = () => {
    // Implement your download logic here
    console.log('Downloading filtered data...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
                    placeholder="Search..."
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
                  <th className="p-3 text-left font-semibold text-gray-900 border-b">Name</th>
                  <th className="p-3 text-left font-semibold text-gray-900 border-b">Status</th>
                  <th className="p-3 text-left font-semibold text-gray-900 border-b">Date</th>
                  
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-900">{item.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        item.status === 'Active' ? 'bg-gray-900 text-white' :
                        item.status === 'Inactive' ? 'bg-gray-200 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-900">{item.date}</td>
                    
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