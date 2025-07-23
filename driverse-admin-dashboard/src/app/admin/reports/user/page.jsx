"use client";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaCalendar,
  FaDownload,
  FaCheckCircle,
  FaEye,
  FaTimes,
  FaDollarSign,
  FaExchangeAlt,
  FaFilter,
} from "react-icons/fa";
import { GiLaurelCrown } from "react-icons/gi";
import { TbCurrencyDollarCanadian } from "react-icons/tb";
import { BsGraphUp, BsCreditCard, BsThreeDotsVertical } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

// Subscription Details Modal Component
const SubscriptionDetailsModal = ({ subscription, onClose }) => {
  if (!subscription) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Subscription Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="text-gray-600 text-lg" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <FaUser className="text-blue-600 text-xl sm:text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{subscription.username}</h3>
              <p className="text-gray-600 text-sm truncate">{subscription.email}</p>
              <p className="text-gray-600 text-sm">Service: <span className="font-medium capitalize">{subscription.serviceType}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
              <GiLaurelCrown className="text-purple-600 text-xl sm:text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Subscription ID: {subscription.stripeSubscriptionId}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${subscription.status === "active"
                    ? "bg-green-100 text-green-800"
                    : subscription.status === "canceled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700 mb-3">
                <FaCalendar className="text-blue-500" />
                Subscription Period
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Start Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">End Date</p>
                  <p className="font-medium text-gray-800">
                    {subscription.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700 mb-3">
                <BsCreditCard className="text-green-500" />
                Billing Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Customer ID</p>
                  <p className="font-medium text-gray-800 truncate">{subscription.stripeCustomerId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Payment Method</p>
                  <p className="font-medium text-gray-800">
                    {subscription.paymentMethod?.card
                      ? `${subscription.paymentMethod.card.brand} ending in ${subscription.paymentMethod.card.last4}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Transaction Details Modal Component
const TransactionDetailsModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="text-gray-600 text-lg" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <FaUser className="text-blue-600 text-xl sm:text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{transaction.username}</h3>
              <p className="text-gray-600 text-sm truncate">{transaction.email}</p>
              <p className="text-gray-600 text-sm">Service: <span className="font-medium capitalize">{transaction.serviceType}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
              <FaExchangeAlt className="text-green-600 text-xl sm:text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Payment ID: {transaction.stripePaymentIntentId}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${transaction.status === "succeeded"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700 mb-3">
                <FaDollarSign className="text-green-500" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Amount</p>
                  <p className="font-medium text-gray-800">
                    ${parseFloat(transaction.amount).toFixed(2)} {transaction.currency.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700 mb-3">
                <BsCreditCard className="text-blue-500" />
                Payment Method
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Customer ID</p>
                  <p className="font-medium text-gray-800 truncate">{transaction.subscriptionId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Payment Method</p>
                  <p className="font-medium text-gray-800">{transaction.paymentMethod || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`p-2 rounded-lg ${color.replace('text', 'bg')} bg-opacity-10`}>
        <Icon className={`${color} text-lg`} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </span>
      )}
    </div>
  </div>
);

// Tab Component
const Tab = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 font-medium text-sm rounded-lg transition-all relative ${active
      ? "bg-white text-blue-600 shadow-sm border border-gray-200"
      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
  >
    {children}
    {count !== undefined && (
      <span className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full ${active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
        {count}
      </span>
    )}
  </button>
);

// Filter Dropdown Component
const FilterDropdown = ({ label, options, selected, onSelect, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${selected.length > 0
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
      >
        <Icon className="text-gray-500" />
        {label}
        {selected.length > 0 && (
          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2 space-y-1">
            {options.map((option) => (
              <label key={option} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onSelect(option)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const AdminPremiumReports = () => {
  const [data, setData] = useState({
    subscriptions: [],
    transactions: [],
    pagination: {
      totalSubscriptions: 0,
      totalTransactions: 0,
      page: 1,
      limit: 10,
      pages: 1,
    },
    statistics: {
      subscriptionStats: [],
      transactionStats: [],
    },
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    fromDate: "",
    toDate: "",
    serviceTypes: [],
    subscriptionStatus: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        serviceType: "Driver",
        subscriptionStatus: filters.subscriptionStatus,
      }).toString();

      const response = await fetch(`/api/getAllPrem?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setData({
          subscriptions: result.data.subscriptions || [],
          transactions: result.data.transactions || [],
          pagination: {
            totalSubscriptions: result.pagination.totalSubscriptions || 0,
            totalTransactions: result.pagination.totalTransactions || 0,
            page: result.pagination.page || 1,
            limit: result.pagination.limit || 10,
            pages: result.pagination.pages || 1,
          },
          statistics: result.statistics || {
            subscriptionStats: [],
            transactionStats: [],
          },
        });
      } else {
        console.error("Error fetching data:", result.message);
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
    setFilters((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter((t) => t !== type)
        : [...prev.serviceTypes, type],
      page: 1,
    }));
  };

  const handleStatusChange = (status) => {
    setFilters((prev) => ({
      ...prev,
      subscriptionStatus: prev.subscriptionStatus === status ? "" : status,
      page: 1,
    }));
  };

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        serviceType: filters.serviceTypes.join(","),
        download: "true",
      }).toString();
      window.location.href = `/api/getAllPrem?${queryParams}`;
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Pagination functions
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const generatePagination = () => {
    const { page, pages } = data.pagination;
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pagesArray = [];
    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }

    return { startPage, endPage, pagesArray };
  };

  const totalSubscriptions = data.pagination.totalSubscriptions || 0;
  const totalTransactions = data.pagination.totalTransactions || 0;
  const totalRevenue = data.statistics.transactionStats.reduce(
    (sum, item) => sum + parseFloat(item.totalAmount || 0),
    0
  );
  const activeSubscriptions = data.statistics.subscriptionStats.reduce(
    (sum, item) => (item.status === "active" ? sum + item.count : sum),
    0
  );

  const serviceTypes = ["Driver", "Tower", "Mechanic", "Company"];
  const statusTypes = ["active", "canceled", "inactive"];

  const { startPage, endPage, pagesArray } = generatePagination();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Premium Reports Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and analyze premium subscriptions and transactions</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaFilter />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                title="Refresh Data"
                disabled={loading}
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                disabled={loading}
              >
                <FaDownload />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={filters.fromDate}
                      onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value, page: 1 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={filters.toDate}
                      onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value, page: 1 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Types</label>

                    <FilterDropdown
                      label="Service Types"
                      options={serviceTypes}
                      selected={filters.serviceTypes}
                      onSelect={handleServiceTypeChange}
                      icon={FaUser}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>

                    <FilterDropdown
                      label="Status"
                      options={statusTypes}
                      selected={filters.subscriptionStatus ? [filters.subscriptionStatus] : []}
                      onSelect={handleStatusChange}
                      icon={FaCheckCircle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Subscriptions"
                value={totalSubscriptions}
                icon={GiLaurelCrown}
                color="text-blue-500"
                trend="up"
                trendValue="12%"
              />
              <StatCard
                title="Active Subscriptions"
                value={activeSubscriptions}
                icon={FaCheckCircle}
                color="text-green-500"
                trend="up"
                trendValue="5%"
              />
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                icon={TbCurrencyDollarCanadian}
                color="text-yellow-500"
                trend="up"
                trendValue="18%"
              />
              <StatCard
                title="Total Transactions"
                value={totalTransactions}
                icon={BsGraphUp}
                color="text-purple-500"
                trend="down"
                trendValue="2%"
              />
            </div>

            {/* Service Distribution */}
            {data.statistics.subscriptionStats.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Service Type Distribution</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.statistics.subscriptionStats.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800 truncate">{item.serviceType || "Unknown"}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {totalSubscriptions > 0 ? Math.round((item.count / totalSubscriptions) * 100) : 0}%
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total:</span>
                          <span className="font-medium text-gray-800">{item.count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "active"
                              ? "bg-green-100 text-green-800"
                              : item.status === "canceled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Main Content Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Tab
                  active={activeTab === "subscriptions"}
                  onClick={() => setActiveTab("subscriptions")}
                  count={data.pagination.totalSubscriptions}
                >
                  Subscriptions
                </Tab>
                <Tab
                  active={activeTab === "transactions"}
                  onClick={() => setActiveTab("transactions")}
                  count={data.pagination.totalTransactions}
                >
                  Transactions
                </Tab>
              </div>

              {activeTab === "subscriptions" && (
                <div className="mt-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {data.subscriptions.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <p className="text-gray-500">No subscriptions found matching your criteria</p>
                        <button
                          onClick={() => setFilters({ ...filters, search: "", serviceTypes: [], subscriptionStatus: "" })}
                          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {data.subscriptions.map((subscription) => (
                              <tr key={subscription._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FaUser className="text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{subscription.username}</div>
                                      <div className="text-sm text-gray-500 truncate max-w-xs">{subscription.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 truncate max-w-xs">{subscription.stripeSubscriptionId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{subscription.serviceType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${subscription.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : subscription.status === "canceled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => setSelectedSubscription(subscription)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    <FaEye className="text-sm" /> View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="mt-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {data.transactions.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <p className="text-gray-500">No transactions found matching your criteria</p>
                        <button
                          onClick={() => setFilters({ ...filters, search: "", serviceTypes: [], subscriptionStatus: "" })}
                          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {data.transactions.map((transaction) => (
                              <tr key={transaction._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FaUser className="text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{transaction.username}</div>
                                      <div className="text-sm text-gray-500 truncate max-w-xs">{transaction.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 truncate max-w-xs">{transaction.stripePaymentIntentId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ${parseFloat(transaction.amount).toFixed(2)} {transaction.currency.toUpperCase()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${transaction.status === "succeeded"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => setSelectedTransaction(transaction)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    <FaEye className="text-sm" /> View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">


                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                    className={`p-2 rounded-lg border ${data.pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <RiArrowLeftSLine className="text-lg" />
                  </button>

                  {startPage > 1 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className={`px-3 py-1 rounded-lg border ${data.pagination.page === 1
                          ? 'bg-blue-100 text-blue-600 border-blue-200'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        1
                      </button>
                      {startPage > 2 && <span className="px-2">...</span>}
                    </>
                  )}

                  {pagesArray.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg border ${data.pagination.page === pageNum
                        ? 'bg-blue-100 text-blue-600 border-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {endPage < data.pagination.pages && (
                    <>
                      {endPage < data.pagination.pages - 1 && <span className="px-2">...</span>}
                      <button
                        onClick={() => handlePageChange(data.pagination.pages)}
                        className={`px-3 py-1 rounded-lg border ${data.pagination.page === data.pagination.pages
                          ? 'bg-blue-100 text-blue-600 border-blue-200'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {data.pagination.pages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={data.pagination.page === data.pagination.pages}
                    className={`p-2 rounded-lg border ${data.pagination.page === data.pagination.pages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <RiArrowRightSLine className="text-lg" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedSubscription && (
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default AdminPremiumReports;