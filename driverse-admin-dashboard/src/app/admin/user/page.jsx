"use client";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaEdit,
  FaEnvelope,
  FaChartBar,
  FaEye,
  FaPhone,
  FaSearch,
  FaTrash,
  FaUser,
  FaMapMarkerAlt,
  FaCheck,
  FaBan,
  FaClock,
} from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { IoMdClose, IoMdRecording } from "react-icons/io";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bell, DollarSign, NotebookPenIcon } from "lucide-react";
import AnalyticsModal from "../Anlytic/page ";
import CallRecoding from "../AgentRecoding/page";

// UserModal Component
const UserModal = ({
  isOpen,
  onClose,
  user,
  isEditing,
  editedUser,
  setEditedUser,
  onUpdate,
  setIsEditing
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <FaUser className="text-3xl text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit User' : 'User Details'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editedUser.username}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, username: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editedUser.phone}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Address
                  </label>
                  <input
                    type="text"
                    value={editedUser.companyAddress}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        companyAddress: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Company Address</p>
                  <p className="font-medium">{user.companyAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium">{user.serviceType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaBan className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Subscription</p>
                  <p className="font-medium">{user.subscriptionStatus}</p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Dates</p>
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm">
                        <span className="text-gray-500">Created:</span>{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Updated:</span>{" "}
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          {isEditing ? (
            <>
              <button
                onClick={onUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaEdit />
              Edit User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// NotificationModal Component
const NotificationModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          ...formData
        }),
      });

      const data = await response.json();

      console.log(data)
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Bell className="text-2xl text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              Send Notification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body
              </label>
              <input
                type="text"
                required
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Processing...' : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SubscriptionModal Component
const SubscriptionModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    paymentId: '',
    amountReceived: '',
    currency: 'USD',
    subscriptionDuration: '',
    subscriptionStatus: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/assingSub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <DollarSign className="text-2xl text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              Add Subscription
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment ID
              </label>
              <input
                type="text"
                required
                value={formData.paymentId}
                onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Received
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amountReceived}
                onChange={(e) => setFormData({ ...formData, amountReceived: parseFloat(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Duration (days)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.subscriptionDuration}
                onChange={(e) => setFormData({ ...formData, subscriptionDuration: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Processing...' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// TalkTimeRechargeModal Component
const TalkTimeRechargeModal = ({ isOpen, onClose, userId, onRechargeSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/recharge');
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError('Failed to load plans');
    }
  };

  const handleRecharge = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/recharge', {
        userId,
        planid: selectedPlan._id,
        state: "completed"
      });

      setSuccess('Recharge successful!');
      if (onRechargeSuccess) {
        onRechargeSuccess();
      }
    } catch (err) {
      console.error("Error recharging:", err);
      setError(err.response?.data?.error || 'Failed to process recharge');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <DollarSign className="text-2xl text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              Talk Time Recharge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Plan
              </label>
              <div className="grid grid-cols-1 gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan?._id === plan._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{plan.hours} Hours</h3>
                        <p className="text-sm text-gray-600">
                          ${plan.price} - ${plan.costPerHour}/hour
                        </p>
                      </div>
                      <div className="text-lg font-bold">
                        ${plan.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRecharge}
              disabled={loading || !selectedPlan}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                loading || !selectedPlan ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Recharge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AdminUser Component
const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isReocdingModalOpen, setIsReocdingModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  const serviceType = ["Driver", "Company", "Agent", "Tower", "Mechanic"];

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/user`, {
        params: {
          search: searchQuery || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page: page || 1,
          serviceType: selectedServiceType.length ? selectedServiceType.join(",") : undefined,
        },
      });

      setUsers(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, startDate, endDate, page, selectedServiceType]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/guser/${userId}`);
      setSelectedUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(
        `/api/guser/${editedUser._id}`,
        editedUser
      );
      setSelectedUser(response.data);
      setIsEditing(false);
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/guser/${userId}`);
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
        setIsModalOpen(false);
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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

  const handleServiceTypeChange = (type) => {
    setSelectedServiceType(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const removeServiceType = (typeToRemove) => {
    setSelectedServiceType(prev =>
      prev.filter(type => type !== typeToRemove)
    );
  };

  const handleRechargeSuccess = () => {
    fetchData(); // Refresh user data after successful recharge
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="h-full p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            User Management
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 outline-none border-none"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
              onClick={handleDownload}
            >
              <LuDownload size={20} />
              <span>Export </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="p-6 max-w-xl w-full mx-auto">
            <div className="space-y-1">
              <label
                htmlFor="serviceType"
                className="text-sm font-medium text-gray-700"
              >
                Service Type
              </label>

              <div className="flex flex-wrap gap-2 min-h-8 mb-2">
                {selectedServiceType.map(type => (
                  <span
                    key={type}
                    className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-700"
                  >
                    {type}
                    <button
                      onClick={() => removeServiceType(type)}
                      className="ml-1 hover:text-blue-800"
                    >
                      <div className=" bg-blue-100 p-1 text-blue-800 rounded">X</div>
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Select Services
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {serviceType.map(type => (
                      <div
                        key={type}
                        className={`
                      px-4 py-2 cursor-pointer hover:bg-gray-100
                      ${selectedServiceType.includes(type) ? 'bg-blue-50' : ''}
                    `}
                        onClick={() => handleServiceTypeChange(type)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedServiceType.includes(type)}
                            onChange={() => { }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-2">{type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiUser className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{user.username}</h3>
                    <p className="text-sm text-gray-500">{user.serviceType}</p>
                  </div>
                </div>
                <div className={`px-1 py-1 text-center rounded-full text-xs ${user.isVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-600">{user.email?.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone?.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-sm text-gray-600 truncate">{user.companyAddress?.slice(0, 8)}...</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2 ">
                  <button
                    className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsEditing(true);
                      setIsModalOpen(true);
                    }}
                    title="Edit User"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    className="p-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsModalOpen(true);
                    }}
                    title="View Details"
                  >
                    <FaEye size={12}/>
                  </button>

                  <button
                    className="p-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsSubscriptionModalOpen(true);
                    }}
                    title="Add Subscription"
                  >
                    <DollarSign size={12} />
                  </button>

                  <button
                    className="p-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsRechargeModalOpen(true);
                    }}
                    title="Recharge Talk Time"
                  >
                    <NotebookPenIcon size={12} />
                  </button>

                  {user.serviceType === "Agent" && (
                    <button
                      className="p-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        fetchUserDetails(user._id);
                        setIsReocdingModalOpen(true);
                      }}
                      title="Recording Show"
                    >
                      <IoMdRecording size={12}/>
                    </button>
                  )}

                  <button
                    className="p-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsAnalyticsModalOpen(true);
                    }}
                    title="View Analytics"
                  >
                    <FaChartBar size={12} />
                  </button>

                  <button
                    className="p-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsNotificationModalOpen(true);
                    }}
                    title="Send Notification"
                  >
                    <Bell size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-2 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
            setIsEditing(false);
          }}
          user={selectedUser}
          isEditing={isEditing}
          editedUser={editedUser}
          setEditedUser={setEditedUser}
          onUpdate={updateUser}
          setIsEditing={setIsEditing}
        />

        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => {
            setIsSubscriptionModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => {
            setIsNotificationModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        <CallRecoding
          isOpen={isReocdingModalOpen}
          onClose={() => {
            setIsReocdingModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?._id}
        />

        <AnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => {
            setIsAnalyticsModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?._id}
        />

        <TalkTimeRechargeModal
          isOpen={isRechargeModalOpen}
          onClose={() => {
            setIsRechargeModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?._id}
          onRechargeSuccess={handleRechargeSuccess}
        />
      </div>
    </>
  );
};

export default AdminUser;