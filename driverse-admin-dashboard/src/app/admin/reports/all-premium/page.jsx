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
import { BiSort } from "react-icons/bi";
import { GiLaurelCrown } from "react-icons/gi";
import { FiUser } from "react-icons/fi";
import { TbCurrencyDollarCanadian } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";
import jsPDF from "jspdf"; // For PDF download
import autoTable from "jspdf-autotable";

const AdminPremiumReports = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch data
  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        search,
        fromDate,
        toDate,
      }).toString();

      const response = await fetch(`http://localhost:8080/api/v1/auth/getAllPremiumByserviceType?serviceType?${queryParams}`);
      const result = await response.json();

      setData(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Trigger data fetch on dependency changes
  useEffect(() => {
    fetchData();
  }, [page, search, fromDate, toDate]);




  const handleDownload = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Username", "Email", "Phone", "Service Type", "price"]],
      body: data.map((user) => [
        user.username || "N/A",
        user.email || "N/A",
        user.subscriptionDetails.amountReceived || "N/A",
        user.serviceType || "N/A",
      ]),
    });
    doc.save("Premium.pdf");
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="container h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center content-start justify-between mb-4">
          {/* Dashboard Title */}
          <h1 className="hidden sm:block text-xl sm:ml-7 lg:ml-0 sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0">
            All Premium
          </h1>

          <div className="flex flex-row items-center justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4">
            {/* Search Input */}
            <div className="flex items-center ml-2 border border-gray-800 rounded-xl p-1 px-2 w-full sm:w-auto">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none border-none flex-grow sm:flex-grow-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Icons Section */}


            <button
              className="h-10 w-max bg-black text-white shadow-md flex justify-between items-center rounded-xl p-2 border-2 gap-x-2"
              onClick={handleDownload}
            >
              <LuDownload size={24} />
              <h1>Download</h1>
            </button>
          </div>
        </div>

        {/* Range Selector Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="date"
              className="border border-gray-700 rounded-md px-4 py-2"
              placeholder="Start Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="text-slate-600">to</span>
            <input
              type="date"
              className="border border-gray-700 rounded-md px-4 py-2"
              placeholder="End Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-md flex flex-col items-start"
            >
              <div className="flex items-center mb-4">
                <FiUser className="text-white text-4xl mr-4 bg-slate-900 p-2 rounded-full" />
                <h2 className="font-bold text-lg">{item.username}</h2>
              </div>
              <div className="flex items-center mb-2">
                <GiLaurelCrown className="text-gray-900 mr-2 h-5 w-5" />
                <span>{item.serviceType}</span>
              </div>
              <div className="flex items-center mb-4">
                <TbCurrencyDollarCanadian className="text-gray-900 h-5 w-5 mr-2" />
                <span>{item.subscriptionDetails.amountReceived} </span>
              </div>
              <div className="flex items-center mb-4">
                <CiDiscount1 className="text-gray-900 h-5 w-5 mr-2" />
                <span>
                  {item.subscriptionDetails.paymentDate}
                </span>


              </div>

            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`px-4 py-2 border ${page === num + 1 ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-600"
                } rounded-md`}
              onClick={() => setPage(num + 1)}
            >
              {num + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminPremiumReports;
