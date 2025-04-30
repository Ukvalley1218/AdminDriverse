"use client"
import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import {
  FaSearch,
  FaDownload,
  FaUser,
  FaTruck,
  FaClock,
  FaCalendarAlt
} from "react-icons/fa";

const AdminTowList = () => {
  const [towData, setTowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/Tower`, {
        params: {
          page: currentPage,
          search: searchTerm,
          startDate,
          endDate,
        },
      });
      setTowData(response.data.data);

      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error("Error fetching tow data:", error);
    }
  };

  const handleDownload = () => {
    const csvContent = [
      ["Email", "Service Type", "Start Time", "End Time"],
      ...towData.map((item) => [
        item.Tower?.email || "N/A",
        item.serviceType || "N/A",
        formatTime(item.startTime) || "N/A",
        formatTime(item.endTime) || "N/A"
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tow_services.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (timeString.includes('GMT')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    return timeString;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedTowData = [...towData].sort((a, b) => {
      if (key === 'email') {
        const valA = a.Tower?.email || '';
        const valB = b.Tower?.email || '';
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
      if (key === 'serviceType') {
        const valA = a.serviceType || '';
        const valB = b.serviceType || '';
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return 0;
    });

    setTowData(sortedTowData);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, startDate, endDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Tow Services Management</title>
      </Head>

      {/* Header and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Tow Services
        </h1>

        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search tow services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

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
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-600" />
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-600" />
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tow Services List */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">

        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 border border-gray-300"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email
                
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 border border-gray-300"
                onClick={() => handleSort("serviceType")}
              >
                <div className="flex items-center">
                  Service Type
                  
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 border border-gray-300"
                onClick={() => handleSort("startTime")}
              >
                <div className="flex items-center">
                  Start Time
                 
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 border border-gray-300"
                onClick={() => handleSort("endTime")}
              >
                <div className="flex items-center">
                  End Time
                 
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {towData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 flex items-center border border-gray-300">
                  <FaUser className="mr-3 text-blue-600" />
                  {item.Tower?.email || "N/A"}
                </td>
                <td className="px-4 py-3 border border-gray-300">{item.serviceType || "N/A"}</td>
                <td className="px-4 py-3 border border-gray-300">
                  <FaClock className="mr-2 inline text-blue-600" />
                  {formatTime(item.startTime) || "N/A"}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <FaClock className="mr-2 inline text-blue-600" />
                  {formatTime(item.endTime) || "N/A"}
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
              className={`px-4 py-2 border rounded-lg transition-colors ${currentPage === index + 1
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
          {Math.min(currentPage * 10, towData.length)} of {towData.length} results
        </div>
      </div>
    </div>
  );
};

export default AdminTowList;