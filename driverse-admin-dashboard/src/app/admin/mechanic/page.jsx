"use client";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
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

const AdminMechanic = () => {
  const [mechanics, setMechanics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");




  
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/mech`,
        {
          params: {
            page: currentPage,
            search: searchTerm,
            startDate,
            endDate,
          },
        }
      );
      setMechanics(response.data.data);
      // console.log(response.data.data);
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
    // CSV Header
    const csvContent = [
      ["MechanicName", "ServiceType", "ServiceDescription", "StartTime", "EndTime", "Location", "Availability", "Radius", "Comment"],
      // Map the mechanics data to extract the required fields
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
      .map((row) => row.join(",")) // Join each row with commas
      .join("\n"); // Separate rows with newline characters
  
    // Create and trigger the download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mechanics.csv";
    link.click();
    URL.revokeObjectURL(url);
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
            Mechanic
          </h1>
          <div className="flex flex-row items-center justify-end sm:justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4">
            <div className="flex items-center border border-gray-800 rounded-xl p-2 w-[65%] sm:w-auto">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none border-none flex-grow sm:flex-grow-0 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-10 w-max bg-black text-white shadow-md flex justify-between items-center rounded-xl p-2 border-2 gap-x-2"
            >
              Search
            </button>
            <button
              onClick={handleDownload}
              className="h-10 w-max bg-black text-white shadow-md flex justify-between items-center rounded-xl p-2 border-2 gap-x-2"
            >
              <LuDownload size={24} />
              Download
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mechanics.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-md flex flex-col items-start"
            >
              <div className="flex items-center mb-4">
                <FiUser className="text-white text-4xl mr-4 bg-slate-900 p-2 rounded-full" />
                <h2 className="font-bold text-lg">{item?.mechanic?.username}</h2>
              </div>
              <div className="flex items-center mb-2">
                <TbCurrencyDollarCanadian className="text-gray-800 mr-2 h-7 w-7" />
                <span className="font-sm">{item.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <HiOutlineClock className="text-gray-800 h-7 w-7 mr-2" />
                <span>
                  {item.startTime} to {item.endTime}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminMechanic;
