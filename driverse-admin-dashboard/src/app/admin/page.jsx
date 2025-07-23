"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { FaDownload, FaUsers } from "react-icons/fa";
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
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

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
        setTotalAmount(statsData.globalTotal?.totalAmount || 0);
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


      console.log("subscriptionsData", subscriptionsData);
      if (subscriptionsData.success) {
        setRecentSubscriptions(subscriptionsData.data);
        setTotalPages(subscriptionsData.pagination?.totalPages || 1);
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
    const userCounts = userStats.map((stat) => stat.userCount);
    const transactionAmounts = userStats.map((stat) => stat.transactionStats.totalAmountReceived);

    myChart.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "User Count",
            data: userCounts,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
          {
            label: "Transaction Amount ($)",
            data: transactionAmounts,
            backgroundColor: "rgba(16, 185, 129, 0.5)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Values" },
          },
          x: {
            title: { display: true, text: "Service Type" },
          },
        },
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const value = context.raw;
                return `${label}: ${label.includes("Amount") ? formatCurrency(value) : value}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (myChart.current) {
        myChart.current.destroy();
      }
    };
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
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadCSV = async () => {
    try {
      const params = new URLSearchParams();
      params.append("timeFrame", timeFrame);
      params.append("download", "true");

      if (timeFrame === "custom" && dateRange.startDate && dateRange.endDate) {
        params.append("startDate", dateRange.startDate);
        params.append("endDate", dateRange.endDate);
      }

      const url = `/api/getUserStatsAndRecentSubscriptions?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `subscription-stats-${timeFrame}-${new Date().toISOString().slice(0, 10)}.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch  [1];
        }
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV. Please try again.");
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCurrency1 = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0">
          <select
            value={timeFrame}
            onChange={handleTimeFrameChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {userStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 capitalize">{stat.serviceType}</h3>
              <p className="text-lg font-semibold text-gray-800">
                <CountUp end={stat.userCount} duration={1} /> Users
              </p>
              <p className="text-sm text-gray-500">
                Transactions: {formatCurrency(stat.transactionStats.totalAmountReceived)}
              </p>
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <FaUsers className="text-green-600" size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-lg font-semibold text-gray-800">
              <CountUp end={totalAmount} duration={1} decimals={2} prefix="$" />
            </p>
          </div>
        </div>
      </div>

      {/* Chart and Subscriptions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Service Distribution</h2>
          <div className="h-80">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Recent Subscriptions Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentSubscriptions.map((subscription, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      {subscription.username || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-500">Status: {subscription.subscriptionDetails.status}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {subscription.serviceType || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency1(subscription.subscriptionDetails.amount || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {subscription.subscriptionDetails.paymentDate
                        ? new Date(subscription.subscriptionDetails.paymentDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 rounded-md ${currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <button
                className={`px-4 py-2 rounded-md ${currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
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