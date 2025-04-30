"use client"
import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function AdminCompanyRequestTow() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [page, search, fromDate, toDate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        search,
        fromDate,
        toDate
      }).toString();

      const response = await fetch(`/api/CompanyRequestTower?${queryParams}`);
      const data = await response.json();

      setRequests(data.requests);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDateChange = (type, value) => {
    if (type === 'from') setFromDate(value);
    else setToDate(value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const Modal = ({ request, onClose }) => {
    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Request Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Request ID</h3>
              <p>{request._id}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Vehicle Information</h3>
              <p>Type: {request.vehicleType}</p>
              <p>Number: {request.vehicleNumber}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{request.location}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Users</h3>
              {request.users?.map(user => (
                <div key={user.id} className="flex items-center mt-2">
                  <img
                    src={user.avatar?.url || '/placeholder-avatar.jpg'}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-gray-500">{user.phone}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="font-semibold">Status</h3>
              <span className={`px-2 py-1 inline-flex text-sm font-semibold rounded-full 
                ${request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {request.status}
              </span>
            </div>
            
            <div>
              <h3 className="font-semibold">Date Created</h3>
              <p>{formatDate(request.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tow Requests</h1>
        <p className="text-gray-600">Manage and monitor Tow service requests</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleDateChange('from', e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">No requests found</td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.vehicleType.slice(0, 20)}</div>
                      <div className="text-sm text-gray-500">{request.vehicleNumber.slice(0, 20)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.location.slice(0, 20)}
                      {request.location.length > 20 && '...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.users?.map(user => (
                        <div key={user.id} className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.avatar?.url || '/admin/user.png'}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username.slice(0, 20)}
                              {user.username.length > 20 && '...'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.phone.slice(0, 20)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {request.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          request={selectedRequest}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}