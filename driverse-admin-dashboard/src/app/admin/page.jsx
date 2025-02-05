// export default AdminDashboard;
"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { FaBell, FaCrown, FaSearch, FaUsers } from "react-icons/fa";
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


  // console.log("env Log", `${process.env.NEXT_PUBLIC_API_BASE_URL}`)
  // Fetch stats and recent subscriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch(
          `/api/getUserStatsAndRecentSubscriptions`
        );
        const statsData = await statsResponse.json();
        console.log("statsData",statsData);

        if (statsData.success) {
          setUserStats(statsData.data);
          setTotalAmount(statsData.globalTotalAmountReceived);
        }

        const subscriptionsResponse = await fetch(
          `/api/fetchRecentSubscriptions`,
          { params: { page: currentPage, limit: 5 } }

        );
        const subscriptionsData = await subscriptionsResponse.json();

        if (subscriptionsData.success) {
          setRecentSubscriptions(subscriptionsData.data);
          console.log("subscriptionsData.data",subscriptionsData.data);
          setTotalPages(subscriptionsData.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

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

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center content-start justify-between mb-4">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-x-4">
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
                <h2 className=" text-slate-700">UserName {subscription.username}</h2>
                <p className="text-sm text-slate-500">Email {subscription.email}</p>
                <p className="text-sm text-slate-500">Amount {subscription.subscriptionDetails.amountReceived}</p>
                <p className="text-sm text-slate-500">Date {new Date(subscription.subscriptionDetails.paymentDate).toLocaleDateString()}</p>

              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
