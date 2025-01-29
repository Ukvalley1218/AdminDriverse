"use client"
import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  FaBell,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { BiSort } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { TbCurrencyDollarCanadian } from "react-icons/tb";
import { HiOutlineClock } from "react-icons/hi";
import axios from "axios";

const AdminTow = () => {
  const [towData, setTowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/Tower`,
        {
          params: {
            page: currentPage,
            search: searchTerm,
            startDate,
            endDate,
          },
        }
      );
      setTowData(response.data.data);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error("Error fetching tow data:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setCurrentPage(1);
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

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, startDate, endDate]);

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="container h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center content-start justify-between mb-4">
          <h1 className="hidden sm:block text-xl sm:ml-7 lg:ml-0 sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0">
            Tow
          </h1>

          <div className="flex flex-row items-center justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4">
            <div className="flex items-center ml-2 border border-gray-800 rounded-xl p-1 px-2 w-full sm:w-auto">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="ml-2 outline-none border-none flex-grow sm:flex-grow-0"
              />
            </div>
            
            <div className="flex items-center gap-x-2 ml-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800">
                <FaEnvelope className="text-gray-500" />
              </div>
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800">
                <FaBell className="text-gray-500" />
              </div>
            </div>

            <button className="h-10 w-max bg-black text-white shadow-md flex justify-between items-center rounded-xl p-2 border-2 gap-x-2">
              <LuDownload size={24} />
              <h1>Download</h1>
            </button>
          </div>
        </div>

        {/* Range Selector Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="w-full flex items-center justify-center gap-x-2 sm:w-auto">
            <h1 className="text-base font-semibold text-slate-600">Show</h1>
            {/* <select 
              className="appearance-none border border-gray-700 rounded-md px-4 w-full sm:w-auto"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select> */}
            <h1 className="text-base font-semibold text-slate-600">Entries</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="date"
                className="border border-gray-700 rounded-md px-4 py-2"
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
              <span className="text-slate-600">to</span>
              <input
                type="date"
                className="border border-gray-700 rounded-md px-4 py-2"
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>

          <button className="flex items-center justify-center sm:justify-start gap-2 border border-gray-700 rounded-md py-2 px-4 w-full sm:w-auto">
            <BiSort size={20} />
            <span className="text-base font-semibold text-slate-600">Sort</span>
          </button>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {towData.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-4 shadow-md flex flex-col items-start"
            >
              <div className="flex items-center mb-4">
                <FiUser className="text-white text-4xl mr-4 bg-slate-900 p-2 rounded-full" />
                <h2 className="font-bold text-lg">{item.Tower.email}</h2>
              </div>
              <div className="flex items-center mb-2">
                <TbCurrencyDollarCanadian className="text-gray-800 mr-2 h-7 w-7" />
                <span>{item.serviceType}</span>
              </div>
              <div className="flex items-center mb-4">
                <HiOutlineClock className="text-gray-800 h-7 w-7 mr-2" />
                <div className="flex items-center gap-x-2">
                  <span>{formatTime(item.startTime)}</span>
                  <span>to</span>
                  <span>{formatTime(item.endTime)}</span>
                </div>
              </div>
              {/* <div className="flex justify-evenly items-center w-full gap-2">
                <div>
                  <button className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-md p-2 hover:bg-gray-300">
                    <FaEdit />
                  </button>
                  <h1 className="text-sm text-slate-500 text-center">Edit</h1>
                </div>
                <div>
                  <button className="flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-md p-2 hover:bg-gray-300">
                    <FaEye />
                  </button>
                  <h1 className="text-sm text-slate-500 text-center">View</h1>
                </div>
                <div>
                  <button className="flex items-center justify-center bg-red-100 text-red-600 rounded-md p-2 hover:bg-gray-300">
                    <FaTrash />
                  </button>
                  <h1 className="text-sm text-slate-500 text-center">Delete</h1>
                </div>
              </div> */}
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 border border-gray-700 rounded-md ${
                  currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'
                } hover:bg-gray-300`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="mt-4 sm:mt-0">
            <span className="text-gray-600">
              Showing {((currentPage - 1) * entriesPerPage) + 1}-
              {Math.min(currentPage * entriesPerPage, towData.length)} of {towData.length} results
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTow;