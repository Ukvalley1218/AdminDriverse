"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaUser, FaClock, FaFilter } from "react-icons/fa";

const AdminTalkToFriend = () => {
  const [callDetails, setCallDetails] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [totalDurations, setTotalDurations] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  // console.log("userId",userId);
  const fetchCallDetails = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      let query = `/api/talk?page=${page}&limit=${limit}`;

      if (fromDate) query += `&fromDate=${fromDate}`;
      if (toDate) query += `&toDate=${toDate}`;
      if (status) query += `&status=${status}`;
      if (userId) query += `&userId=${userId}`;

      const response = await fetch(query);
      const data = await response.json();

      if (data.success) {
        setCallDetails(data.paginatedLogs);
        setStatusCounts(data.statusCounts);
        setTotalDurations(data.totalDuration);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          limit: data.pagination.limit,
        });
      } else {
        console.error("Failed to fetch call details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching call details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallDetails(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage]);

  const handleApplyFilters = () => {
    fetchCallDetails(1, pagination.limit);
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Talk to Friend</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Talk to Friend - Call Details</h1>

        {/* Filters */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              <option value="missed">Missed</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center"
          >
            <FaFilter className="mr-2" /> Apply Filters
          </button>
        </div>

        {/* Show Total Durations per Service Type */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Total Duration Per Service</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {totalDurations.map((service, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-md">
                <p className="text-sm font-medium">{service.serviceType}</p>
                <p className="text-gray-700">{service.formattedDuration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Show Status Counts */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Call Status Counts</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-100 p-3 rounded-lg shadow-md">
              <p className="text-sm font-medium text-red-600">Missed Calls</p>
              <p className="text-xl font-bold">{statusCounts.missed || 0}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg shadow-md">
              <p className="text-sm font-medium text-yellow-600">Rejected Calls</p>
              <p className="text-xl font-bold">{statusCounts.rejected || 0}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-600">Connected Calls</p>
              <p className="text-xl font-bold">{statusCounts.Connected || 0}</p>
            </div>
          </div>
        </div>

        {/* Call Logs */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr className="text-left text-gray-700">
                    <th className="p-3 border border-gray-300">Caller</th>
                    <th className="p-3 border border-gray-300">Receiver</th>
                    <th className="p-3 border border-gray-300">Status</th>
                    <th className="p-3 border border-gray-300">Duration</th>
             
                  </tr>
                </thead>
                <tbody>
                  {callDetails.length > 0 ? (
                    callDetails.map((call) => (
                      <tr key={call._id} className="border border-gray-200 hover:bg-gray-50 transition">
                        <td className="p-3 border border-gray-300">
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-medium">{call.callerName}</p>
                              <p className="text-sm text-gray-500">({call.callerServiceType})</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-medium">{call.receiverName}</p>
                              <p className="text-sm text-gray-500">({call.receiverServiceType})</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          
                          {call.status}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {call.formattedDuration}
                        </td>
                        {/* <td className="p-3 border border-gray-300 text-center">
                          <button
                            className="px-4 py-1 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                            onClick={() => setUserId(call._id)}
                          >
                            Get User ID
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No call details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            onClick={() => fetchCallDetails(pagination.currentPage - 1, pagination.limit)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <p>
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            onClick={() => fetchCallDetails(pagination.currentPage + 1, pagination.limit)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminTalkToFriend;
