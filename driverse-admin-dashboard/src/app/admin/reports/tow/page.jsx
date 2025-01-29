
"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
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
import { FiUser } from "react-icons/fi";
import { TbCurrencyDollarCanadian } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const AdminReportsTow = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const params = {
        serviceType: "Tower",
        search,
        startDate,
        endDate,
        page: currentPage,
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllPremiumByserviceType`,
        { params }
      );
      setData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, startDate, endDate, currentPage]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User Premium Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Price", "Payment id ", "Payment Date", "Expiry Date"]],
      body: data.map((item) => [item.username, item.subscriptionDetails.amountReceived, item.subscriptionDetails.paymentId, item.subscriptionDetails.paymentDate, item.subscriptionDetails.subscriptionEndDate]),
    });
    doc.save("user_premium_report.pdf");
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="container h-full ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center content-start justify-between mb-4">
          <h1 className="hidden sm:block text-xl sm:ml-7 lg:ml-0 sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0">
            User Premium
          </h1>
          <div className="flex flex-row items-center justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4">
            <div className="flex items-center ml-2 border border-gray-800 rounded-xl p-1 px-2 w-full sm:w-auto">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

            <button
              onClick={downloadPDF}
              className="h-10 w-max bg-black text-white shadow-md flex justify-between items-center rounded-xl p-2 border-2 gap-x-2"
            >
              <LuDownload size={24} />
              <h1>Download</h1>
            </button>
          </div>
        </div>

        {/* Range Selector Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
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
          <button className="flex items-center justify-center sm:justify-start gap-2 border border-gray-700 rounded-md py-2 px-4 w-full sm:w-auto">
            <BiSort size={20} />
            <span className="text-base font-semibold text-slate-600">Sort</span>
          </button>
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
                <TbCurrencyDollarCanadian className="text-gray-900 w-5 mr-2" />
                <span>{item.subscriptionDetails.amountReceived.toString()}</span>
              </div>
              <div className="flex items-center mb-4">
                <CiDiscount1 className="text-gray-900 h-5 mr-2" />
                <span>
                  {item.subscriptionDetails.paymentDate}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              Prev
            </button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-4 py-2 border border-gray-700 rounded-md bg-$
                {currentPage === page + 1 ? "black text-white" : "gray-200 text-gray-600"}`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              Next
            </button>
          </div>

          <div className="mt-4 sm:mt-0">
            <span className="text-gray-600">Showing {data.length} results</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReportsTow;
