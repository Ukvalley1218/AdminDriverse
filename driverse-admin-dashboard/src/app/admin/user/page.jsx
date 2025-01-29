

"use client";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaPhone,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import axios from "axios"; // For API calls
import jsPDF from "jspdf"; // For PDF download
import autoTable from "jspdf-autotable";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/user`,
        {
          params: {
            search: searchQuery,
            startDate,
            endDate,
            page,
          },
        }
      );
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Generate and download PDF
  const handleDownload = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Username", "Email", "Phone", "Service Type"]],
      body: users.map((user) => [
        user.username || "N/A",
        user.email || "N/A",
        user.phone || "N/A",
        user.serviceType || "N/A",
      ]),
    });
    doc.save("users.pdf");
  };

  // Fetch data whenever filters or page changes
  useEffect(() => {
    fetchData();
  }, [searchQuery, startDate, endDate, page]);

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0">
            Users
          </h1>
          <div className="flex items-center gap-x-4">
            <div className="flex items-center border border-gray-800 rounded-xl p-2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 outline-none border-none"
              />
            </div>
            <button
              className="h-10 bg-black text-white shadow-md flex items-center rounded-xl p-2 gap-x-2"
              onClick={handleDownload}
            >
              <LuDownload size={24} />
              <h1>Download</h1>
            </button>
          </div>
        </div>

        {/* Date Range Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 mb-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-700 rounded-md px-4 py-2"
            />
            <span className="text-slate-600">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-700 rounded-md px-4 py-2"
            />
          </div>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="border border-gray-200 rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center mb-4">
                <FiUser className="text-white text-4xl bg-slate-900 p-2 rounded-full" />
                <h2 className="font-bold text-lg ml-4">{user.username}</h2>
              </div>
              <div className="flex items-center mb-2">
                <FaPhone className="text-gray-500 mr-2" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="text-gray-500 mr-2 font-bold">Service Type:</span>
                <span>{user.serviceType}</span>
              </div>
              {/* <div className="flex justify-evenly gap-2">
                <button className="bg-blue-100 text-blue-500 p-2 rounded-md">
                  <FaEdit />
                </button>
                <button className="bg-yellow-100 text-yellow-600 p-2 rounded-md">
                  <FaEye />
                </button>
                <button className="bg-red-100 text-red-600 p-2 rounded-md">
                  <FaTrash />
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 border border-gray-700 rounded-md"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span>{page}</span>
            <button
              className="px-4 py-2 border border-gray-700 rounded-md"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
        </div>
      </div>
    </>
  );
};

export default AdminUser;
