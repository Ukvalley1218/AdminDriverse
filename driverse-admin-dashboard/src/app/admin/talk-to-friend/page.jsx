
 "use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaUser } from "react-icons/fa";

const AdminTalkToFriend = () => {
  const [callDetails, setCallDetails] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchCallDetails = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserCallDetails?page=${page}&limit=${pagination.limit}`
      );
      const data = await response.json();

      if (data.success) {
        setCallDetails(data.data);
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
    fetchCallDetails(pagination.currentPage);
  }, []);

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchCallDetails(pagination.currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      fetchCallDetails(pagination.currentPage - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Talk to Friend - Call Details</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {callDetails.map((call, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center mb-3">
                  <FaUser className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">
                      Caller: {call.callerName} ({call.callerServiceType})
                    </p>
                    <p className="text-sm font-medium">
                      Receiver: {call.receiverName} ({call.receiverServiceType})
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhoneAlt className="text-green-500 mr-3" />
                  <p className="text-sm">Status: {call.status}</p>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Duration: {call.formattedDuration}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <p>
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            onClick={handleNextPage}
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
