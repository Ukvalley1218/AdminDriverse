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
  FaUser,
  FaMapMarkerAlt,
  FaCheck,
  FaBan,
  FaClock,
  X
} from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
        {/* Modal Header */}
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

        {/* Modal Body */}
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

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
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
  // const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch users data
  const serviceType = ["Driver", "Company", "Agent", "Tower", "Mechanic"];

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/user`, {
        params: {
          search: searchQuery || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page: page || 1,
          serviceType: selectedServiceType.length ? selectedServiceType.join(",") : undefined, // Convert array to comma-separated string
        },
      });

      setUsers(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, startDate, endDate, page, selectedServiceType]);
  // Added selectedServiceType as a dependency


  // Fetch single user data
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/guser/${userId}`);
      setSelectedUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Update user
  const updateUser = async () => {
    try {
      const response = await axios.put(
        `/api/guser/${editedUser._id}`,
        editedUser
      );
      setSelectedUser(response.data);
      setIsEditing(false);
      fetchData(); // Refresh the list
      // Optional: Show success message
    } catch (error) {
      console.error("Error updating user:", error);
      // Optional: Show error message
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/guser/${userId}`);
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
        setIsModalOpen(false);
      }
      fetchData(); // Refresh the list
      // Optional: Show success message
    } catch (error) {
      console.error("Error deleting user:", error);
      // Optional: Show error message
    }
  };

  // Generate and download PDF
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


  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="h-full p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            User Management
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
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
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleDownload}
            >
              <LuDownload size={20} />
              <span>Export Users</span>
            </button>
          </div>
        </div>

        {/* Date Range Section */}






        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">


          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div className="p-6 max-w-xl w-full mx-auto">



            <div className="space-y-1">
              <label
                htmlFor="serviceType"
                className="text-sm font-medium text-gray-700"
              >
                Service Type
              </label>

              {/* Selected Items Tags */}
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

              {/* Custom Dropdown */}
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

            {/* Debug View */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Selected Services:</p>
              <p className="text-sm">{selectedServiceType.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                <div className="flex gap-4 ">
                  <button
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsEditing(true);
                      setIsModalOpen(true);
                    }}
                    title="Edit User"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      fetchUserDetails(user._id);
                      setIsModalOpen(true);
                    }}
                    title="View Details"
                  >
                    <FaEye />
                  </button>

                  <button
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    onClick={() => deleteUser(user._id)}
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
        </div>

        {/* User Modal */}
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
      </div>
    </>
  );
};

export default AdminUser;