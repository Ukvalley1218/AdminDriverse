"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { 
  FaSearch, 
  FaDownload, 
  FaUser, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChevronLeft, 
  FaChevronRight 
} from "react-icons/fa";

const AdminMechanicList = () => {
  const [mechanics, setMechanics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/mech`, {
        params: {
          page: currentPage,
          search: searchTerm,
          startDate,
          endDate,
        },
      });
      setMechanics(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching mechanics data:", error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleDownload = () => {
    const csvContent = [
      ["MechanicName", "ServiceType", "ServiceDescription", "StartTime", "EndTime", "Location", "Availability", "Radius", "Comment"],
      ...mechanics.map(({ 
        mechanic, 
        serviceType, 
        serviceDescription, 
        startTime, 
        endTime, 
        location, 
        availability, 
        radius, 
        comment 
      }) => [
        mechanic?.username || "N/A",
        serviceType || "N/A",
        serviceDescription || "N/A",
        startTime || "N/A",
        endTime || "N/A",
        location || "N/A",
        availability || "N/A",
        radius || "N/A",
        comment || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mechanics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedMechanics = [...mechanics].sort((a, b) => {
      if (key === 'mechanic') {
        const valA = a.mechanic?.username || '';
        const valB = b.mechanic?.username || '';
        return direction === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      if (key === 'startTime' || key === 'endTime') {
        const valA = new Date(a[key] || 0);
        const valB = new Date(b[key] || 0);
        return direction === 'asc' 
          ? valA - valB 
          : valB - valA;
      }
      return 0;
    });

    setMechanics(sortedMechanics);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, startDate, endDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Mechanic Management</title>
      </Head>

      {/* Header and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Mechanic Service
        </h1>
        
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search mechanics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            onClick={handleSearch} 
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
          
          <button 
            onClick={handleDownload} 
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload className="mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Mechanics List */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('mechanic')}
              >
                <div className="flex items-center">
                  Mechanic Name
                  {sortConfig.key === 'mechanic' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('serviceType')}
              >
                Service Type
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('startTime')}
              >
                <div className="flex items-center">
                  Start Time
                  {sortConfig.key === 'startTime' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('endTime')}
              >
                <div className="flex items-center">
                  End Time
                  {sortConfig.key === 'endTime' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {mechanics.map((item, index) => (
              <tr 
                key={index} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 flex items-center">
                  <FaUser className="mr-3 text-blue-600" />
                  {item.mechanic?.username || 'N/A'}
                </td>
                <td className="px-4 py-3">{item.serviceType || 'N/A'}</td>
                <td className="px-4 py-3">{item.startTime || 'N/A'}</td>
                <td className="px-4 py-3">{item.endTime || 'N/A'}</td>
                <td className="px-4 py-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  {item.location || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                currentPage === index + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="text-gray-600">
          Showing {(currentPage - 1) * 10 + 1}-
          {Math.min(currentPage * 10, mechanics.length)} of {mechanics.length} results
        </div>
      </div>
    </div>
  );
};

export default AdminMechanicList;