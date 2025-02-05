"use client";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaCalendar,
  FaDownload,
  FaChartBar,
  FaCheckCircle,
  FaEye,
  FaTimes,
  FaDollarSign,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import { GiLaurelCrown } from "react-icons/gi";
import { TbCurrencyDollarCanadian } from "react-icons/tb";
import { BsGraphUp } from "react-icons/bs";

// User Details Modal Component
const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Profile */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaUser className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.username}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <GiLaurelCrown className="text-yellow-500" />
              Service Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Service Type</p>
                <p className="font-medium">{user.serviceType}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.subscriptionStatus === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {user.subscriptionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaDollarSign className="text-green-500" />
              Payment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Payment ID</p>
                <p className="font-medium font-mono text-sm">{user.subscriptionDetails?.paymentId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium">
                  {user.subscriptionDetails?.amountReceived
                    ? `${(user.subscriptionDetails.amountReceived / 100).toFixed(2)} ${user.subscriptionDetails.currency?.toUpperCase() || 'USD'}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaClock className="text-purple-500" />
              Subscription Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Start Date</p>
                <p className="font-medium">
                  {user.subscriptionDetails?.paymentDate
                    ? new Date(user.subscriptionDetails.paymentDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">End Date</p>
                <p className="font-medium">
                  {user.subscriptionDetails?.subscriptionEndDate
                    ? new Date(user.subscriptionDetails.subscriptionEndDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <Icon className={`${color} text-xl`} />
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Main Dashboard Component
const AdminPremiumReports = () => {
  const [data, setData] = useState({
    data: [],
    pagination: { total: 0, page: 1, limit: 10, pages: 0 },
    statistics: {
      serviceTypeDistribution: [],
      subscriptionStatusByType: {},
      monthlyGrowth: {},
      revenue: {},
      userMetrics: {}
    }
  });

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    fromDate: "",
    toDate: "",
    serviceTypes:"Mechanic" 
    });

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page,
        search: filters.search,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        serviceType: filters.serviceTypes.join(',')
      }).toString();

      const response = await fetch(`/api/getAllPrem?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleServiceTypeChange = (type) => {
    setFilters(prev => {
      const types = prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type];
      return { ...prev, serviceTypes: types, page: 1 };
    });
  };

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        serviceType: filters.serviceTypes.join(','),
        download: true
      }).toString();

      window.location.href = `/api/getAllPrem?${queryParams}`;
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };

  // Calculate total metrics
  const totalMetrics = Object.values(data.statistics.userMetrics || {}).reduce(
    (acc, metrics) => ({
      total: acc.total + (metrics.total || 0),
      active: acc.active + (metrics.active || 0)
    }),
    { total: 0, active: 0 }
  );

  // Calculate total revenue
  const totalRevenue = Object.values(data.statistics.revenue || {}).reduce(
    (acc, rev) => {
      const revenues = Object.values(rev.byCurrency || {});
      return acc + revenues.reduce((sum, curr) => sum + (curr.total || 0), 0);
    },
    0
  );

  // Service types array
  const serviceTypes = ['Driver', 'Tower', 'Mechanic', 'Company'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold mb-4 lg:mb-0">Premium Users Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-grow lg:flex-grow-0">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            />
          </div>
          {/* <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaDownload />
            Download CSV
          </button> */}
        </div>
      </div>

      {/* Service Type Filter Chips */}
      {/* <div className="flex flex-wrap gap-2 mb-6">
        {serviceTypes.map(type => (
          <button
            key={type}
            onClick={() => handleServiceTypeChange(type)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${filters.serviceTypes.includes(type)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {type}
            {filters.serviceTypes.includes(type) && <FaCheckCircle size={16} />}
          </button>
        ))}
      </div> */}

      {/* Date Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filters.fromDate}
            onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value, page: 1 }))}
          />
        </div>
        <div className="flex-1">
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filters.toDate}
            onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value, page: 1 }))}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Premium Users"
          value={totalMetrics.total}
          icon={FaUser}
          color="text-blue-500"
        />
        <StatCard
          title="Active Subscriptions"
          value={totalMetrics.active}
          icon={GiLaurelCrown}
          color="text-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(totalRevenue / 100).toFixed(2)}`}
          icon={TbCurrencyDollarCanadian}
          color="text-yellow-500"
        />
        <StatCard
          title="Service Types"
          value={data.statistics?.serviceTypeDistribution?.length || 0}
          icon={BsGraphUp}
          color="text-purple-500"
        />

      </div>
      {/* Service Type Distribution */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Service Type Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.statistics?.serviceTypeDistribution?.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{item.type}</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {item.percentage}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Users:</span>
                  <span>{item.total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Active:</span>
                  <span>{item.activeSubscriptions}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Revenue:</span>
                  <span>${(item.revenue / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.data?.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.username}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(user)}
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                title="View Details"
              >
                <FaEye size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service Type</span>
                <span className="font-semibold">{user.serviceType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-sm ${user.subscriptionStatus === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {user.subscriptionStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Date</span>
                <span>{new Date(user.subscriptionDetails?.paymentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount</span>
                <span>
                  {user.subscriptionDetails?.amountReceived
                    ? `$${(user.subscriptionDetails.amountReceived / 100).toFixed(2)}`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">End Date</span>
                <span>
                  {user.subscriptionDetails?.subscriptionEndDate
                    ? new Date(user.subscriptionDetails.subscriptionEndDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <button
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            disabled={filters.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Page {filters.page} of {data.pagination?.pages || 1}
          </span>
          <button
            onClick={() => setFilters(prev => ({
              ...prev,
              page: Math.min(prev.page + 1, data.pagination?.pages || 1)
            }))}
            disabled={filters.page === (data.pagination?.pages || 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-center text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPremiumReports;