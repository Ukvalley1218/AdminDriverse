"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { FaBell, FaCrown, FaSearch, FaUsers, FaDownload } from "react-icons/fa";
import CountUp from "react-countup";
import Chart from "chart.js/auto";

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const myChart = useRef(null);

  const [userStats, setUserStats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [timeFrame, setTimeFrame] = useState("allTime");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const fetchStats = async (timeFrame, startDate, endDate) => {
    try {
      let url = `/api/getUserStatsAndRecentSubscriptions?timeFrame=${timeFrame}`;
      if (timeFrame === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const statsResponse = await fetch(url);
      const statsData = await statsResponse.json();

      if (statsData.success) {
        setUserStats(statsData.data);
        setTotalAmount(statsData.globalTotalAmountReceived);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchSubscriptions = async (page) => {
    try {
      const subscriptionsResponse = await fetch(
        `/api/fetchRecentSubscriptions?page=${page}&limit=5`
      );
      const subscriptionsData = await subscriptionsResponse.json();

      if (subscriptionsData.success) {
        setRecentSubscriptions(subscriptionsData.data);
        setTotalPages(subscriptionsData.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchStats(timeFrame, dateRange.startDate, dateRange.endDate);
    fetchSubscriptions(currentPage);
  }, [timeFrame, dateRange, currentPage]);

  // Initialize the chart
  useEffect(() => {
    if (!userStats.length) return;

    const ctx = chartRef.current.getContext("2d");

    if (myChart.current) {
      myChart.current.destroy();
    }

    const labels = userStats.map((stat) => stat.serviceType);
    const dataValues = userStats.map((stat) => stat.totalCount);

    myChart.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: ["yellow", "orange", "green", "skyblue", "red"],
            hoverBackgroundColor: ["#FFD700", "#FF8C00", "#32CD32", "#87CEEB", "#FF6347"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });
  }, [userStats]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTimeFrameChange = (e) => {
    const value = e.target.value;
    setTimeFrame(value);
    if (value !== "custom") {
      setDateRange({ startDate: "", endDate: "" });
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  const handleDownloadCSV = async () => {
    try {
      // Construct the URL with parameters
      const params = new URLSearchParams();
      params.append('timeFrame', timeFrame);
      params.append('download', 'true');

      if (timeFrame === "custom" && dateRange.startDate && dateRange.endDate) {
        params.append('startDate', dateRange.startDate);
        params.append('endDate', dateRange.endDate);
      }

      const url = `/api/getUserStatsAndRecentSubscriptions?${params.toString()}`;

      // Fetch the data
      const response = await fetch(url);
      console.log("Response:", response); // Debugging line

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      // Get the filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `subscription-stats-${timeFrame}-${new Date().toISOString().slice(0, 10)}.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Add user notification here if needed
      alert('Failed to download CSV. Please try again.');
    }
  };

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center content-start justify-between mb-4">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-x-4">
          <select
            value={timeFrame}
            onChange={handleTimeFrameChange}
            className="p-2 border rounded"
          >
            <option value="allTime">All Time</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {timeFrame === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="p-2 border rounded"
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="p-2 border rounded"
              />
            </div>
          )}

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-black/80 transition duration-200"
          >
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Count Section */}
      <div className="bg-slate-100 p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
            <div key={index} className="flex items-center p-4 rounded-2xl bg-white shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 rounded-full text-blue-500 bg-blue-100">
                <FaUsers size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-bold text-slate-700">{stat.serviceType}</h2>
                <p className="text-base text-slate-800 font-semibold">
                  <CountUp end={stat.totalCount} duration={1} />
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center p-4 rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-full text-purple-500 bg-purple-100">
              <FaCrown size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-bold text-slate-700">Total Revenue</h2>
              <p className="text-base text-slate-800 font-semibold">
                Rs. <CountUp end={totalAmount} duration={1} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Premiums and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Doughnut Chart Section */}
        <div className="shadow-lg p-4 rounded-lg">
          <h1 className="text-lg font-bold">Service Distribution</h1>
          <div className="h-64">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Recent Subscriptions Section */}
        <div className="shadow-lg p-4 rounded-lg">
          <h1 className="text-lg font-bold">Recent Subscriptions</h1>
          <div className="space-y-4">
            {recentSubscriptions.map((subscription, index) => (
              <div key={index} className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-slate-700 capitalize">UserName: {subscription.username}</h2>
                <p className="text-sm text-slate-500">Email: {subscription.email}</p>
                <p className="text-sm text-slate-500">Amount: {subscription.subscriptionDetails.amountReceived}</p>
                <p className="text-sm text-slate-500">
                  Date: {new Date(subscription.subscriptionDetails.paymentDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p>
                Page {currentPage} of {totalPages}
              </p>
              <button
                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;